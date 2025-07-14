/**
 * Function to delete a file or folder from Dropbox.
 *
 * @param {Object} args - Arguments for the delete operation.
 * @param {string} args.path - The path of the file or folder to delete.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
const executeFunction = async ({ path }) => {
  const url = 'https://api.dropboxapi.com/2/files/delete_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ path });

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
    console.error('Error deleting file or folder:', error);
    return { error: 'An error occurred while deleting the file or folder.', details: error.message };
  }
};

/**
 * Tool configuration for deleting files or folders from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_file_or_folder',
      description: 'Delete a file or folder from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file or folder to delete.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };