/**
 * Function to update a team member's profile in Dropbox.
 *
 * @param {Object} args - Arguments for updating the team member's profile.
 * @param {string} args.team_member_id - The ID of the team member to update.
 * @param {string} args.new_email - The new email address for the team member.
 * @param {string} args.new_surname - The new surname for the team member.
 * @returns {Promise<Object>} - The result of the profile update.
 */
const executeFunction = async ({ team_member_id, new_email, new_surname }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/set_profile';
  const accessToken = ''; // will be provided by the user

  const body = JSON.stringify({
    user: {
      '.tag': 'team_member_id',
      team_member_id: team_member_id
    },
    new_email: new_email,
    new_surname: new_surname
  });

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
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
    console.error('Error updating team member profile:', error);
    return { error: 'An error occurred while updating the team member profile.' };
  }
};

/**
 * Tool configuration for updating a team member's profile in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_team_member_profile',
      description: 'Update a team member\'s profile in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member to update.'
          },
          new_email: {
            type: 'string',
            description: 'The new email address for the team member.'
          },
          new_surname: {
            type: 'string',
            description: 'The new surname for the team member.'
          }
        },
        required: ['team_member_id', 'new_email', 'new_surname']
      }
    }
  }
};

export { apiTool };