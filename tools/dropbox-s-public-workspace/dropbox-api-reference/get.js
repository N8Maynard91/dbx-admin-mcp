/**
 * Function to get a file request from Dropbox.
 *
 * @param {Object} args - Arguments for the file request.
 * @param {string} args.id - The ID of the file request to retrieve.
 * @returns {Promise<Object>} - The result of the file request retrieval.
 */
const executeFunction = async ({ id }) => {
  const url = 'https://api.dropboxapi.com/2/file_requests/get';
  const accessToken = ''; // will be provided by the user

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Prepare the request body
    const body = JSON.stringify({ id });

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
    console.error('Error retrieving file request:', error);
    return { error: 'An error occurred while retrieving the file request.', details: error.message };
  }
};

/**
 * Tool configuration for retrieving a file request from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_file_request',
      description: 'Retrieve a specified file request from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the file request to retrieve.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };