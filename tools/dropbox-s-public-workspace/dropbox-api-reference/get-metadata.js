/**
 * Function to get metadata for a file or folder in Dropbox.
 *
 * @param {Object} args - Arguments for the metadata request.
 * @param {string} args.path - The path of the file or folder to get metadata for.
 * @param {boolean} [args.include_media_info=false] - Whether to include media info.
 * @param {boolean} [args.include_deleted=false] - Whether to include deleted items.
 * @param {boolean} [args.include_has_explicit_shared_members=false] - Whether to include explicit shared members.
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The metadata of the specified file or folder.
 */
const executeFunction = async ({ path, include_media_info = false, include_deleted = false, include_has_explicit_shared_members = false, team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/files/get_metadata';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    path,
    include_media_info,
    include_deleted,
    include_has_explicit_shared_members
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    if (team_member_id) {
      headers['Dropbox-API-Select-User'] = team_member_id;
    }

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
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
    console.error('Error getting metadata:', error);
    return { error: 'An error occurred while getting metadata.', details: error.message };
  }
};

/**
 * Tool configuration for getting metadata from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_metadata',
      description: 'Get metadata for a file or folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file or folder to get metadata for.'
          },
          include_media_info: {
            type: 'boolean',
            description: 'Whether to include media info.'
          },
          include_deleted: {
            type: 'boolean',
            description: 'Whether to include deleted items.'
          },
          include_has_explicit_shared_members: {
            type: 'boolean',
            description: 'Whether to include explicit shared members.'
          },
          team_member_id: {
            type: 'string',
            description: 'Optional team member ID to act as.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };