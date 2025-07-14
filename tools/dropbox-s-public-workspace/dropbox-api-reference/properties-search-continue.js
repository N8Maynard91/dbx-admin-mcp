/**
 * Function to continue searching for properties in Dropbox.
 *
 * @param {Object} args - Arguments for the search continuation.
 * @param {string} args.cursor - The cursor obtained from the previous search request.
 * @returns {Promise<Object>} - The result of the properties search continuation.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/properties/search/continue';
  const accessToken = ''; // will be provided by the user

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  const body = JSON.stringify({ cursor });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error continuing properties search:', error);
    return { error: 'An error occurred while continuing the properties search.' };
  }
};

/**
 * Tool configuration for continuing properties search in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'properties_search_continue',
      description: 'Continue searching for properties in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor obtained from the previous search request.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };