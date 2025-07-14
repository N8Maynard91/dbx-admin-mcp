/**
 * Function to set admin permissions for a team member in Dropbox.
 *
 * @param {Object} args - Arguments for setting admin permissions.
 * @param {string} args.team_member_id - The ID of the team member to update.
 * @param {string} args.new_role - The new role to assign to the team member.
 * @returns {Promise<Object>} - The result of the permission update.
 */
const executeFunction = async ({ team_member_id, new_role }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/set_admin_permissions';
  const accessToken = ''; // will be provided by the user

  const body = {
    user: {
      '.tag': 'team_member_id',
      team_member_id: team_member_id
    },
    new_role: new_role
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error setting admin permissions:', error);
    return { error: 'An error occurred while setting admin permissions.' };
  }
};

/**
 * Tool configuration for setting admin permissions for a team member in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'set_admin_permissions',
      description: 'Set admin permissions for a team member in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member to update.'
          },
          new_role: {
            type: 'string',
            description: 'The new role to assign to the team member.'
          }
        },
        required: ['team_member_id', 'new_role']
      }
    }
  }
};

export { apiTool };