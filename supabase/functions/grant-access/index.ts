import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  memberId: string;
  role: 'admin' | 'viewer';
  tempPassword: string;
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
    const { memberId, role, tempPassword } = (await req.json()) as RequestBody;
    if (!memberId || !role || !tempPassword) {
      throw new Error('Member ID, role, and temporary password are required');
    }

    // Get the member details from organization_members
    const { data: member, error: memberError } = await supabaseAdmin
      .from('organization_members')
      .select('*')
      .eq('id', memberId)
      .single();

    if (memberError) throw memberError;
    if (!member) throw new Error('Member not found');

    // Create auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: member.email,
      password: tempPassword,
      email_confirm: true,
    });

    if (authError) throw authError;

    // Create user profile
    const { error: userError } = await supabaseAdmin.from('users').insert({
      id: authUser.user.id,
      email: member.email,
      firstName: member.firstName,
      lastName: member.lastName,
      position: member.position,
    });

    if (userError) throw userError;

    // Create organization admin entry
    const { error: adminError } = await supabaseAdmin.from('organization_admins').insert({
      user_id: authUser.user.id,
      organization_id: member.organization_id,
      role: role,
    });

    if (adminError) throw adminError;

    // Delete from organization_members
    const { error: deleteError } = await supabaseAdmin
      .from('organization_members')
      .delete()
      .eq('id', memberId);

    if (deleteError) throw deleteError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Access granted successfully',
        user: authUser.user,
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