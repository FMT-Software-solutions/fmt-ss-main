import { createClient as createServerClient } from '@/lib/supabase/server';
import { PlatformConfig } from '@/types/config';

/**
 * Server-side platform config service
 * Use this in server components and API routes
 */
export class PlatformConfigServerService {
  /**
   * Fetch the platform configuration from Supabase (server-side)
   */
  static async getPlatformConfig(): Promise<PlatformConfig | null> {
    try {
      const supabase = await createServerClient();
      
      const { data, error } = await supabase
        .from('platform_config')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching platform config (server):', error);
        return null;
      }

      return data as PlatformConfig;
    } catch (error) {
      console.error('Unexpected error fetching platform config (server):', error);
      return null;
    }
  }

  /**
   * Update platform configuration (server-side)
   */
  static async updatePlatformConfig(config: Partial<PlatformConfig>): Promise<PlatformConfig | null> {
    try {
      const supabase = await createServerClient();
      
      const { data, error } = await supabase
        .from('platform_config')
        .update(config)
        .select()
        .single();

      if (error) {
        console.error('Error updating platform config (server):', error);
        return null;
      }

      return data as PlatformConfig;
    } catch (error) {
      console.error('Unexpected error updating platform config (server):', error);
      return null;
    }
  }
}

// Export convenience instance
export const platformConfigServer = PlatformConfigServerService;