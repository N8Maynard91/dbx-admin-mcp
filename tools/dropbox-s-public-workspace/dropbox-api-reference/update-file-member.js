/**
 * Function to update a member's access on a shared file in Dropbox.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.file - The ID of the file to update.
 * @param {Object} args.member - The member object containing the member's information.
 * @param {string} args.member.tag - The type of member (e.g., email).
 * @param {string} args.member.email - The email of the member.
 * @param {string} args.access_level - The access level to assign to the member (e.g., viewer).
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ file, member, access_level }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/update_file_member';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    file,
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
    console.error('Error updating file member:', error);
    return { error: 'An error occurred while updating the file member.' };
  }
};

/**
 * Tool configuration for updating a member's access on a shared file in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_file_member',
      description: 'Update a member\'s access on a shared file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The ID of the file to update.'
          },
          member: {
            type: 'object',
            properties: {
              tag: {
                type: 'string',
                description: 'The type of member (e.g., email).'
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
            description: 'The access level to assign to the member (e.g., viewer).'
          }
        },
        required: ['file', 'member', 'access_level']
      }
    }
  }
};

export { apiTool };