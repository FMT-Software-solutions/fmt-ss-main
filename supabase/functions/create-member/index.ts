import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Helper function to log errors
const logError = (phase: string, error: any) => {
  console.error(
    JSON.stringify({
      phase,
      error: error.message,
      details: error.details || error,
      timestamp: new Date().toISOString(),
    })
  );
};

Deno.serve(async (req) => {
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

    const body = await req.json();

    const {
      email,
      password,
      firstName,
      lastName,
      position,
      role,
      organizationId,
    } = body;

    // Validate required fields
    if (!email || !password || !role || !organizationId) {
      throw new Error(
        `Missing required fields: ${JSON.stringify({
          hasEmail: !!email,
          hasPassword: !!password,
          hasRole: !!role,
          hasOrgId: !!organizationId,
        })}`
      );
    }

    // Validate role assignment
    if (role === 'owner') {
      // Get current user's role from organization_members
      const { data: currentUserData, error: currentUserError } =
        await supabaseAdmin
          .from('organization_members')
          .select('role')
          .eq('user_id', req.headers.get('x-user-id'))
          .single();

      if (currentUserError) throw currentUserError;

      if (currentUserData.role !== 'owner') {
        throw new Error('Only owners can assign owner role');
      }
    }

    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      logError('auth_error', authError);
      throw new Error(`Auth error: ${authError.message}`);
    }

    if (!authData.user) {
      logError('auth_no_user', new Error('No user data returned'));
      throw new Error('Failed to create user: No user data returned');
    }

    try {
      // 2. Create user profile
      const { error: profileError } = await supabaseAdmin.from('users').insert({
        id: authData.user.id,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        position: position || null,
        isFirstLogin: true,
      });

      if (profileError) {
        logError('profile_error', profileError);
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Profile error: ${profileError.message}`);
      }

      // 3. Add organization member
      const { error: memberError } = await supabaseAdmin
        .from('organization_members')
        .insert({
          organization_id: organizationId,
          user_id: authData.user.id,
          role,
        });

      if (memberError) {
        logError('member_error', memberError);
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Organization member error: ${memberError.message}`);
      }

      return new Response(JSON.stringify({ user: authData.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
  } catch (error) {
    logError('final_error', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: error.details || null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
