/**
 * Function to finish an upload session in Dropbox.
 *
 * @param {Object} args - Arguments for finishing the upload session.
 * @param {string} args.session_id - The session ID of the upload session.
 * @param {number} args.offset - The offset of the uploaded data.
 * @param {string} args.path - The path where the file will be saved in Dropbox.
 * @param {string} [args.mode="add"] - The mode for saving the file (e.g., "add", "overwrite").
 * @param {boolean} [args.autorename=true] - Whether to autorename the file if it already exists.
 * @param {boolean} [args.mute=false] - Whether to mute notifications for this file.
 * @param {boolean} [args.strict_conflict=false] - Whether to enforce strict conflict resolution.
 * @returns {Promise<Object>} - The result of finishing the upload session.
 */
const executeFunction = async ({ session_id, offset, path, mode = 'add', autorename = true, mute = false, strict_conflict = false }) => {
  const url = 'https://content.dropboxapi.com/2/files/upload_session/finish';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  // Construct the headers for the request
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Dropbox-API-Arg': JSON.stringify({
      cursor: {
        session_id: session_id,
        offset: offset
      },
      commit: {
        path: path,
        mode: mode,
        autorename: autorename,
        mute: mute,
        strict_conflict: strict_conflict
      }
    })
  };

  try {
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
    console.error('Error finishing upload session:', error);
    return { error: 'An error occurred while finishing the upload session.' };
  }
};

/**
 * Tool configuration for finishing an upload session in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'finish_upload_session',
      description: 'Finish an upload session and save the uploaded data to the given file path.',
      parameters: {
        type: 'object',
        properties: {
          session_id: {
            type: 'string',
            description: 'The session ID of the upload session.'
          },
          offset: {
            type: 'integer',
            description: 'The offset of the uploaded data.'
          },
          path: {
            type: 'string',
            description: 'The path where the file will be saved in Dropbox.'
          },
          mode: {
            type: 'string',
            enum: ['add', 'overwrite'],
            description: 'The mode for saving the file.'
          },
          autorename: {
            type: 'boolean',
            description: 'Whether to autorename the file if it already exists.'
          },
          mute: {
            type: 'boolean',
            description: 'Whether to mute notifications for this file.'
          },
          strict_conflict: {
            type: 'boolean',
            description: 'Whether to enforce strict conflict resolution.'
          }
        },
        required: ['session_id', 'offset', 'path']
      }
    }
  }
};

export { apiTool };