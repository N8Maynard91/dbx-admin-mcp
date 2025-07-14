/**
 * Function to continue listing groups in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.cursor - The cursor obtained from the previous `groups/list` request.
 * @returns {Promise<Object>} - The result of the groups listing continuation.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/list/continue';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Prepare the request body
    const body = JSON.stringify({ cursor });

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
    console.error('Error continuing group listing:', error);
    return { error: 'An error occurred while continuing group listing.' };
  }
};

/**
 * Tool configuration for continuing group listing in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'continue_group_listing',
      description: 'Continue listing groups in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor obtained from the previous `groups/list` request.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };