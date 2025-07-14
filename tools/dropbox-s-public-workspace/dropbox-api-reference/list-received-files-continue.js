/**
 * Function to continue listing received files from Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.cursor - The cursor returned from the previous `list_received_files` call.
 * @returns {Promise<Object>} - The result of the continue listing files request.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_received_files/continue';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const body = JSON.stringify({ cursor });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error continuing to list received files:', error);
    return { error: 'An error occurred while continuing to list received files.' };
  }
};

/**
 * Tool configuration for continuing to list received files on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_received_files_continue',
      description: 'Continue listing received files from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor returned from the previous `list_received_files` call.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };