/**
 * Function to create multiple folders in Dropbox.
 *
 * @param {Object} args - Arguments for creating folders.
 * @param {Array<string>} args.paths - An array of folder paths to create.
 * @param {boolean} [args.autorename=false] - Whether to autorename the folders if they already exist.
 * @param {boolean} [args.force_async=false] - Whether to force asynchronous creation of folders.
 * @returns {Promise<Object>} - The result of the folder creation request.
 */
const executeFunction = async ({ paths, autorename = false, force_async = false }) => {
  const url = 'https://api.dropboxapi.com/2/files/create_folder_batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    paths,
    autorename,
    force_async
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
    console.error('Error creating folders:', error);
    return { error: 'An error occurred while creating folders.', details: error.message };
  }
};

/**
 * Tool configuration for creating folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_folder_batch',
      description: 'Create multiple folders in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          paths: {
            type: 'array',
            items: {
              type: 'string',
              description: 'The paths of the folders to create.'
            },
            description: 'An array of folder paths to create.'
          },
          autorename: {
            type: 'boolean',
            description: 'Whether to autorename the folders if they already exist.'
          },
          force_async: {
            type: 'boolean',
            description: 'Whether to force asynchronous creation of folders.'
          }
        },
        required: ['paths']
      }
    }
  }
};

export { apiTool };