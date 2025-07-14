/**
 * Function to get metadata for a shared link on Dropbox.
 *
 * @param {Object} args - Arguments for the shared link metadata request.
 * @param {string} args.url - The shared link URL.
 * @param {string} args.path - The path of the file in Dropbox.
 * @returns {Promise<Object>} - The metadata of the shared link.
 */
const executeFunction = async ({ url, path }) => {
  const accessToken = ''; // will be provided by the user
  const apiUrl = 'https://api.dropboxapi.com/2/sharing/get_shared_link_metadata';

  try {
    // Set up the request body
    const body = JSON.stringify({ url, path });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Perform the fetch request
    const response = await fetch(apiUrl, {
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
    console.error('Error getting shared link metadata:', error);
    return { error: 'An error occurred while getting shared link metadata.' };
  }
};

/**
 * Tool configuration for getting shared link metadata on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_shared_link_metadata',
      description: 'Get metadata for a shared link on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The shared link URL.'
          },
          path: {
            type: 'string',
            description: 'The path of the file in Dropbox.'
          }
        },
        required: ['url', 'path']
      }
    }
  }
};

export { apiTool };