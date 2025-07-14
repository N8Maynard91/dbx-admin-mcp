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

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error starting upload session:', error);
    return { error: 'An error occurred while starting the upload session.' };
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