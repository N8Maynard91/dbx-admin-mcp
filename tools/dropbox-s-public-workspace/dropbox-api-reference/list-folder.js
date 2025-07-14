/**
 * Function to list the contents of a folder in Dropbox.
 *
 * @param {Object} args - Arguments for the folder listing.
 * @param {string} args.path - The path of the folder to list.
 * @param {boolean} [args.recursive=false] - Whether to list contents recursively.
 * @param {boolean} [args.include_media_info=false] - Whether to include media info.
 * @param {boolean} [args.include_deleted=false] - Whether to include deleted files.
 * @param {boolean} [args.include_has_explicit_shared_members=false] - Whether to include shared members.
 * @param {boolean} [args.include_mounted_folders=true] - Whether to include mounted folders.
 * @param {boolean} [args.include_non_downloadable_files=true] - Whether to include non-downloadable files.
 * @returns {Promise<Object>} - The result of the folder listing.
 */
const executeFunction = async ({ path, recursive = false, include_media_info = false, include_deleted = false, include_has_explicit_shared_members = false, include_mounted_folders = true, include_non_downloadable_files = true, team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/files/list_folder';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    path,
    recursive,
    include_media_info,
    include_deleted,
    include_has_explicit_shared_members,
    include_mounted_folders,
    include_non_downloadable_files
  };

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    if (team_member_id) {
      headers['Dropbox-API-Select-User'] = team_member_id;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error('Error listing folder contents:', error);
    return { error: 'An error occurred while listing folder contents.', details: error.message };
  }
};

/**
 * Tool configuration for listing folder contents in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_folder',
      description: 'List the contents of a folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the folder to list.'
          },
          recursive: {
            type: 'boolean',
            description: 'Whether to list contents recursively.'
          },
          include_media_info: {
            type: 'boolean',
            description: 'Whether to include media info.'
          },
          include_deleted: {
            type: 'boolean',
            description: 'Whether to include deleted files.'
          },
          include_has_explicit_shared_members: {
            type: 'boolean',
            description: 'Whether to include shared members.'
          },
          include_mounted_folders: {
            type: 'boolean',
            description: 'Whether to include mounted folders.'
          },
          include_non_downloadable_files: {
            type: 'boolean',
            description: 'Whether to include non-downloadable files.'
          },
          team_member_id: {
            type: 'string',
            description: 'The Dropbox team_member_id to act as (for Business tokens).'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };