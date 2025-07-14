/**
 * Function to permanently remove a specified template from Dropbox.
 *
 * @param {Object} args - Arguments for the removal.
 * @param {string} args.template_id - The ID of the template to be removed.
 * @returns {Promise<Object>} - The result of the template removal operation.
 */
const executeFunction = async ({ template_id }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/templates/remove_for_team';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up the request body
    const body = JSON.stringify({ template_id });

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
    console.error('Error removing template:', error);
    return { error: 'An error occurred while removing the template.' };
  }
};

/**
 * Tool configuration for removing a template from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'remove_template',
      description: 'Permanently removes the specified template from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          template_id: {
            type: 'string',
            description: 'The ID of the template to be removed.'
          }
        },
        required: ['template_id']
      }
    }
  }
};

export { apiTool };