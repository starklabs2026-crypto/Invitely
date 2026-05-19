import 'dotenv/config';
import { supabase } from './lib/clients';

const DINO_ZONES = [
  {
    id: 'title', label: 'Title', defaultText: 'You Are Invited!',
    leftPct: 15, topPct: 2, widthPct: 70, heightPct: 7,
    fontFamily: 'Pacifico', fontSize: 26, color: '#5D4037',
    align: 'center' as const, bold: false, italic: false,
    effects: { shadow: { offsetX: 1, offsetY: 1, blur: 2, color: 'rgba(255,255,255,0.6)' } },
    confidence: 0.85,
  },
  {
    id: 'name', label: 'Baby Name', defaultText: "Baby's Name",
    leftPct: 12, topPct: 77, widthPct: 76, heightPct: 9,
    fontFamily: 'Pacifico', fontSize: 28, color: '#4E342E',
    align: 'center' as const, bold: false, italic: false,
    effects: null,
    confidence: 0.92,
  },
  {
    id: 'occasion', label: 'Occasion', defaultText: '1st Birthday Party',
    leftPct: 12, topPct: 87, widthPct: 76, heightPct: 4,
    fontFamily: 'Quicksand', fontSize: 16, color: '#5D4037',
    align: 'center' as const, bold: true, italic: false,
    effects: null,
    confidence: 0.88,
  },
  {
    id: 'date', label: 'Date', defaultText: 'Saturday, June 7th 2025',
    leftPct: 12, topPct: 91, widthPct: 76, heightPct: 4,
    fontFamily: 'Nunito', fontSize: 13, color: '#6D4C41',
    align: 'center' as const, bold: false, italic: false,
    effects: null,
    confidence: 0.85,
  },
  {
    id: 'time', label: 'Time', defaultText: '3:00 PM — 6:00 PM',
    leftPct: 12, topPct: 92, widthPct: 76, heightPct: 4,
    fontFamily: 'Nunito', fontSize: 13, color: '#6D4C41',
    align: 'center' as const, bold: false, italic: false,
    effects: null,
    confidence: 0.85,
  },
  {
    id: 'venue', label: 'Venue', defaultText: '123 Jungle Way, Dino Park',
    leftPct: 12, topPct: 95, widthPct: 76, heightPct: 4,
    fontFamily: 'Nunito', fontSize: 11, color: '#6D4C41',
    align: 'center' as const, bold: false, italic: false,
    effects: null,
    confidence: 0.82,
  },
];

async function run() {
  const { error } = await supabase
    .from('templates')
    .update({ text_zones_v2: DINO_ZONES, review_status: 'approved' })
    .eq('id', 'kbday-dino-1st-boy');

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('✓ Manual zones written for kbday-dino-1st-boy');
}

run();
