/**
 * Function to export a file from a user's Dropbox.
 *
 * @param {Object} args - Arguments for the export.
 * @param {string} args.path - The path of the file to export in Dropbox.
 * @returns {Promise<Object>} - The result of the file export.
 */
const executeFunction = async ({ path }) => {
  const url = 'https://content.dropboxapi.com/2/files/export';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Dropbox-API-Arg': JSON.stringify({ path })
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers
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
    console.error('Error exporting file from Dropbox:', error);
    return { error: 'An error occurred while exporting the file.' };
  }
};

/**
 * Tool configuration for exporting a file from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_file',
      description: 'Export a file from a user\'s Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file to export in Dropbox.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };