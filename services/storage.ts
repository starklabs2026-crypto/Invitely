import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { supabase } from './supabase';

export async function uploadCard(
  userId: string,
  cardId: string,
  base64Data: string
): Promise<string> {
  const path = `cards/${userId}/${cardId}.png`;
  const byteArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  const { error } = await supabase.storage
    .from('cards')
    .upload(path, byteArray, { contentType: 'image/png', upsert: true });

  if (error) throw new Error(error.message);
  return getSignedUrl(path);
}

export async function getSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('cards')
    .createSignedUrl(path, 3600);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function saveImageToGallery(base64Data: string, filename: string): Promise<void> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('Media library permission denied');

  const fileUri = `${FileSystem.cacheDirectory}${filename}.png`;
  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await MediaLibrary.saveToLibraryAsync(fileUri);
}

export async function writeTempFile(base64Data: string, filename: string): Promise<string> {
  const fileUri = `${FileSystem.cacheDirectory}${filename}.png`;
  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
}
