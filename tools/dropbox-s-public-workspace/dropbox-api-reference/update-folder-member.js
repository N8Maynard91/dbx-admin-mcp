/**
 * Function to update a member's permissions in a shared Dropbox folder.
 *
 * @param {Object} args - Arguments for updating folder member.
 * @param {string} args.shared_folder_id - The ID of the shared folder.
 * @param {Object} args.member - The member to update.
 * @param {string} args.member.tag - The type of member (e.g., "email").
 * @param {string} args.member.email - The email of the member.
 * @param {string} args.access_level - The access level to assign (e.g., "editor").
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ shared_folder_id, member, access_level }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/update_folder_member';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    shared_folder_id,
    member,
    access_level
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
    console.error('Error updating folder member:', error);
    return { error: 'An error occurred while updating the folder member.' };
  }
};

/**
 * Tool configuration for updating a member's permissions in a shared Dropbox folder.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_folder_member',
      description: 'Update a member\'s permissions in a shared Dropbox folder.',
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
              tag: {
                type: 'string',
                description: 'The type of member (e.g., "email").'
              },
              email: {
                type: 'string',
                description: 'The email of the member.'
              }
            },
            required: ['tag', 'email']
          },
          access_level: {
            type: 'string',
            description: 'The access level to assign (e.g., "editor").'
          }
        },
        required: ['shared_folder_id', 'member', 'access_level']
      }
    }
  }
};

export { apiTool };