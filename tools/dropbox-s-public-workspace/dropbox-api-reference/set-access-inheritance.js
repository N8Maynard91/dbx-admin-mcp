/**
 * Function to set access inheritance for a shared folder in Dropbox.
 *
 * @param {Object} args - Arguments for setting access inheritance.
 * @param {string} args.shared_folder_id - The ID of the shared folder.
 * @param {string} args.access_inheritance - The access inheritance policy to set (e.g., "inherit").
 * @returns {Promise<Object>} - The result of the access inheritance update.
 */
const executeFunction = async ({ shared_folder_id, access_inheritance }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/set_access_inheritance';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    shared_folder_id,
    access_inheritance
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
    console.error('Error setting access inheritance:', error);
    return { error: 'An error occurred while setting access inheritance.' };
  }
};

/**
 * Tool configuration for setting access inheritance in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'set_access_inheritance',
      description: 'Set access inheritance for a shared folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          shared_folder_id: {
            type: 'string',
            description: 'The ID of the shared folder.'
          },
          access_inheritance: {
            type: 'string',
            description: 'The access inheritance policy to set.'
          }
        },
        required: ['shared_folder_id', 'access_inheritance']
      }
    }
  }
};

export { apiTool };