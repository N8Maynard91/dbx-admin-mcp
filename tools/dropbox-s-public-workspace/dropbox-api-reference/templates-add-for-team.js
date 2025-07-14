/**
 * Function to add a template associated with a team in Dropbox.
 *
 * @param {Object} args - Arguments for adding the template.
 * @param {string} args.name - The name of the template.
 * @param {string} args.description - A description of the template.
 * @param {Array<Object>} args.fields - An array of field objects that define the template.
 * @returns {Promise<Object>} - The result of the template addition.
 */
const executeFunction = async ({ name, description, fields }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/templates/add_for_team';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    name,
    description,
    fields
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json'
    };

    // If a token is provided, add it to the Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

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
    console.error('Error adding template:', error);
    return { error: 'An error occurred while adding the template.' };
  }
};

/**
 * Tool configuration for adding a template associated with a team in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_template_for_team',
      description: 'Add a template associated with a team in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the template.'
          },
          description: {
            type: 'string',
            description: 'A description of the template.'
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
                description: {
                  type: 'string',
                  description: 'A description of the field.'
                },
                type: {
                  type: 'string',
                  description: 'The type of the field.'
                }
              },
              required: ['name', 'description', 'type']
            },
            description: 'An array of field objects that define the template.'
          }
        },
        required: ['name', 'description', 'fields']
      }
    }
  }
};

export { apiTool };