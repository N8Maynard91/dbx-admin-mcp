/**
 * Function to suspend a member from a Dropbox team.
 *
 * @param {Object} args - Arguments for suspending a member.
 * @param {string} args.team_member_id - The ID of the team member to suspend.
 * @param {boolean} [args.wipe_data=false] - Whether to wipe the member's data.
 * @returns {Promise<Object>} - The result of the suspension request.
 */
const executeFunction = async ({ team_member_id, wipe_data = false }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/suspend';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Construct the request body
    const body = JSON.stringify({
      user: {
        ".tag": "team_member_id",
        team_member_id
      },
      wipe_data
    });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json'
    };

    // If a token is provided, add it to the Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
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
    console.error('Error suspending member:', error);
    return { error: 'An error occurred while suspending the member.' };
  }
};

/**
 * Tool configuration for suspending a member from a Dropbox team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'suspend_member',
      description: 'Suspend a member from a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member to suspend.'
          },
          wipe_data: {
            type: 'boolean',
            description: 'Whether to wipe the member\'s data.'
          }
        },
        required: ['team_member_id']
      }
    }
  }
};

export { apiTool };