export interface PlatformConfig {
    id: string;
    created_at: Date;
    updated_at: Date;
   user_feature_flags: {
    public_projects: boolean;
    free_apps: boolean;
    training: boolean;
    marketplace: boolean;
    stats_counter: boolean; 
   };
   admin_feature_flags: {
   }

}