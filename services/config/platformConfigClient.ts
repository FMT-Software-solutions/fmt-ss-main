import { createClient as createBrowserClient } from '@/lib/supabase/browser';
import { PlatformConfig } from '@/types/config';

/**
 * Client-side platform config service
 * Use this in client components and hooks
 */
export class PlatformConfigClientService {
  private static instance: PlatformConfigClientService;
  private supabase = createBrowserClient();

  static getInstance(): PlatformConfigClientService {
    if (!PlatformConfigClientService.instance) {
      PlatformConfigClientService.instance = new PlatformConfigClientService();
    }
    return PlatformConfigClientService.instance;
  }

  /**
   * Fetch the platform configuration from Supabase
   */
  async getPlatformConfig(): Promise<PlatformConfig | null> {
    try {
      const { data, error } = await this.supabase
        .from('platform_config')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching platform config:', error);
        return null;
      }

      return data as PlatformConfig;
    } catch (error) {
      console.error('Unexpected error fetching platform config:', error);
      return null;
    }
  }

  /**
   * Update platform configuration
   */
  async updatePlatformConfig(config: Partial<PlatformConfig>): Promise<PlatformConfig | null> {
    try {
      const { data, error } = await this.supabase
        .from('platform_config')
        .update(config)
        .select()
        .single();

      if (error) {
        console.error('Error updating platform config:', error);
        return null;
      }

      return data as PlatformConfig;
    } catch (error) {
      console.error('Unexpected error updating platform config:', error);
      return null;
    }
  }
}

// Export convenience instance
export const platformConfigClient = PlatformConfigClientService.getInstance();