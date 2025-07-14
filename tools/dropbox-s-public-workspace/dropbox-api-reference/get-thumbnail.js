/**
 * Function to get a thumbnail for a file in Dropbox.
 *
 * @param {Object} args - Arguments for the thumbnail request.
 * @param {string} args.path - The path of the file for which to get the thumbnail.
 * @param {string} [args.format="jpeg"] - The format of the thumbnail (e.g., jpeg, png).
 * @param {string} [args.size="w64h64"] - The size of the thumbnail.
 * @param {string} [args.mode="strict"] - The mode for generating the thumbnail.
 * @returns {Promise<Object>} - The result of the thumbnail request.
 */
const executeFunction = async ({ path, format = 'jpeg', size = 'w64h64', mode = 'strict' }) => {
  const url = 'https://content.dropboxapi.com/2/files/get_thumbnail_v2';
  const accessToken = ''; // will be provided by the user

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Dropbox-API-Arg': JSON.stringify({
      resource: {
        '.tag': 'path',
        path: path
      },
      format: format,
      size: size,
      mode: mode
    })
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting thumbnail:', error);
    return { error: 'An error occurred while getting the thumbnail.' };
  }
};

/**
 * Tool configuration for getting a thumbnail from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_thumbnail',
      description: 'Get a thumbnail for a file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file for which to get the thumbnail.'
          },
          format: {
            type: 'string',
            description: 'The format of the thumbnail (e.g., jpeg, png).'
          },
          size: {
            type: 'string',
            description: 'The size of the thumbnail.'
          },
          mode: {
            type: 'string',
            description: 'The mode for generating the thumbnail.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };