/**
 * Function to download a file from a shared link on Dropbox.
 *
 * @param {Object} args - Arguments for the file download.
 * @param {string} args.url - The shared link URL of the file to download.
 * @param {string} args.path - The path in Dropbox where the file is located.
 * @returns {Promise<Object>} - The result of the file download.
 */
const executeFunction = async ({ url, path }) => {
  const accessToken = ''; // will be provided by the user
  const apiUrl = 'https://content.dropboxapi.com/2/sharing/get_shared_link_file';

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Dropbox-API-Arg': JSON.stringify({
        url: url,
        path: path
      }),
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(apiUrl, {
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
    console.error('Error downloading file from shared link:', error);
    return { error: 'An error occurred while downloading the file.' };
  }
};

/**
 * Tool configuration for downloading a file from a shared link on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_shared_link_file',
      description: 'Download a file from a shared link on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The shared link URL of the file to download.'
          },
          path: {
            type: 'string',
            description: 'The path in Dropbox where the file is located.'
          }
        },
        required: ['url', 'path']
      }
    }
  }
};

export { apiTool };