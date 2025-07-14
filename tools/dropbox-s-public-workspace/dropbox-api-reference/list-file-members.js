/**
 * Function to list members of a file in Dropbox.
 *
 * @param {Object} args - Arguments for the file members listing.
 * @param {string} args.file - The ID of the file to list members for.
 * @param {boolean} [args.include_inherited=true] - Whether to include inherited members.
 * @param {number} [args.limit=100] - The maximum number of members to return.
 * @returns {Promise<Object>} - The result of the file members listing.
 */
const executeFunction = async ({ file, include_inherited = true, limit = 100 }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_file_members';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    file,
    include_inherited,
    limit
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
    console.error('Error listing file members:', error);
    return { error: 'An error occurred while listing file members.' };
  }
};

/**
 * Tool configuration for listing file members in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_file_members',
      description: 'List members of a file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The ID of the file to list members for.'
          },
          include_inherited: {
            type: 'boolean',
            description: 'Whether to include inherited members.'
          },
          limit: {
            type: 'integer',
            description: 'The maximum number of members to return.'
          }
        },
        required: ['file']
      }
    }
  }
};

export { apiTool };