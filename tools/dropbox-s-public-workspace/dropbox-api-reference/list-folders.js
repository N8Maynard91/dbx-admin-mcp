/**
 * Function to list shared folders in Dropbox.
 *
 * @param {Object} args - Arguments for the list folders request.
 * @param {number} [args.limit=100] - The maximum number of shared folders to return.
 * @param {Array} [args.actions=[]] - Actions to perform on the shared folders.
 * @returns {Promise<Object>} - The result of the list folders request.
 */
const executeFunction = async ({ limit = 100, actions = [] }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_folders';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    limit,
    actions
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Dropbox-API-Path-Root': JSON.stringify({ ".tag": "namespace_id", "namespace_id": "2" }),

  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing shared folders:', error);
    return { error: 'An error occurred while listing shared folders.' };
  }
};

/**
 * Tool configuration for listing shared folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_folders',
      description: 'List all shared folders the current user has access to.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of shared folders to return.'
          },
          actions: {
            type: 'array',
            description: 'Actions to perform on the shared folders.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };