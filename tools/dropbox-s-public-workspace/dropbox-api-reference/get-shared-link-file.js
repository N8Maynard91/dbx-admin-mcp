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
    console.error('Error downloading file from shared link:', error);
    return { error: 'An error occurred while downloading the file.', details: error.message };
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