const supabase = require('../database/supabase');

// This will check if the user is SuperAdmin or Host or admin
async function isSuperAdminOrHost(req, res, next) {
  try {
    const { streamsId, decodedUID } = req.body;
    const { data: RolesData, error: RolesError } = await supabase
      .from('Role')
      .select('Role')
      .eq('uuid', decodedUID)
      .single();

    if (RolesData.Role === 'superadmin') {
      // host is a superAdmin
      req.body.role = 'superadmin';
      next();
    } else {
      // users is a regular user. Need to determine if they are Admin/Guest

      const { data: profileData, error: profileError } = await supabase
        .from('Profile')
        .select('*')
        .eq('id', decodedUID)
        .single();

      if (profileData) {
        // user is host
        if (streamsId === profileData.username) {
          req.body.role = 'host';
          next();
        } else {
          // need the check if they are an admin or guest
          const { data: channelData, error: channelError } = await supabase
            .from('Channel')
            .select('adminUsers')
            .eq('uuid', decodedUID)
            .single();

          if (channelData) {
            if (channelData.adminUsers[profileData.username]) {
              // admin
              req.body.role = 'admin';
              next();
            } else {
              // user
              req.body.role = 'none';
              next();
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = isSuperAdminOrHost;
