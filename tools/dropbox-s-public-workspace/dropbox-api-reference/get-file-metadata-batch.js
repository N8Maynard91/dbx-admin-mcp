/**
 * Function to get file metadata in batch from Dropbox.
 *
 * @param {Object} args - Arguments for the batch file metadata request.
 * @param {Array<string>} args.files - An array of file IDs for which to retrieve metadata.
 * @param {Array<Object>} [args.actions] - Optional actions to perform on the files.
 * @returns {Promise<Object>} - The result of the batch file metadata request.
 */
const executeFunction = async ({ files, actions = [] }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/get_file_metadata/batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ files, actions });

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
    console.error('Error getting file metadata in batch:', error);
    return { error: 'An error occurred while getting file metadata.' };
  }
};

/**
 * Tool configuration for getting file metadata in batch from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_file_metadata_batch',
      description: 'Get file metadata in batch from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              description: 'The file ID for which to retrieve metadata.'
            },
            description: 'An array of file IDs.'
          },
          actions: {
            type: 'array',
            items: {
              type: 'object',
              description: 'Optional actions to perform on the files.'
            },
            description: 'Optional actions to perform on the files.'
          }
        },
        required: ['files']
      }
    }
  }
};

export { apiTool };