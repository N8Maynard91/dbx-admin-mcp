/**
 * Function to unsuspend a member from a Dropbox team.
 *
 * @param {Object} args - Arguments for the unsuspend operation.
 * @param {string} args.team_member_id - The ID of the team member to unsuspend.
 * @returns {Promise<Object>} - The result of the unsuspend operation.
 */
const executeFunction = async ({ team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/unsuspend';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  // Construct the request body
  const body = JSON.stringify({
    user: {
      ".tag": "team_member_id",
      team_member_id
    }
  });

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

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
    console.error('Error unsuspending member:', error);
    return { error: 'An error occurred while unsuspending the member.' };
  }
};

/**
 * Tool configuration for unsuspending a member from a Dropbox team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'unsuspend_member',
      description: 'Unsuspend a member from a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member to unsuspend.'
          }
        },
        required: ['team_member_id']
      }
    }
  }
};

export { apiTool };