/**
 * Function to lock files in Dropbox.
 *
 * @param {Object} args - Arguments for locking files.
 * @param {Array<Object>} args.entries - An array of entries containing paths of files to lock.
 * @returns {Promise<Object>} - The result of the lock file operation.
 */
const executeFunction = async ({ entries }) => {
  const url = 'https://api.dropboxapi.com/2/files/lock_file_batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Prepare the request body
    const body = JSON.stringify({ entries });

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
    console.error('Error locking files:', error);
    return { error: 'An error occurred while locking files.' };
  }
};

/**
 * Tool configuration for locking files in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'lock_file_batch',
      description: 'Lock files at the given paths in Dropbox.',
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
                  description: 'The path of the file to lock.'
                }
              },
              required: ['path']
            },
            description: 'An array of entries containing paths of files to lock.'
          }
        },
        required: ['entries']
      }
    }
  }
};

export { apiTool };