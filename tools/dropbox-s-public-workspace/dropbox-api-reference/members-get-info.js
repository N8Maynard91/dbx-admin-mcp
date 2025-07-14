/**
 * Function to get information about multiple team members in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {Array<Object>} args.members - An array of member objects containing their IDs.
 * @returns {Promise<Object>} - The result of the members' information retrieval.
 */
const executeFunction = async ({ members }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/get_info';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Prepare the request body
    const body = JSON.stringify({ members });

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
    console.error('Error retrieving member information:', error);
    return { error: 'An error occurred while retrieving member information.' };
  }
};

/**
 * Tool configuration for getting member information in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'members_get_info',
      description: 'Get information about multiple team members in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          members: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                '.tag': {
                  type: 'string',
                  description: 'The type of identifier for the team member.'
                },
                team_member_id: {
                  type: 'string',
                  description: 'The ID of the team member.'
                }
              },
              required: ['.tag', 'team_member_id']
            },
            description: 'An array of member objects containing their IDs.'
          }
        },
        required: ['members']
      }
    }
  }
};

export { apiTool };