/**
 * Function to download a folder from Dropbox as a zip file.
 *
 * @param {Object} args - Arguments for the download.
 * @param {string} args.path - The path of the folder to download.
 * @returns {Promise<Object>} - The result of the download request.
 */
const executeFunction = async ({ path }) => {
  const url = 'https://content.dropboxapi.com/2/files/download_zip';
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

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error downloading zip:', error);
    return { error: 'An error occurred while downloading the zip file.' };
  }
};

/**
 * Tool configuration for downloading a folder as a zip file from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'download_zip',
      description: 'Download a folder from Dropbox as a zip file.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the folder to download.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };