/**
 * Function to perform App Authentication with Dropbox API.
 *
 * @param {Object} args - Arguments for the app authentication.
 * @param {string} args.query - The query string to validate the app.
 * @returns {Promise<Object>} - The result of the app authentication.
 */
const executeFunction = async ({ query }) => {
  const url = 'https://api.dropboxapi.com/2/check/app';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  // Prepare the request body
  const body = JSON.stringify({ query });

  // Set up headers for the request
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

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
    console.error('Error during app authentication:', error);
    return { error: 'An error occurred during app authentication.', details: error.message };
  }
};

/**
 * Tool configuration for performing App Authentication with Dropbox API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_app',
      description: 'Perform App Authentication with Dropbox API.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The query string to validate the app.'
          }
        },
        required: ['query']
      }
    }
  }
};

export { apiTool };