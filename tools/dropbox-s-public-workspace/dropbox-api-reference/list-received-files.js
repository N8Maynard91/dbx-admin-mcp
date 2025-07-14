/**
 * Function to list files received by the current user on Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {number} [args.limit=100] - The maximum number of files to return.
 * @param {Array} [args.actions=[]] - Actions to perform on the files.
 * @returns {Promise<Object>} - The response containing the list of received files.
 */
const executeFunction = async ({ limit = 100, actions = [] }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_received_files';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    limit,
    actions
  });

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
    console.error('Error listing received files:', error);
    return { error: 'An error occurred while listing received files.' };
  }
};

/**
 * Tool configuration for listing received files on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_received_files',
      description: 'List files received by the current user on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of files to return.'
          },
          actions: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Actions to perform on the files.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };