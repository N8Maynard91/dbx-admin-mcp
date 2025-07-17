/**
 * Function to share a folder on Dropbox.
 *
 * @param {Object} args - Arguments for sharing the folder.
 * @param {string} args.path - The path of the folder to share.
 * @param {string} [args.acl_update_policy="editors"] - The ACL update policy for the folder.
 * @param {boolean} [args.force_async=false] - Whether to force the operation to be asynchronous.
 * @param {string} [args.member_policy="team"] - The member policy for the shared folder.
 * @param {string} [args.shared_link_policy="members"] - The shared link policy for the folder.
 * @param {string} [args.access_inheritance="inherit"] - The access inheritance policy for the folder.
 * @returns {Promise<Object>} - The result of the share folder operation.
 */
const executeFunction = async ({ path, acl_update_policy = 'editors', force_async = false, member_policy = 'team', shared_link_policy = 'members', access_inheritance = 'inherit' }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/share_folder';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    path,
    acl_update_policy,
    force_async,
    member_policy,
    shared_link_policy,
    access_inheritance
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
    console.error('Error sharing folder:', error);
    return { error: 'An error occurred while sharing the folder.', details: error.message };
  }
};

/**
 * Tool configuration for sharing a folder on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'share_folder',
      description: 'Share a folder with collaborators on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the folder to share.'
          },
          acl_update_policy: {
            type: 'string',
            description: 'The ACL update policy for the folder.'
          },
          force_async: {
            type: 'boolean',
            description: 'Whether to force the operation to be asynchronous.'
          },
          member_policy: {
            type: 'string',
            description: 'The member policy for the shared folder.'
          },
          shared_link_policy: {
            type: 'string',
            description: 'The shared link policy for the folder.'
          },
          access_inheritance: {
            type: 'string',
            description: 'The access inheritance policy for the folder.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };