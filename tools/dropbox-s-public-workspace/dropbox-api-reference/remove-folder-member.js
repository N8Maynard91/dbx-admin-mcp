/**
 * Function to remove a member from a shared folder in Dropbox.
 *
 * @param {Object} args - Arguments for the member removal.
 * @param {string} args.shared_folder_id - The ID of the shared folder.
 * @param {Object} args.member - The member to be removed.
 * @param {string} args.member.email - The email of the member to be removed.
 * @param {boolean} [args.leave_a_copy=false] - Whether to leave a copy of the folder for the member.
 * @returns {Promise<Object>} - The result of the member removal operation.
 */
const executeFunction = async ({ shared_folder_id, member, leave_a_copy = false }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/remove_folder_member';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const requestBody = {
    shared_folder_id,
    member,
    leave_a_copy
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
      body: JSON.stringify(requestBody)
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
    console.error('Error removing folder member:', error);
    return { error: 'An error occurred while removing the folder member.' };
  }
};

/**
 * Tool configuration for removing a member from a shared folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'remove_folder_member',
      description: 'Remove a member from a shared folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          shared_folder_id: {
            type: 'string',
            description: 'The ID of the shared folder.'
          },
          member: {
            type: 'object',
            properties: {
              '.tag': {
                type: 'string',
                description: 'The type of member (e.g., email).'
              },
              email: {
                type: 'string',
                description: 'The email of the member to be removed.'
              }
            },
            required: ['.tag', 'email']
          },
          leave_a_copy: {
            type: 'boolean',
            description: 'Whether to leave a copy of the folder for the member.'
          }
        },
        required: ['shared_folder_id', 'member']
      }
    }
  }
};

export { apiTool };