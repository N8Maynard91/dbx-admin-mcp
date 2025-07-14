/**
 * Function to add property groups to a Dropbox file.
 *
 * @param {Object} args - Arguments for adding properties.
 * @param {string} args.path - The path of the file to which properties will be added.
 * @param {Array<Object>} args.property_groups - An array of property groups to add.
 * @returns {Promise<Object>} - The result of the properties addition.
 */
const executeFunction = async ({ path, property_groups }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/properties/add';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    path,
    property_groups
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
    console.error('Error adding properties to file:', error);
    return { error: 'An error occurred while adding properties to the file.' };
  }
};

/**
 * Tool configuration for adding properties to a Dropbox file.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_file_properties',
      description: 'Add property groups to a Dropbox file.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file to which properties will be added.'
          },
          property_groups: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                template_id: {
                  type: 'string',
                  description: 'The ID of the template to use for the property group.'
                },
                fields: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'The name of the property.'
                      },
                      value: {
                        type: 'string',
                        description: 'The value of the property.'
                      }
                    },
                    required: ['name', 'value']
                  }
                }
              },
              required: ['template_id', 'fields']
            },
            description: 'An array of property groups to add.'
          }
        },
        required: ['path', 'property_groups']
      }
    }
  }
};

export { apiTool };