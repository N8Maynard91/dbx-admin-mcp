/**
 * Function to revoke a list of linked applications for team members in Dropbox.
 *
 * @param {Object} args - Arguments for the revoke linked apps batch.
 * @param {Array<string>} args.app_ids - A list of application IDs to revoke.
 * @returns {Promise<Object>} - The result of the revoke operation.
 */
const executeFunction = async ({ app_ids }) => {
  const url = 'https://api.dropboxapi.com/2/team/linked_apps/revoke_linked_app_batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Prepare the request body
    const body = JSON.stringify({ app_ids });

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
    console.error('Error revoking linked applications:', error);
    return { error: 'An error occurred while revoking linked applications.' };
  }
};

/**
 * Tool configuration for revoking linked applications in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'revoke_linked_app_batch',
      description: 'Revoke a list of linked applications for team members in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          app_ids: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'A list of application IDs to revoke.'
          }
        },
        required: ['app_ids']
      }
    }
  }
};

export { apiTool };