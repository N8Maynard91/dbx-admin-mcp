/**
 * Function to add members to a file in Dropbox.
 *
 * @param {Object} args - Arguments for adding file members.
 * @param {string} args.file - The ID of the file to which members will be added.
 * @param {Array<Object>} args.members - The members to be added, each specified by their email.
 * @param {string} [args.custom_message] - A custom message to accompany the invitation.
 * @param {boolean} [args.quiet=false] - If true, suppresses notifications.
 * @param {string} [args.access_level="viewer"] - The access level for the added members.
 * @param {boolean} [args.add_message_as_comment=false] - If true, adds the custom message as a comment.
 * @returns {Promise<Object>} - The result of the add file member operation.
 */
const executeFunction = async ({ file, members, custom_message, quiet = false, access_level = 'viewer', add_message_as_comment = false }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/add_file_member';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    file,
    members,
    custom_message,
    quiet,
    access_level,
    add_message_as_comment
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

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding file member:', error);
    return { error: 'An error occurred while adding file member.' };
  }
};

/**
 * Tool configuration for adding members to a file in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_file_member',
      description: 'Add members to a file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The ID of the file to which members will be added.'
          },
          members: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                '.tag': {
                  type: 'string',
                  description: 'The type of member (e.g., email).'
                },
                email: {
                  type: 'string',
                  description: 'The email of the member to add.'
                }
              },
              required: ['.tag', 'email']
            },
            description: 'The members to be added.'
          },
          custom_message: {
            type: 'string',
            description: 'A custom message to accompany the invitation.'
          },
          quiet: {
            type: 'boolean',
            description: 'If true, suppresses notifications.'
          },
          access_level: {
            type: 'string',
            description: 'The access level for the added members.'
          },
          add_message_as_comment: {
            type: 'boolean',
            description: 'If true, adds the custom message as a comment.'
          }
        },
        required: ['file', 'members']
      }
    }
  }
};

export { apiTool };