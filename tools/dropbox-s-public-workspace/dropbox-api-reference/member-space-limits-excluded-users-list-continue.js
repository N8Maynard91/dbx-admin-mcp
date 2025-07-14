/**
 * Function to continue listing member space limits excluded users in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.cursor - The cursor for pagination to continue the listing.
 * @returns {Promise<Object>} - The result of the excluded users listing.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/team/member_space_limits/excluded_users/list/continue';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ cursor });

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
    console.error('Error continuing the listing of excluded users:', error);
    return { error: 'An error occurred while continuing the listing of excluded users.' };
  }
};

/**
 * Tool configuration for continuing the listing of excluded users in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'continue_excluded_users_listing',
      description: 'Continue listing member space limits excluded users in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor for pagination to continue the listing.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };