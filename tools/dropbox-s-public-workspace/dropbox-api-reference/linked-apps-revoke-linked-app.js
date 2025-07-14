/**
 * Function to revoke a linked application for a team member in Dropbox.
 *
 * @param {Object} args - Arguments for revoking the linked app.
 * @param {string} args.app_id - The ID of the linked application to revoke.
 * @returns {Promise<Object>} - The result of the revoke linked app operation.
 */
const executeFunction = async ({ app_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/linked_apps/revoke_linked_app';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Prepare the request body
    const body = JSON.stringify({ app_id });

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
    console.error('Error revoking linked app:', error);
    return { error: 'An error occurred while revoking the linked app.' };
  }
};

/**
 * Tool configuration for revoking a linked application in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'revoke_linked_app',
      description: 'Revoke a linked application for a team member in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          app_id: {
            type: 'string',
            description: 'The ID of the linked application to revoke.'
          }
        },
        required: ['app_id']
      }
    }
  }
};

export { apiTool };