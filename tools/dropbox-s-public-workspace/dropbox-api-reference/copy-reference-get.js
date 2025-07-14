/**
 * Function to get a copy reference for a file or folder in Dropbox.
 *
 * @param {Object} args - Arguments for the copy reference request.
 * @param {string} args.path - The path of the file or folder to get a copy reference for.
 * @returns {Promise<Object>} - The response containing the copy reference and metadata.
 */
const executeFunction = async ({ path }) => {
  const url = 'https://api.dropboxapi.com/2/files/copy_reference/get';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const body = JSON.stringify({ path });

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
    console.error('Error getting copy reference:', error);
    return { error: 'An error occurred while getting the copy reference.', details: error.message };
  }
};

/**
 * Tool configuration for getting a copy reference in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'copy_reference_get',
      description: 'Get a copy reference for a file or folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file or folder to get a copy reference for.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };