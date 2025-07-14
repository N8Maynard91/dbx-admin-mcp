/**
 * Function to list templates for a user in Dropbox.
 *
 * @param {Object} args - Arguments for the template listing.
 * @param {string} args.namespace_id - The namespace ID for the Dropbox account.
 * @param {string} args.select_user - The user ID to select for the operation.
 * @returns {Promise<Object>} - The result of the template listing.
 */
const executeFunction = async ({ namespace_id, select_user }) => {
  const url = 'https://api.dropboxapi.com/2/file_properties/templates/list_for_user';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  // Set up headers for the request
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Dropbox-API-Path-Root': JSON.stringify({ ".tag": "namespace_id", "namespace_id": namespace_id }),
    'Dropbox-API-Select-User': select_user
  };

  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
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
    console.error('Error listing templates for user:', error);
    return { error: 'An error occurred while listing templates for user.' };
  }
};

/**
 * Tool configuration for listing templates for a user in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_templates_for_user',
      description: 'List template identifiers for a user in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          namespace_id: {
            type: 'string',
            description: 'The namespace ID for the Dropbox account.'
          },
          select_user: {
            type: 'string',
            description: 'The user ID to select for the operation.'
          }
        },
        required: ['namespace_id', 'select_user']
      }
    }
  }
};

export { apiTool };