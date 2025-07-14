/**
 * Function to remove a specified member from a file in Dropbox.
 *
 * @param {Object} args - Arguments for the removal.
 * @param {string} args.file - The ID of the file from which to remove the member.
 * @param {Object} args.member - The member to be removed.
 * @param {string} args.member.tag - The type of the member (e.g., "email").
 * @param {string} args.member.email - The email address of the member to be removed.
 * @returns {Promise<Object>} - The result of the member removal operation.
 */
const executeFunction = async ({ file, member }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/remove_file_member_2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    file,
    member
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
    console.error('Error removing file member:', error);
    return { error: 'An error occurred while removing the file member.' };
  }
};

/**
 * Tool configuration for removing a member from a file in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'remove_file_member_2',
      description: 'Remove a specified member from a file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The ID of the file from which to remove the member.'
          },
          member: {
            type: 'object',
            properties: {
              tag: {
                type: 'string',
                description: 'The type of the member (e.g., "email").'
              },
              email: {
                type: 'string',
                description: 'The email address of the member to be removed.'
              }
            },
            required: ['tag', 'email']
          }
        },
        required: ['file', 'member']
      }
    }
  }
};

export { apiTool };