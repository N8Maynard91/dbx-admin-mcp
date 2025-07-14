/**
 * Function to unlock files in Dropbox.
 *
 * @param {Object} args - Arguments for unlocking files.
 * @param {Array<Object>} args.entries - An array of entries containing file paths to unlock.
 * @returns {Promise<Object>} - The result of the unlock operation.
 */
const executeFunction = async ({ entries }) => {
  const url = 'https://api.dropboxapi.com/2/files/unlock_file_batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    entries
  };

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
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
    console.error('Error unlocking files:', error);
    return { error: 'An error occurred while unlocking files.' };
  }
};

/**
 * Tool configuration for unlocking files in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'unlock_file_batch',
      description: 'Unlock files in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          entries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'The path of the file to unlock.'
                }
              },
              required: ['path']
            },
            description: 'An array of entries containing file paths to unlock.'
          }
        },
        required: ['entries']
      }
    }
  }
};

export { apiTool };