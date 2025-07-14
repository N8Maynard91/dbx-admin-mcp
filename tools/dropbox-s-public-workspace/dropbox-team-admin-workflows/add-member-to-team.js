/**
 * Function to add a member to a Dropbox team.
 *
 * @param {Object} args - Arguments for adding a member.
 * @param {string} args.email - The email of the new member.
 * @param {string} args.first_name - The first name of the new member.
 * @param {string} args.last_name - The last name of the new member.
 * @param {string} args.external_id - The external ID for the new member.
 * @param {boolean} args.welcome_email - Whether to send a welcome email to the new member.
 * @param {string} args.member_role - The role of the new member (e.g., "member_only").
 * @returns {Promise<Object>} - The result of the add member operation.
 */
const executeFunction = async ({ email, first_name, last_name, external_id, welcome_email, member_role }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/add';
  const accessToken = ''; // will be provided by the user

  const body = {
    new_members: [
      {
        member_email: email,
        member_given_name: first_name,
        member_surname: last_name,
        member_external_id: external_id,
        send_welcome_email: welcome_email,
        role: member_role
      }
    ],
    force_async: false
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding member to team:', error);
    return { error: 'An error occurred while adding the member to the team.' };
  }
};

/**
 * Tool configuration for adding a member to a Dropbox team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_member_to_team',
      description: 'Add a member to a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'The email of the new member.'
          },
          first_name: {
            type: 'string',
            description: 'The first name of the new member.'
          },
          last_name: {
            type: 'string',
            description: 'The last name of the new member.'
          },
          external_id: {
            type: 'string',
            description: 'The external ID for the new member.'
          },
          welcome_email: {
            type: 'boolean',
            description: 'Whether to send a welcome email to the new member.'
          },
          member_role: {
            type: 'string',
            description: 'The role of the new member (e.g., "member_only").'
          }
        },
        required: ['email', 'first_name', 'last_name', 'external_id', 'member_role']
      }
    }
  }
};

export { apiTool };