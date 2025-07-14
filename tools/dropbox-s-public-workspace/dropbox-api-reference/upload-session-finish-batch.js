/**
 * Function to finish a batch of upload sessions in Dropbox.
 *
 * @param {Object} args - Arguments for finishing the upload session batch.
 * @param {Array} args.entries - An array of entries containing session information and commit details.
 * @returns {Promise<Object>} - The result of the batch finish operation.
 */
const executeFunction = async ({ entries }) => {
  const url = 'https://api.dropboxapi.com/2/files/upload_session/finish_batch';
  const accessToken = ''; // will be provided by the user

  try {
    // Prepare the request body
    const body = JSON.stringify({ entries });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
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
    console.error('Error finishing upload session batch:', error);
    return { error: 'An error occurred while finishing the upload session batch.' };
  }
};

/**
 * Tool configuration for finishing a batch of upload sessions in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'finish_upload_session_batch',
      description: 'Finish a batch of upload sessions in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          entries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                cursor: {
                  type: 'object',
                  properties: {
                    session_id: {
                      type: 'string',
                      description: 'The session ID of the upload session.'
                    },
                    offset: {
                      type: 'integer',
                      description: 'The offset for the upload session.'
                    }
                  },
                  required: ['session_id', 'offset']
                },
                commit: {
                  type: 'object',
                  properties: {
                    path: {
                      type: 'string',
                      description: 'The path where the file will be stored in Dropbox.'
                    },
                    mode: {
                      type: 'string',
                      enum: ['add', 'overwrite', 'update'],
                      description: 'The mode for the file operation.'
                    },
                    autorename: {
                      type: 'boolean',
                      description: 'Whether to automatically rename the file if a conflict occurs.'
                    },
                    mute: {
                      type: 'boolean',
                      description: 'Whether to mute notifications for the file.'
                    },
                    strict_conflict: {
                      type: 'boolean',
                      description: 'Whether to enforce strict conflict resolution.'
                    }
                  },
                  required: ['path', 'mode', 'autorename', 'mute', 'strict_conflict']
                }
              },
              required: ['cursor', 'commit']
            },
            description: 'An array of entries containing session information and commit details.'
          }
        },
        required: ['entries']
      }
    }
  }
};

export { apiTool };