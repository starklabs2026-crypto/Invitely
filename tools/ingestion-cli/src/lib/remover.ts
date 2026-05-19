import fetch from 'node-fetch';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { openai, supabase } from './clients';
import type { ProposedZone } from '../types';

/**
 * Downloads image, creates a mask over each text zone's bounding box,
 * runs DALL-E 2 inpainting, uploads the clean result to template-drafts bucket.
 *
 * NOTE: DALL-E 2 inpainting requires a square PNG ≤ 4MB.
 * Strategy: pad the portrait image to square, inpaint, crop back.
 *
 * Only needed when has_baked_text = true.
 */
export async function removeTextFromBackground(
  imageUrl: string,
  templateId: string,
  zones: ProposedZone[]
): Promise<string> {
  console.log(`  → Removing baked-in text for ${templateId}...`);

  // 1. Download original image
  const response = await fetch(imageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());

  // 2. Get image dimensions
  const meta = await sharp(buffer).metadata();
  const origW = meta.width!;
  const origH = meta.height!;
  const side = Math.max(origW, origH);

  // 3. Pad to square (add padding to shorter dimension)
  const padLeft  = Math.floor((side - origW) / 2);
  const padTop   = Math.floor((side - origH) / 2);
  const squareImg = await sharp(buffer)
    .extend({ top: padTop, bottom: side - origH - padTop, left: padLeft, right: side - origW - padLeft, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 4. Build mask: black everywhere, white (transparent) over text zones
  const maskPixels = Buffer.alloc(side * side * 4, 0); // RGBA black = keep
  for (const zone of zones) {
    const x0 = Math.floor(((zone.leftPct / 100) * origW) + padLeft);
    const y0 = Math.floor(((zone.topPct  / 100) * origH) + padTop);
    const x1 = Math.min(side, x0 + Math.ceil((zone.widthPct  / 100) * origW));
    const y1 = Math.min(side, y0 + Math.ceil((zone.heightPct / 100) * origH));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const idx = (y * side + x) * 4;
        maskPixels[idx]     = 0;   // R
        maskPixels[idx + 1] = 0;   // G
        maskPixels[idx + 2] = 0;   // B
        maskPixels[idx + 3] = 0;   // A=0 = transparent = "paint here"
      }
    }
  }

  const maskBuffer = await sharp(maskPixels, { raw: { width: side, height: side, channels: 4 } })
    .resize(1024, 1024)
    .png()
    .toBuffer();
  const squareResized = await sharp(squareImg).resize(1024, 1024).png().toBuffer();

  // 5. Save to temp files (DALL-E API requires File-like objects)
  const tmpDir  = os.tmpdir();
  const imgPath  = path.join(tmpDir, `${templateId}-img.png`);
  const maskPath = path.join(tmpDir, `${templateId}-mask.png`);
  fs.writeFileSync(imgPath, squareResized);
  fs.writeFileSync(maskPath, maskBuffer);

  // 6. Call DALL-E 2 inpainting
  const editResponse = await openai.images.edit({
    model: 'dall-e-2',
    image: fs.createReadStream(imgPath) as unknown as File,
    mask:  fs.createReadStream(maskPath) as unknown as File,
    prompt: 'seamless background continuation matching the surrounding texture and color, no text, clean surface',
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json',
  });

  const b64 = editResponse.data[0]?.b64_json;
  if (!b64) throw new Error('DALL-E 2 returned no image data');

  // 7. Restore to original dimensions: unembed padding
  const editedBuffer = Buffer.from(b64, 'base64');
  const cleanBuffer = await sharp(editedBuffer)
    .resize(side, side)
    .extract({ left: padLeft, top: padTop, width: origW, height: origH })
    .png()
    .toBuffer();

  // 8. Upload to template-drafts bucket
  const uploadPath = `${templateId}/bg-clean.png`;
  const { error } = await supabase.storage
    .from('template-drafts')
    .upload(uploadPath, cleanBuffer, { contentType: 'image/png', upsert: true });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage.from('template-drafts').getPublicUrl(uploadPath);

  // Clean up temp files
  fs.unlinkSync(imgPath);
  fs.unlinkSync(maskPath);

  console.log(`  ✓ Clean background uploaded: ${urlData.publicUrl}`);
  return urlData.publicUrl;
}
