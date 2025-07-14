/**
 * Function to list members of multiple files in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {Array<string>} args.files - An array of file IDs to list members for.
 * @param {number} [args.limit=10] - The maximum number of results to return.
 * @returns {Promise<Object>} - The result of the list file members request.
 */
const executeFunction = async ({ files, limit = 10 }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_file_members/batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    files,
    limit
  });

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

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
    console.error('Error listing file members:', error);
    return { error: 'An error occurred while listing file members.' };
  }
};

/**
 * Tool configuration for listing members of multiple files in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_file_members_batch',
      description: 'List members of multiple files in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              description: 'The ID of the file to list members for.'
            },
            description: 'An array of file IDs to list members for.'
          },
          limit: {
            type: 'integer',
            description: 'The maximum number of results to return.'
          }
        },
        required: ['files']
      }
    }
  }
};

export { apiTool };