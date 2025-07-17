/**
 * Function to add members to a shared folder in Dropbox.
 *
 * @param {Object} args - Arguments for adding folder members.
 * @param {string} args.shared_folder_id - The ID of the shared folder.
 * @param {Array<Object>} args.members - The members to add to the folder.
 * @param {boolean} [args.quiet=false] - If true, suppresses notifications.
 * @param {string} [args.custom_message] - A custom message to send to the new members.
 * @returns {Promise<Object>} - The result of the add folder member operation.
 */
const executeFunction = async ({ shared_folder_id, members, quiet = false, custom_message }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/add_folder_member';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    shared_folder_id,
    members,
    quiet,
    custom_message
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

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
    console.error('Error adding folder member:', error);
    return { error: 'An error occurred while adding folder member.', details: error.message };
  }
};

/**
 * Tool configuration for adding members to a shared folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_folder_member',
      description: 'Add members to a shared folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          shared_folder_id: {
            type: 'string',
            description: 'The ID of the shared folder.'
          },
          members: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                member: {
                  type: 'object',
                  properties: {
                    '.tag': {
                      type: 'string',
                      description: 'The type of member (email or dropbox_id).'
                    },
                    email: {
                      type: 'string',
                      description: 'The email of the member (if .tag is email).'
                    },
                    dropbox_id: {
                      type: 'string',
                      description: 'The Dropbox ID of the member (if .tag is dropbox_id).'
                    }
                  },
                  required: ['.tag']
                },
                access_level: {
                  type: 'string',
                  enum: ['editor', 'viewer'],
                  description: 'The access level for the member.'
                }
              },
              required: ['member', 'access_level']
            },
            description: 'The members to add to the folder.'
          },
          quiet: {
            type: 'boolean',
            description: 'If true, suppresses notifications.'
          },
          custom_message: {
            type: 'string',
            description: 'A custom message to send to the new members.'
          }
        },
        required: ['shared_folder_id', 'members']
      }
    }
  }
};

export { apiTool };