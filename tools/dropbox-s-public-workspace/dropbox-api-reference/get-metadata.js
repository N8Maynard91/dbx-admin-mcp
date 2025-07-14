/**
 * Function to get metadata for a file or folder in Dropbox.
 *
 * @param {Object} args - Arguments for the metadata request.
 * @param {string} args.path - The path of the file or folder to get metadata for.
 * @param {boolean} [args.include_media_info=false] - Whether to include media info.
 * @param {boolean} [args.include_deleted=false] - Whether to include deleted items.
 * @param {boolean} [args.include_has_explicit_shared_members=false] - Whether to include explicit shared members.
 * @returns {Promise<Object>} - The metadata of the specified file or folder.
 */
const executeFunction = async ({ path, include_media_info = false, include_deleted = false, include_has_explicit_shared_members = false }) => {
  const url = 'https://api.dropboxapi.com/2/files/get_metadata';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    path,
    include_media_info,
    include_deleted,
    include_has_explicit_shared_members
  };

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
    console.error('Error getting metadata:', error);
    return { error: 'An error occurred while getting metadata.' };
  }
};

/**
 * Tool configuration for getting metadata from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_metadata',
      description: 'Get metadata for a file or folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file or folder to get metadata for.'
          },
          include_media_info: {
            type: 'boolean',
            description: 'Whether to include media info.'
          },
          include_deleted: {
            type: 'boolean',
            description: 'Whether to include deleted items.'
          },
          include_has_explicit_shared_members: {
            type: 'boolean',
            description: 'Whether to include explicit shared members.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };