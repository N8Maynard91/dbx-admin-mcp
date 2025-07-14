/**
 * Function to unshare a file on Dropbox.
 *
 * @param {Object} args - Arguments for the unshare operation.
 * @param {string} args.file - The ID of the file to unshare.
 * @returns {Promise<Object>} - The result of the unshare operation.
 */
const executeFunction = async ({ file }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/unshare_file';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ file });

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
    console.error('Error unsharing the file:', error);
    return { error: 'An error occurred while unsharing the file.' };
  }
};

/**
 * Tool configuration for unsharing a file on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'unshare_file',
      description: 'Unshare a file on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The ID of the file to unshare.'
          }
        },
        required: ['file']
      }
    }
  }
};

export { apiTool };