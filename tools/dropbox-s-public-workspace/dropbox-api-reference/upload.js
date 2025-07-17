/**
 * Function to upload a file to Dropbox.
 *
 * @param {Object} args - Arguments for the upload.
 * @param {string} args.path - The path in Dropbox where the file will be uploaded.
 * @param {string} args.mode - The mode for the upload (e.g., "add", "overwrite").
 * @param {boolean} [args.autorename=true] - Whether to autorename the file if it conflicts with an existing file.
 * @param {boolean} [args.mute=false] - Whether to mute notifications for the upload.
 * @param {boolean} [args.strict_conflict=false] - Whether to enforce strict conflict resolution.
 * @param {Buffer} args.fileContent - The content of the file to upload.
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The result of the upload operation.
 */
const executeFunction = async ({ path, mode, autorename = true, mute = false, strict_conflict = false, fileContent, team_member_id }) => {
  const url = 'https://content.dropboxapi.com/2/files/upload';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Dropbox-API-Arg': JSON.stringify({
      path,
      mode,
      autorename,
      mute,
      strict_conflict
    }),
    'Content-Type': 'application/octet-stream'
  };
  if (team_member_id) {
    headers['Dropbox-API-Select-User'] = team_member_id;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: fileContent
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
    console.error('Error uploading file to Dropbox:', error);
    return { error: 'An error occurred while uploading the file.', details: error.message };
  }
};

/**
 * Tool configuration for uploading files to Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'upload_file',
      description: 'Upload a file to Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path in Dropbox where the file will be uploaded.'
          },
          mode: {
            type: 'string',
            enum: ['add', 'overwrite'],
            description: 'The mode for the upload.'
          },
          autorename: {
            type: 'boolean',
            description: 'Whether to autorename the file if it conflicts with an existing file.'
          },
          mute: {
            type: 'boolean',
            description: 'Whether to mute notifications for the upload.'
          },
          strict_conflict: {
            type: 'boolean',
            description: 'Whether to enforce strict conflict resolution.'
          },
          fileContent: {
            type: 'string',
            description: 'The content of the file to upload.'
          },
          team_member_id: {
            type: 'string',
            description: 'Optional team member ID to act as.'
          }
        },
        required: ['path', 'mode', 'fileContent']
      }
    }
  }
};

export { apiTool };