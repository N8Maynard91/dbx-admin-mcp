/**
 * Function to remove properties from a file in Dropbox.
 *
 * @param {Object} args - Arguments for the property removal.
 * @param {string} args.path - The path of the file from which to remove properties.
 * @param {Array<string>} args.property_template_ids - An array of property template IDs to remove.
 * @returns {Promise<Object>} - The result of the property removal operation.
 */
const executeFunction = async ({ path, property_template_ids }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/properties/remove';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    path,
    property_template_ids
  });

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
    console.error('Error removing properties from file:', error);
    return { error: 'An error occurred while removing properties from the file.' };
  }
};

/**
 * Tool configuration for removing properties from a file in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'remove_properties',
      description: 'Remove properties from a file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file from which to remove properties.'
          },
          property_template_ids: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of property template IDs to remove.'
          }
        },
        required: ['path', 'property_template_ids']
      }
    }
  }
};

export { apiTool };