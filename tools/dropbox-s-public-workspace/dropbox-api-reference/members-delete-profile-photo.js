/**
 * Function to delete a team member's profile photo on Dropbox.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {string} args.team_member_id - The ID of the team member whose profile photo is to be deleted.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/delete_profile_photo';
  const accessToken = ''; // will be provided by the user

  const body = {
    user: {
      '.tag': 'team_member_id',
      team_member_id: team_member_id
    }
  };

  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
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
    console.error('Error deleting profile photo:', error);
    return { error: 'An error occurred while deleting the profile photo.' };
  }
};

/**
 * Tool configuration for deleting a team member's profile photo on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_profile_photo',
      description: 'Delete a team member\'s profile photo on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member whose profile photo is to be deleted.'
          }
        },
        required: ['team_member_id']
      }
    }
  }
};

export { apiTool };