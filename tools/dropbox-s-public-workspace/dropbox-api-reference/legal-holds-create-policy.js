/**
 * Function to create a legal hold policy in Dropbox.
 *
 * @param {Object} args - Arguments for creating the legal hold policy.
 * @param {string} args.name - The name of the legal hold policy.
 * @param {Array<string>} args.members - An array of team member IDs to include in the policy.
 * @param {string} args.start_date - The start date of the legal hold policy in ISO 8601 format.
 * @param {string} args.end_date - The end date of the legal hold policy in ISO 8601 format.
 * @returns {Promise<Object>} - The result of the legal hold policy creation.
 */
const executeFunction = async ({ name, members, start_date, end_date }) => {
  const url = 'https://api.dropboxapi.com/2/team/legal_holds/create_policy';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    name,
    members,
    start_date,
    end_date
  });

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
    console.error('Error creating legal hold policy:', error);
    return { error: 'An error occurred while creating the legal hold policy.' };
  }
};

/**
 * Tool configuration for creating a legal hold policy in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_legal_hold_policy',
      description: 'Create a legal hold policy in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the legal hold policy.'
          },
          members: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Team member ID to include in the policy.'
            },
            description: 'An array of team member IDs to include in the policy.'
          },
          start_date: {
            type: 'string',
            format: 'date-time',
            description: 'The start date of the legal hold policy in ISO 8601 format.'
          },
          end_date: {
            type: 'string',
            format: 'date-time',
            description: 'The end date of the legal hold policy in ISO 8601 format.'
          }
        },
        required: ['name', 'members', 'start_date', 'end_date']
      }
    }
  }
};

export { apiTool };