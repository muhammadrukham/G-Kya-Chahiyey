
import { supabase } from './supabase';

export const db = {
  /**
   * Real-time listener for Supabase
   */
  subscribe(tableName: string, callback: (data: any[]) => void) {
    // Initial fetch
    this.fetchAll(tableName).then(data => {
      callback(data || []);
    }).catch(err => {
      console.error(`Initial fetch failed for ${tableName}:`, err);
      callback([]); 
    });

    // Set up real-time subscription
    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        async () => {
          const freshData = await this.fetchAll(tableName);
          callback(freshData || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async fetchAll(tableName: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      
      if (error) return [];
      return data || [];
    } catch (e) {
      console.error(`Fetch error for ${tableName}:`, e);
      return [];
    }
  },

  async save(tableName: string, id: string, data: any): Promise<void> {
    try {
      // Clean the data of any potential undefined/invalid fields
      const cleanData = JSON.parse(JSON.stringify(data));
      const { error } = await supabase
        .from(tableName)
        .upsert({ ...cleanData, id });
      
      if (error) throw error;
    } catch (e) {
      console.error(`Save error for ${tableName}:`, e);
    }
  },

  async remove(tableName: string, id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error(`Delete error for ${tableName}:`, e);
    }
  }
};
