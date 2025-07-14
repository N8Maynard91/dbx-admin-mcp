/**
 * Function to overwrite property groups associated with a file in Dropbox.
 *
 * @param {Object} args - Arguments for the overwrite operation.
 * @param {string} args.path - The path of the file to overwrite properties for.
 * @param {Array<Object>} args.property_groups - The property groups to overwrite.
 * @returns {Promise<Object>} - The result of the overwrite operation.
 */
const executeFunction = async ({ path, property_groups }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/properties/overwrite';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    path,
    property_groups
  };

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
    console.error('Error overwriting properties:', error);
    return { error: 'An error occurred while overwriting properties.' };
  }
};

/**
 * Tool configuration for overwriting property groups associated with a file in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'overwrite_properties',
      description: 'Overwrite property groups associated with a file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file to overwrite properties for.'
          },
          property_groups: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                template_id: {
                  type: 'string',
                  description: 'The ID of the template for the property group.'
                },
                fields: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'The name of the field.'
                      },
                      value: {
                        type: 'string',
                        description: 'The value of the field.'
                      }
                    },
                    required: ['name', 'value']
                  },
                  description: 'The fields in the property group.'
                }
              },
              required: ['template_id', 'fields']
            },
            description: 'The property groups to overwrite.'
          }
        },
        required: ['path', 'property_groups']
      }
    }
  }
};

export { apiTool };