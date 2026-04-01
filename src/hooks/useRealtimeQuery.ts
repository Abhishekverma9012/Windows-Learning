import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type TableName = 'profiles' | 'mentor_profiles' | 'learner_profiles' | 'sessions' | 'reviews' | 'wallet_transactions' | 'requirements' | 'proposals' | 'notifications' | 'categories';

interface UseRealtimeQueryOptions {
  table: TableName;
  filter?: { column: string; value: string };
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  enabled?: boolean;
}

export function useRealtimeQuery<T = any>({ table, filter, select = '*', orderBy, enabled = true }: UseRealtimeQueryOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    let query = supabase.from(table).select(select);
    if (filter) query = query.eq(filter.column, filter.value);
    if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });

    const { data: result, error: err } = await query;
    if (err) {
      setError(err.message);
    } else {
      setData((result ?? []) as T[]);
      setError(null);
    }
    setLoading(false);
  }, [table, filter?.column, filter?.value, select, orderBy?.column, orderBy?.ascending, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscription
  useEffect(() => {
    if (!enabled) return;

    const channelFilter = filter
      ? `${filter.column}=eq.${filter.value}`
      : undefined;

    const channel: RealtimeChannel = supabase
      .channel(`realtime-${table}-${filter?.value || 'all'}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table,
        ...(channelFilter ? { filter: channelFilter } : {}),
      }, () => {
        // Re-fetch on any change
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [table, filter?.column, filter?.value, enabled, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useRealtimeSingle<T = any>({ table, filter, select = '*', enabled = true }: Omit<UseRealtimeQueryOptions, 'orderBy'>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !filter) return;
    setLoading(true);
    const { data: result, error: err } = await supabase
      .from(table)
      .select(select)
      .eq(filter.column, filter.value)
      .maybeSingle();

    if (err) {
      setError(err.message);
    } else {
      setData(result as T | null);
      setError(null);
    }
    setLoading(false);
  }, [table, filter?.column, filter?.value, select, enabled]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!enabled || !filter) return;
    const channel = supabase
      .channel(`realtime-single-${table}-${filter.value}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table,
        filter: `${filter.column}=eq.${filter.value}`,
      }, () => { fetchData(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [table, filter?.column, filter?.value, enabled, fetchData]);

  return { data, loading, error, refetch: fetchData };
}
