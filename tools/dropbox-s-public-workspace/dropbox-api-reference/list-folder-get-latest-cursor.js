/**
 * Function to get the latest cursor for a folder in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.path - The path of the folder to get the cursor for.
 * @param {boolean} [args.recursive=false] - Whether to include subfolders.
 * @param {boolean} [args.include_media_info=false] - Whether to include media info.
 * @param {boolean} [args.include_deleted=false] - Whether to include deleted files.
 * @param {boolean} [args.include_has_explicit_shared_members=false] - Whether to include shared members.
 * @param {boolean} [args.include_mounted_folders=true] - Whether to include mounted folders.
 * @param {boolean} [args.include_non_downloadable_files=true] - Whether to include non-downloadable files.
 * @returns {Promise<Object>} - The result of the cursor retrieval.
 */
const executeFunction = async ({ path, recursive = false, include_media_info = false, include_deleted = false, include_has_explicit_shared_members = false, include_mounted_folders = true, include_non_downloadable_files = true }) => {
  const url = 'https://api.dropboxapi.com/2/files/list_folder/get_latest_cursor';
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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting latest cursor:', error);
    return { error: 'An error occurred while getting the latest cursor.' };
  }
};

/**
 * Tool configuration for getting the latest cursor for a folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_latest_cursor',
      description: 'Get the latest cursor for a folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the folder to get the cursor for.'
          },
          recursive: {
            type: 'boolean',
            description: 'Whether to include subfolders.'
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
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };