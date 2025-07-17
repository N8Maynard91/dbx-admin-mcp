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
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The result of the folder listing.
 */
import { apiTool as getCurrentAccountTool } from './get-current-account.js';
const getCurrentAccount = getCurrentAccountTool.function;

/**
 * Note: Listing folders must be done in the context of a specific user. team_member_id is required.
 */
const executeFunction = async ({ path = '', recursive = false, include_media_info = false, include_deleted = false, include_has_explicit_shared_members = false, team_member_id }) => {
  if (!team_member_id) {
    return { error: 'team_member_id is required for user file operations. Please provide the team_member_id to act as.' };
  }
  const url = 'https://api.dropboxapi.com/2/files/list_folder';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  // If path is '/' (root), use '' instead
  const normalizedPath = path === '/' ? '' : path;
  const body = JSON.stringify({
    path: normalizedPath,
    recursive,
    include_media_info,
    include_deleted,
    include_has_explicit_shared_members
  });
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  headers['Dropbox-API-Select-User'] = team_member_id;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: body
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
    if (!response.ok) {
      // Guardrail: path/not_found error
      if (typeof data === 'object' && data !== null && data.error && data.error['.tag'] === 'path' && data.error.path['.tag'] === 'not_found') {
        return { error: 'The specified path does not exist in the user\'s Dropbox.' };
      }
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
    console.error('Error listing folder:', error);
    return { error: 'An error occurred while listing the folder.', details: error.message };
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