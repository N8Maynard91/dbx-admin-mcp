/**
 * Function to get all folders associated with a specific team member.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.member_id - The team member ID (e.g., "dbmid:...")
 * @returns {Promise<Object>} - The result containing all folders for the user.
 */
const executeFunction = async ({ member_id }) => {
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  
  if (!member_id) {
    return { error: 'Member ID is required. Use list_members to get member IDs.' };
  }

  try {
    const results = {
      personal_folders: null,
      team_folders: null,
      shared_folders: null,
      error: null
    };

    // 1. Get personal folders for the user
    console.log('Getting personal folders for user:', member_id);
    try {
      const personalResponse = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Dropbox-API-Select-User': member_id
        },
        body: JSON.stringify({
          path: '',
          recursive: false,
          include_deleted: false
        })
      });

      if (personalResponse.ok) {
        results.personal_folders = await personalResponse.json();
      } else {
        const errorText = await personalResponse.text();
        results.error = `Personal folders error: ${errorText}`;
      }
    } catch (error) {
      results.error = `Personal folders error: ${error.message}`;
    }

    // 2. Get team folders (available to all team members)
    console.log('Getting team folders...');
    try {
      const teamResponse = await fetch('https://api.dropboxapi.com/2/team/team_folder/list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 100 })
      });

      if (teamResponse.ok) {
        results.team_folders = await teamResponse.json();
      } else {
        const errorText = await teamResponse.text();
        if (!results.error) results.error = `Team folders error: ${errorText}`;
      }
    } catch (error) {
      if (!results.error) results.error = `Team folders error: ${error.message}`;
    }

    // 3. Get shared folders for the user
    console.log('Getting shared folders for user:', member_id);
    try {
      const sharedResponse = await fetch('https://api.dropboxapi.com/2/sharing/list_folders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Dropbox-API-Select-User': member_id
        },
        body: JSON.stringify({ limit: 100 })
      });

      if (sharedResponse.ok) {
        results.shared_folders = await sharedResponse.json();
      } else {
        const errorText = await sharedResponse.text();
        if (!results.error) results.error = `Shared folders error: ${errorText}`;
      }
    } catch (error) {
      if (!results.error) results.error = `Shared folders error: ${error.message}`;
    }

    return results;
  } catch (error) {
    console.error('Error getting user folders:', error);
    return { error: 'An error occurred while getting user folders.' };
  }
};

/**
 * Tool configuration for getting all folders associated with a team member.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_user_folders',
      description: 'Get all folders associated with a specific team member (personal, team, and shared folders).',
      parameters: {
        type: 'object',
        properties: {
          member_id: {
            type: 'string',
            description: 'The team member ID (e.g., "dbmid:..."). Use list_members to get member IDs.'
          }
        },
        required: ['member_id']
      }
    }
  }
};

export { apiTool }; 