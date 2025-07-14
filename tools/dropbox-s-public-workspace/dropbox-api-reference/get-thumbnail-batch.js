/**
 * Function to get thumbnails for a list of images from Dropbox.
 *
 * @param {Object} args - Arguments for the thumbnail request.
 * @param {Array} args.entries - An array of entries containing the path, format, size, and mode for each image.
 * @returns {Promise<Object>} - The result of the thumbnail request.
 */
const executeFunction = async ({ entries }) => {
  const url = 'https://content.dropboxapi.com/2/files/get_thumbnail_batch';
  const accessToken = ''; // will be provided by the user

  const body = {
    entries: entries
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
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
    console.error('Error getting thumbnails:', error);
    return { error: 'An error occurred while getting thumbnails.' };
  }
};

/**
 * Tool configuration for getting thumbnails from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_thumbnail_batch',
      description: 'Get thumbnails for a list of images from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          entries: {
            type: 'array',
            description: 'An array of entries containing the path, format, size, and mode for each image.'
          }
        },
        required: ['entries']
      }
    }
  }
};

export { apiTool };