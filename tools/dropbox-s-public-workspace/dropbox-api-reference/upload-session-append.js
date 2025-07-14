/**
 * Function to append data to an upload session in Dropbox.
 *
 * @param {Object} args - Arguments for the append operation.
 * @param {string} args.session_id - The session ID of the upload session.
 * @param {number} args.offset - The offset in the session to append data.
 * @param {Buffer} args.fileData - The binary data to append to the upload session.
 * @param {boolean} [args.close=false] - Whether to close the upload session after appending.
 * @returns {Promise<Object>} - The result of the append operation.
 */
const executeFunction = async ({ session_id, offset, fileData, close = false }) => {
  const url = 'https://content.dropboxapi.com/2/files/upload_session/append_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Construct the headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Dropbox-API-Arg': JSON.stringify({
        cursor: {
          session_id: session_id,
          offset: offset
        },
        close: close
      }),
      'Content-Type': 'application/octet-stream'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: fileData
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
    console.error('Error appending to upload session:', error);
    return { error: 'An error occurred while appending to the upload session.' };
  }
};

/**
 * Tool configuration for appending data to an upload session in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'upload_session_append',
      description: 'Append data to an upload session in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          session_id: {
            type: 'string',
            description: 'The session ID of the upload session.'
          },
          offset: {
            type: 'integer',
            description: 'The offset in the session to append data.'
          },
          fileData: {
            type: 'string',
            description: 'The binary data to append to the upload session.'
          },
          close: {
            type: 'boolean',
            description: 'Whether to close the upload session after appending.'
          }
        },
        required: ['session_id', 'offset', 'fileData']
      }
    }
  }
};

export { apiTool };