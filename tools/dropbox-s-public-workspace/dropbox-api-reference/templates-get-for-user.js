/**
 * Function to get the schema for a specified template from Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.template_id - The ID of the template to retrieve.
 * @returns {Promise<Object>} - The response from the Dropbox API containing the template schema.
 */
const executeFunction = async ({ template_id }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/templates/get_for_user';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const body = JSON.stringify({ template_id });

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
    console.error('Error getting template schema:', error);
    return { error: 'An error occurred while retrieving the template schema.' };
  }
};

/**
 * Tool configuration for getting the schema of a template from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_template_schema',
      description: 'Get the schema for a specified template from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          template_id: {
            type: 'string',
            description: 'The ID of the template to retrieve.'
          }
        },
        required: ['template_id']
      }
    }
  }
};

export { apiTool };