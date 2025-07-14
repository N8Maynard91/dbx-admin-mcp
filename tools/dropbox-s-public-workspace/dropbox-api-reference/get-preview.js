/**
 * Function to get a preview of a file from Dropbox.
 *
 * @param {Object} args - Arguments for the preview request.
 * @param {string} args.path - The path of the file for which to get the preview.
 * @returns {Promise<Object>} - The result of the preview request.
 */
const executeFunction = async ({ path }) => {
  const url = 'https://content.dropboxapi.com/2/files/get_preview';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Dropbox-API-Arg': JSON.stringify({ path })
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers
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
    console.error('Error getting file preview:', error);
    return { error: 'An error occurred while getting the file preview.', details: error.message };
  }
};

/**
 * Tool configuration for getting a file preview from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_preview',
      description: 'Get a preview for a file from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file for which to get the preview.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };