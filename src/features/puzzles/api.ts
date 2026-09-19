import { supabase } from '../../lib/supabaseClient';
import type { DailyLog, LogStatus, Puzzle } from '../../lib/types';

export async function fetchPuzzles(): Promise<Puzzle[]> {
  const { data, error } = await supabase
    .from('puzzles')
    .select('*')
    .eq('is_archived', false)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Puzzle[];
}

export async function createPuzzle(name: string, url: string): Promise<Puzzle> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('puzzles')
    .insert({ user_id: user.id, name: name.trim(), url: url.trim() })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Puzzle;
}

export async function fetchArchivedPuzzles(): Promise<Puzzle[]> {
  const { data, error } = await supabase
    .from('puzzles')
    .select('*')
    .eq('is_archived', true)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Puzzle[];
}

export async function archivePuzzle(id: string): Promise<void> {
  const { error } = await supabase.from('puzzles').update({ is_archived: true }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function restorePuzzle(id: string): Promise<void> {
  const { error } = await supabase.from('puzzles').update({ is_archived: false }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePuzzle(id: string): Promise<void> {
  const { error } = await supabase.from('puzzles').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchRecentLogs(puzzleIds: string[], days = 60): Promise<DailyLog[]> {
  if (puzzleIds.length === 0) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .in('puzzle_id', puzzleIds)
    .gte('date', sinceISO)
    .order('date', { ascending: true });
  if (error) throw new Error(error.message);
  return data as DailyLog[];
}

export async function upsertLog(puzzleId: string, date: string, status: LogStatus): Promise<DailyLog> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  // One entry per puzzle per day — relies on UNIQUE(puzzle_id, date).
  const { data, error } = await supabase
    .from('daily_logs')
    .upsert({ puzzle_id: puzzleId, user_id: user.id, date, status }, { onConflict: 'puzzle_id,date' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DailyLog;
}
