/**
 * Function to relinquish membership in a designated shared folder on Dropbox.
 *
 * @param {Object} args - Arguments for relinquishing folder membership.
 * @param {string} args.shared_folder_id - The ID of the shared folder to relinquish membership from.
 * @param {boolean} [args.leave_a_copy=false] - Whether to leave a copy of the folder.
 * @returns {Promise<Object>} - The result of the relinquish folder membership operation.
 */
const executeFunction = async ({ shared_folder_id, leave_a_copy = false }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/relinquish_folder_membership';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    shared_folder_id,
    leave_a_copy
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
    console.error('Error relinquishing folder membership:', error);
    return { error: 'An error occurred while relinquishing folder membership.' };
  }
};

/**
 * Tool configuration for relinquishing folder membership on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'relinquish_folder_membership',
      description: 'Relinquish membership in a designated shared folder on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          shared_folder_id: {
            type: 'string',
            description: 'The ID of the shared folder to relinquish membership from.'
          },
          leave_a_copy: {
            type: 'boolean',
            description: 'Whether to leave a copy of the folder.'
          }
        },
        required: ['shared_folder_id']
      }
    }
  }
};

export { apiTool };