/**
 * Function to search for property templates in Dropbox.
 *
 * @param {Object} args - Arguments for the search.
 * @param {Array} args.queries - An array of query objects to search for property field values.
 * @param {string} args.template_filter - The filter to apply to the template.
 * @returns {Promise<Object>} - The result of the property search.
 */
const executeFunction = async ({ queries, template_filter }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/properties/search';
  const accessToken = ''; // will be provided by the user

  const body = JSON.stringify({
    queries,
    template_filter
  });

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
    console.error('Error searching for property templates:', error);
    return { error: 'An error occurred while searching for property templates.' };
  }
};

/**
 * Tool configuration for searching property templates in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'search_property_templates',
      description: 'Search for property templates in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          queries: {
            type: 'array',
            description: 'An array of query objects to search for property field values.'
          },
          template_filter: {
            type: 'string',
            description: 'The filter to apply to the template.'
          }
        },
        required: ['queries']
      }
    }
  }
};

export { apiTool };