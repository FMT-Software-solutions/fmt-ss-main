import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  userId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the request body
    const { userId } = (await req.json()) as RequestBody;
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get user details from users table
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    if (!user) throw new Error('User not found');

    // Get organization admin details
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('organization_admins')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (adminError) throw adminError;
    if (!admin) throw new Error('Organization admin not found');

    // Create organization member entry
    const { error: memberError } = await supabaseAdmin.from('organization_members').insert({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      position: user.position,
      organization_id: admin.organization_id,
    });

    if (memberError) throw memberError;

    // Delete the auth user. Due to foreign key constraints with CASCADE:
    // 1. This will automatically delete the user from the users table
    // 2. Which will automatically delete the entry from organization_admins
    // 3. All other related records will be cleaned up through the cascade
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteAuthError) throw deleteAuthError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Access revoked successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.details,
        hint: error.hint,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 