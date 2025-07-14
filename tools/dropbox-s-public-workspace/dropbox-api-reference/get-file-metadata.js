/**
 * Function to get file metadata from Dropbox.
 *
 * @param {Object} args - Arguments for the file metadata request.
 * @param {string} args.file - The file identifier for which to retrieve metadata.
 * @param {Array} [args.actions=[]] - Optional actions to perform on the file.
 * @returns {Promise<Object>} - The metadata of the requested file.
 */
const executeFunction = async ({ file, actions = [] }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/get_file_metadata';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ file, actions });

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
    console.error('Error getting file metadata:', error);
    return { error: 'An error occurred while getting file metadata.', details: error.message };
  }
};

/**
 * Tool configuration for getting file metadata from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_file_metadata',
      description: 'Retrieve metadata for a shared file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The file identifier for which to retrieve metadata.'
          },
          actions: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Optional actions to perform on the file.'
          }
        },
        required: ['file']
      }
    }
  }
};

export { apiTool };