/**
 * Function to restore a specific revision of a file in Dropbox.
 *
 * @param {Object} args - Arguments for the restore operation.
 * @param {string} args.path - The path of the file to restore.
 * @param {string} args.rev - The revision ID of the file to restore.
 * @returns {Promise<Object>} - The result of the restore operation.
 */
const executeFunction = async ({ path, rev }) => {
  const url = 'https://api.dropboxapi.com/2/files/restore';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    path,
    rev
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
    console.error('Error restoring file:', error);
    return { error: 'An error occurred while restoring the file.' };
  }
};

/**
 * Tool configuration for restoring a file in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'restore_file',
      description: 'Restore a specific revision of a file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file to restore.'
          },
          rev: {
            type: 'string',
            description: 'The revision ID of the file to restore.'
          }
        },
        required: ['path', 'rev']
      }
    }
  }
};

export { apiTool };