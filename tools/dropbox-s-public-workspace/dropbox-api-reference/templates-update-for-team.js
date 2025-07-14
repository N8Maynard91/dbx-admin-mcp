/**
 * Function to update a template associated with a team in Dropbox.
 *
 * @param {Object} args - Arguments for the template update.
 * @param {string} args.template_id - The ID of the template to update.
 * @param {string} args.name - The new name for the template.
 * @param {string} args.description - The new description for the template.
 * @param {Array<Object>} args.add_fields - Optional fields to add to the template.
 * @returns {Promise<Object>} - The result of the template update.
 */
const executeFunction = async ({ template_id, name, description, add_fields }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/templates/update_for_team';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    template_id,
    name,
    description,
    add_fields
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
    console.error('Error updating template:', error);
    return { error: 'An error occurred while updating the template.' };
  }
};

/**
 * Tool configuration for updating a template associated with a team in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_template_for_team',
      description: 'Update a template associated with a team in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          template_id: {
            type: 'string',
            description: 'The ID of the template to update.'
          },
          name: {
            type: 'string',
            description: 'The new name for the template.'
          },
          description: {
            type: 'string',
            description: 'The new description for the template.'
          },
          add_fields: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the field to add.'
                },
                description: {
                  type: 'string',
                  description: 'The description of the field to add.'
                },
                type: {
                  type: 'string',
                  description: 'The type of the field to add.'
                }
              },
              required: ['name', 'description', 'type']
            },
            description: 'Optional fields to add to the template.'
          }
        },
        required: ['template_id', 'name', 'description']
      }
    }
  }
};

export { apiTool };