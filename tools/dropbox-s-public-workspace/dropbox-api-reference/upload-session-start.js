/**
 * Function to start an upload session in Dropbox.
 *
 * @param {Object} args - Arguments for starting the upload session.
 * @param {boolean} [args.close=false] - Indicates whether to close the session after starting.
 * @returns {Promise<Object>} - The result of starting the upload session.
 */
const executeFunction = async ({ close = false }) => {
  const url = 'https://content.dropboxapi.com/2/files/upload_session/start';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Dropbox-API-Arg': JSON.stringify({ close })
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers
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
    console.error('Error starting upload session:', error);
    return { error: 'An error occurred while starting the upload session.', details: error.message };
  }
};

/**
 * Tool configuration for starting an upload session in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'upload_session_start',
      description: 'Start an upload session in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          close: {
            type: 'boolean',
            description: 'Indicates whether to close the session after starting.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };