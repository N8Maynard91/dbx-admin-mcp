/**
 * Function to list member space limits excluded users in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {number} [args.limit=100] - The number of users to return.
 * @returns {Promise<Object>} - The result of the excluded users list request.
 */
const executeFunction = async ({ limit = 100 }) => {
  const url = 'https://api.dropboxapi.com/2/team/member_space_limits/excluded_users/list';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Prepare the request body
    const body = JSON.stringify({ limit });

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
    console.error('Error listing excluded users:', error);
    return { error: 'An error occurred while listing excluded users.' };
  }
};

/**
 * Tool configuration for listing member space limits excluded users in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_excluded_users',
      description: 'List member space limits excluded users in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The number of users to return.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };