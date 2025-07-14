/**
 * Function to download a file from Dropbox.
 *
 * @param {Object} args - Arguments for the download.
 * @param {string} args.path - The path of the file to download from Dropbox.
 * @returns {Promise<Object>} - The result of the file download.
 */
const executeFunction = async ({ path }) => {
  const url = 'https://content.dropboxapi.com/2/files/download';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Dropbox-API-Arg': JSON.stringify({ path })
  };

  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers
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
    console.error('Error downloading file from Dropbox:', error);
    return { error: 'An error occurred while downloading the file.' };
  }
};

/**
 * Tool configuration for downloading files from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'download_file',
      description: 'Download a file from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file to download from Dropbox.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };