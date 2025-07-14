/**
 * Function to mount a shared folder in Dropbox.
 *
 * @param {Object} args - Arguments for the mount folder request.
 * @param {string} args.shared_folder_id - The ID of the shared folder to mount.
 * @returns {Promise<Object>} - The response from the Dropbox API after attempting to mount the folder.
 */
const executeFunction = async ({ shared_folder_id }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/mount_folder';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    shared_folder_id
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
    console.error('Error mounting folder:', error);
    return { error: 'An error occurred while mounting the folder.' };
  }
};

/**
 * Tool configuration for mounting a shared folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'mount_folder',
      description: 'Mount a shared folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          shared_folder_id: {
            type: 'string',
            description: 'The ID of the shared folder to mount.'
          }
        },
        required: ['shared_folder_id']
      }
    }
  }
};

export { apiTool };