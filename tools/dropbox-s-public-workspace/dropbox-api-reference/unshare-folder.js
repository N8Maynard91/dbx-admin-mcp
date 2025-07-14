/**
 * Function to unshare a folder on Dropbox.
 *
 * @param {Object} args - Arguments for unsharing the folder.
 * @param {string} args.shared_folder_id - The ID of the shared folder to unshare.
 * @param {boolean} [args.leave_a_copy=false] - Whether to leave a copy of the folder in the user's account.
 * @returns {Promise<Object>} - The result of the unshare folder operation.
 */
const executeFunction = async ({ shared_folder_id, leave_a_copy = false }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/unshare_folder';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    shared_folder_id,
    leave_a_copy
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Dropbox-API-Path-Root': JSON.stringify({ ".tag": "namespace_id", "namespace_id": "2" }),
    'Dropbox-API-Select-User': 'dbmid:FDFSVF-DFSDF',
    'Dropbox-API-Select-Admin': 'dbmid:FDFSVF-DFSDF'
  };

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
    console.error('Error unsharing folder:', error);
    return { error: 'An error occurred while unsharing the folder.' };
  }
};

/**
 * Tool configuration for unsharing a folder on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'unshare_folder',
      description: 'Unshare a folder on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          shared_folder_id: {
            type: 'string',
            description: 'The ID of the shared folder to unshare.'
          },
          leave_a_copy: {
            type: 'boolean',
            description: 'Whether to leave a copy of the folder in the user\'s account.'
          }
        },
        required: ['shared_folder_id']
      }
    }
  }
};

export { apiTool };