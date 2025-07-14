/**
 * Function to continue listing file requests in Dropbox.
 *
 * @param {Object} args - Arguments for the continuation of file requests.
 * @param {string} args.cursor - The cursor obtained from a previous call to `list:2` or `list/continue`.
 * @returns {Promise<Object>} - The result of the file requests continuation.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/file_requests/list/continue';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
    console.error('Error continuing file requests:', error);
    return { error: 'An error occurred while continuing file requests.' };
  }
};

/**
 * Tool configuration for continuing file requests in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_continue',
      description: 'Continue listing file requests in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor obtained from a previous call to `list:2` or `list/continue`.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };