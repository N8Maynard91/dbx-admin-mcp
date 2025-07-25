/**
 * Function to save a copy reference to the user's Dropbox.
 *
 * @param {Object} args - Arguments for the save operation.
 * @param {string} args.copy_reference - The copy reference to save.
 * @param {string} args.path - The path where the copy reference will be saved in Dropbox.
 * @returns {Promise<Object>} - The result of the save operation.
 */
const executeFunction = async ({ copy_reference, path }) => {
  const url = 'https://api.dropboxapi.com/2/files/copy_reference/save';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  // Prepare the request body
  const body = JSON.stringify({
    copy_reference,
    path
  });

  // Set up headers for the request
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
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
    console.error('Error saving copy reference:', error);
    return { error: 'An error occurred while saving the copy reference.', details: error.message };
  }
};

/**
 * Tool configuration for saving a copy reference to Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'save_copy_reference',
      description: 'Save a copy reference to the user\'s Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          copy_reference: {
            type: 'string',
            description: 'The copy reference to save.'
          },
          path: {
            type: 'string',
            description: 'The path where the copy reference will be saved in Dropbox.'
          }
        },
        required: ['copy_reference', 'path']
      }
    }
  }
};

export { apiTool };