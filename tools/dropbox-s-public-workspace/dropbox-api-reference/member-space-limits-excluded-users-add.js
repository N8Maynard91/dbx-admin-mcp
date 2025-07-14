/**
 * Function to add users to the member space limits excluded users list in Dropbox.
 *
 * @param {Array<Object>} users - An array of user objects to be added.
 * @param {string} users[].tag - The tag indicating the type of user (e.g., "team_member_id").
 * @param {string} users[].team_member_id - The ID of the team member to be added.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (users) => {
  const url = 'https://api.dropboxapi.com/2/team/member_space_limits/excluded_users/add';
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
    console.error('Error adding users to excluded users list:', error);
    return { error: 'An error occurred while adding users to the excluded users list.' };
  }
};

/**
 * Tool configuration for adding users to the member space limits excluded users list in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_excluded_users',
      description: 'Add users to the member space limits excluded users list in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                tag: {
                  type: 'string',
                  description: 'The tag indicating the type of user.'
                },
                team_member_id: {
                  type: 'string',
                  description: 'The ID of the team member to be added.'
                }
              },
              required: ['tag', 'team_member_id']
            },
            description: 'An array of user objects to be added.'
          }
        },
        required: ['users']
      }
    }
  }
};

export { apiTool };