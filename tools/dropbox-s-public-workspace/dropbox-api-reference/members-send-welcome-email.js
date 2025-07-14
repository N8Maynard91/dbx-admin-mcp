/**
 * Function to send a welcome email to a pending team member in Dropbox.
 *
 * @param {Object} args - Arguments for sending the welcome email.
 * @param {string} args.team_member_id - The ID of the team member to send the welcome email to.
 * @returns {Promise<Object>} - The result of the email sending operation.
 */
const executeFunction = async ({ team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/send_welcome_email';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const data = {
    ".tag": "team_member_id",
    team_member_id
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
      body: JSON.stringify(data)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { error: 'An error occurred while sending the welcome email.' };
  }
};

/**
 * Tool configuration for sending a welcome email to a pending team member in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'send_welcome_email',
      description: 'Send a welcome email to a pending team member in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member to send the welcome email to.'
          }
        },
        required: ['team_member_id']
      }
    }
  }
};

export { apiTool };