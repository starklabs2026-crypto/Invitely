import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';
import type { User } from '@/types/auth';

function mapSession(session: Session): User {
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    displayName: session.user.user_metadata?.full_name ?? null,
    photoURL: session.user.user_metadata?.avatar_url ?? null,
    plan: 'free',
  };
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return mapSession(data.session);
}

export type SignUpResult =
  | { status: 'ok'; user: User }
  | { status: 'confirm_email' };

export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: displayName } },
  });
  if (error) throw error;
  if (!data.session) return { status: 'confirm_email' };
  return { status: 'ok', user: mapSession(data.session) };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session ? mapSession(session) : null);
  });
  return () => subscription.unsubscribe();
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}
