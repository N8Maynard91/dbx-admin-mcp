/**
 * Function to continue searching in Dropbox.
 *
 * @param {Object} args - Arguments for the search continuation.
 * @param {string} args.cursor - The cursor returned from the previous search request.
 * @returns {Promise<Object>} - The result of the search continuation.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/files/search/continue_v2';
  const accessToken = ''; // will be provided by the user

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Construct the body of the request
    const body = JSON.stringify({ cursor });

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
    console.error('Error continuing search in Dropbox:', error);
    return { error: 'An error occurred while continuing the search.' };
  }
};

/**
 * Tool configuration for continuing search in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'search_continue',
      description: 'Continue searching in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor returned from the previous search request.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };