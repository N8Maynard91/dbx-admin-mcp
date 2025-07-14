/**
 * Function to update a file request on Dropbox.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.id - The ID of the file request to update.
 * @param {string} args.title - The new title for the file request.
 * @param {string} args.destination - The new destination for the file request.
 * @param {string} args.deadline - The new deadline for the file request.
 * @param {boolean} args.open - Whether the file request is open or not.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ id, title, destination, deadline, open }) => {
  const url = 'https://api.dropboxapi.com/2/file_requests/update';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    id,
    title,
    destination,
    deadline: {
      ".tag": "update",
      deadline,
      allow_late_uploads: "seven_days"
    },
    open
  };

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Dropbox-API-Path-Root': JSON.stringify({ ".tag": "namespace_id", "namespace_id": "2" }),
      'Dropbox-API-Select-User': 'dbmid:FDFSVF-DFSDF'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating file request:', error);
    return { error: 'An error occurred while updating the file request.' };
  }
};

/**
 * Tool configuration for updating a file request on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_file_request',
      description: 'Update a file request on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the file request to update.'
          },
          title: {
            type: 'string',
            description: 'The new title for the file request.'
          },
          destination: {
            type: 'string',
            description: 'The new destination for the file request.'
          },
          deadline: {
            type: 'string',
            description: 'The new deadline for the file request.'
          },
          open: {
            type: 'boolean',
            description: 'Whether the file request is open or not.'
          }
        },
        required: ['id', 'title', 'destination', 'deadline', 'open']
      }
    }
  }
};

export { apiTool };