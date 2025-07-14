/**
 * Function to save data from a specified URL into a file in the user's Dropbox.
 *
 * @param {Object} args - Arguments for saving the URL.
 * @param {string} args.path - The path in Dropbox where the file will be saved.
 * @param {string} args.url - The URL from which to save the data.
 * @returns {Promise<Object>} - The result of the save operation.
 */
const executeFunction = async ({ path, url }) => {
  const accessToken = ''; // will be provided by the user
  const apiUrl = 'https://api.dropboxapi.com/2/files/save_url';

  const body = JSON.stringify({ path, url });

  // Set up headers for the request
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  try {
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
    console.error('Error saving URL to Dropbox:', error);
    return { error: 'An error occurred while saving the URL to Dropbox.' };
  }
};

/**
 * Tool configuration for saving a URL to Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'save_url',
      description: 'Save data from a specified URL into a file in the user\'s Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path in Dropbox where the file will be saved.'
          },
          url: {
            type: 'string',
            description: 'The URL from which to save the data.'
          }
        },
        required: ['path', 'url']
      }
    }
  }
};

export { apiTool };