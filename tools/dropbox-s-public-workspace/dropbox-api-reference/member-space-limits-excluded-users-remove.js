/**
 * Function to remove users from the member space limits excluded users list in Dropbox.
 *
 * @param {Object} args - Arguments for the removal.
 * @param {Array<Object>} args.users - The list of users to be removed, each specified by their team member ID.
 * @returns {Promise<Object>} - The result of the removal operation.
 */
const executeFunction = async ({ users }) => {
  const url = 'https://api.dropboxapi.com/2/team/member_space_limits/excluded_users/remove';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    users
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
      headers,
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
    console.error('Error removing users from excluded list:', error);
    return { error: 'An error occurred while removing users from the excluded list.' };
  }
};

/**
 * Tool configuration for removing users from the member space limits excluded users list in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'remove_excluded_users',
      description: 'Remove users from member space limits excluded users list in Dropbox.',
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
                  description: 'The team member ID of the user to be removed.'
                }
              },
              required: ['.tag', 'team_member_id']
            },
            description: 'The list of users to be removed from the excluded users list.'
          }
        },
        required: ['users']
      }
    }
  }
};

export { apiTool };