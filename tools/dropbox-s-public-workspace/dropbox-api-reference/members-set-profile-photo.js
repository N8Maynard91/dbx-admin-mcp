/**
 * Function to set a team member's profile photo on Dropbox.
 *
 * @param {Object} args - Arguments for setting the profile photo.
 * @param {string} args.team_member_id - The ID of the team member whose photo is to be updated.
 * @param {string} args.base64_data - The base64 encoded image data for the profile photo.
 * @returns {Promise<Object>} - The result of the profile photo update.
 */
const executeFunction = async ({ team_member_id, base64_data }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/set_profile_photo';
  const accessToken = ''; // will be provided by the user

  const body = {
    user: {
      '.tag': 'team_member_id',
      team_member_id: team_member_id
    },
    photo: {
      '.tag': 'base64_data',
      base64_data: base64_data
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
    console.error('Error setting profile photo:', error);
    return { error: 'An error occurred while setting the profile photo.' };
  }
};

/**
 * Tool configuration for setting a team member's profile photo on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'set_profile_photo',
      description: 'Set a team member\'s profile photo on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member whose photo is to be updated.'
          },
          base64_data: {
            type: 'string',
            description: 'The base64 encoded image data for the profile photo.'
          }
        },
        required: ['team_member_id', 'base64_data']
      }
    }
  }
};

export { apiTool };