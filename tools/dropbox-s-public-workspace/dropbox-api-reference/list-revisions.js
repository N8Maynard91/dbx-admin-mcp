/**
 * Function to list revisions of a file in Dropbox.
 *
 * @param {Object} args - Arguments for listing file revisions.
 * @param {string} args.path - The path of the file for which to list revisions.
 * @param {string} [args.mode="path"] - The mode to use for listing revisions (either "path" or "id").
 * @param {number} [args.limit=10] - The maximum number of revisions to return.
 * @returns {Promise<Object>} - The result of the list revisions request.
 */
const executeFunction = async ({ path, mode = 'path', limit = 10 }) => {
  const url = 'https://api.dropboxapi.com/2/files/list_revisions';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    path,
    mode,
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

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      let errorObj = { status: response.status, raw: text };
      if (typeof data === 'object' && data !== null) {
        if (data.error_summary) errorObj.error_summary = data.error_summary;
        if (data.error && data.error['.tag']) errorObj.error_tag = data.error['.tag'];
        errorObj.details = data;
      }
      return { error: 'Dropbox API error', ...errorObj };
    }

    return data;
  } catch (error) {
    console.error('Error listing file revisions:', error);
    return { error: 'An error occurred while listing file revisions.', details: error.message };
  }
};

/**
 * Tool configuration for listing file revisions in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_revisions',
      description: 'List revisions of a file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file for which to list revisions.'
          },
          mode: {
            type: 'string',
            enum: ['path', 'id'],
            description: 'The mode to use for listing revisions.'
          },
          limit: {
            type: 'integer',
            description: 'The maximum number of revisions to return.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };