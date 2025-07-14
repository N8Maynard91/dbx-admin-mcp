/**
 * Function to set a member's access type in a Dropbox group.
 *
 * @param {Object} args - Arguments for setting access type.
 * @param {string} args.group_id - The ID of the group to which the member belongs.
 * @param {string} args.team_member_id - The ID of the team member whose access type is being set.
 * @param {string} args.access_type - The access type to set for the member (e.g., "member").
 * @param {boolean} [args.return_members=true] - Whether to return the updated members list.
 * @returns {Promise<Object>} - The result of the access type update.
 */
const executeFunction = async ({ group_id, team_member_id, access_type, return_members = true }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/members/set_access_type';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    group: {
      ".tag": "group_id",
      group_id: group_id
    },
    user: {
      ".tag": "team_member_id",
      team_member_id: team_member_id
    },
    access_type: access_type,
    return_members: return_members
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
    console.error('Error setting access type:', error);
    return { error: 'An error occurred while setting access type.' };
  }
};

/**
 * Tool configuration for setting a member's access type in a Dropbox group.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'set_access_type',
      description: 'Set a member\'s access type in a Dropbox group.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group to which the member belongs.'
          },
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member whose access type is being set.'
          },
          access_type: {
            type: 'string',
            description: 'The access type to set for the member (e.g., "member").'
          },
          return_members: {
            type: 'boolean',
            description: 'Whether to return the updated members list.'
          }
        },
        required: ['group_id', 'team_member_id', 'access_type']
      }
    }
  }
};

export { apiTool };