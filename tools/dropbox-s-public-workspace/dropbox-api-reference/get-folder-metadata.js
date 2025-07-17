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

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      let errorObj = { status: response.status, raw: text };
      if (typeof data === 'object' && data !== null) {
        if (data.error_summary) errorObj.error_summary = data.error_summary;
        if (data.error && data.error['.tag']) errorObj.error_tag = data.error['.tag'];
        errorObj.details = data;
      }
      return { error: 'Dropbox API error', ...errorObj };
    }

    return data;
  } catch (error) {
    console.error('Error getting folder metadata:', error);
    return { error: 'An error occurred while getting folder metadata.', details: error.message };
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