/**
 * Function to get folder metadata from Dropbox.
 *
 * @param {Object} args - Arguments for the folder metadata request.
 * @param {string} args.shared_folder_id - The ID of the shared folder to retrieve metadata for.
 * @param {Array} [args.actions=[]] - Optional actions to perform on the shared folder.
 * @returns {Promise<Object>} - The metadata of the shared folder.
 */
const executeFunction = async ({ shared_folder_id, actions = [] }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/get_folder_metadata';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    shared_folder_id,
    actions
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

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
    console.error('Error getting folder metadata:', error);
    return { error: 'An error occurred while getting folder metadata.' };
  }
};

/**
 * Tool configuration for getting folder metadata from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_folder_metadata',
      description: 'Get metadata for a shared folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          shared_folder_id: {
            type: 'string',
            description: 'The ID of the shared folder to retrieve metadata for.'
          },
          actions: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Optional actions to perform on the shared folder.'
          }
        },
        required: ['shared_folder_id']
      }
    }
  }
};

export { apiTool };