/**
 * Function to remove custom quota for team members in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {Array} args.users - An array of user objects to remove custom quota for.
 * @returns {Promise<Object>} - The response from the Dropbox API.
 */
const executeFunction = async ({ users }) => {
  const url = 'https://api.dropboxapi.com/2/team/member_space_limits/remove_custom_quota';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Prepare the request body
    const body = JSON.stringify({ users });

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
    console.error('Error removing custom quota:', error);
    return { error: 'An error occurred while removing custom quota.' };
  }
};

/**
 * Tool configuration for removing custom quota for team members in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'remove_custom_quota',
      description: 'Remove custom quota for team members in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                '.tag': {
                  type: 'string',
                  description: 'The tag indicating the type of user.'
                },
                team_member_id: {
                  type: 'string',
                  description: 'The ID of the team member.'
                }
              },
              required: ['.tag', 'team_member_id']
            },
            description: 'An array of user objects to remove custom quota for.'
          }
        },
        required: ['users']
      }
    }
  }
};

export { apiTool };