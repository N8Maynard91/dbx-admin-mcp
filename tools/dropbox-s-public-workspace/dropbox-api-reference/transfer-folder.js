/**
 * Function to transfer ownership of a shared folder in Dropbox.
 *
 * @param {Object} args - Arguments for the folder transfer.
 * @param {string} args.shared_folder_id - The ID of the shared folder to transfer.
 * @param {string} args.to_dropbox_id - The Dropbox ID of the user to whom the folder will be transferred.
 * @returns {Promise<Object>} - The result of the folder transfer operation.
 */
const executeFunction = async ({ shared_folder_id, to_dropbox_id }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/transfer_folder';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    shared_folder_id,
    to_dropbox_id
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
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
    console.error('Error transferring folder:', error);
    return { error: 'An error occurred while transferring the folder.' };
  }
};

/**
 * Tool configuration for transferring ownership of a shared folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'transfer_folder',
      description: 'Transfer ownership of a shared folder to a member of the shared folder.',
      parameters: {
        type: 'object',
        properties: {
          shared_folder_id: {
            type: 'string',
            description: 'The ID of the shared folder to transfer.'
          },
          to_dropbox_id: {
            type: 'string',
            description: 'The Dropbox ID of the user to whom the folder will be transferred.'
          }
        },
        required: ['shared_folder_id', 'to_dropbox_id']
      }
    }
  }
};

export { apiTool };