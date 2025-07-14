/**
 * Function to list file requests from Dropbox.
 *
 * @param {Object} args - Arguments for the file requests listing.
 * @param {number} [args.limit=1000] - The maximum number of file requests to return.
 * @returns {Promise<Object>} - The result of the file requests listing.
 */
const executeFunction = async ({ limit = 1000 }) => {
  const url = 'https://api.dropboxapi.com/2/file_requests/list_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Prepare the request body
  const body = JSON.stringify({ limit });

  try {
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
    console.error('Error listing file requests:', error);
    return { error: 'An error occurred while listing file requests.', details: error.message };
  }
};

/**
 * Tool configuration for listing file requests on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_file_requests',
      description: 'List file requests owned by the user.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of file requests to return.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };