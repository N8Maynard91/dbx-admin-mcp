/**
 * Function to update the sharing policies for a shared folder in Dropbox.
 *
 * @param {Object} args - Arguments for updating the folder policy.
 * @param {string} args.shared_folder_id - The ID of the shared folder to update.
 * @param {string} args.member_policy - The member policy for the shared folder.
 * @param {string} args.acl_update_policy - The ACL update policy for the shared folder.
 * @param {string} args.shared_link_policy - The shared link policy for the shared folder.
 * @returns {Promise<Object>} - The result of the folder policy update.
 */
const executeFunction = async ({ shared_folder_id, member_policy, acl_update_policy, shared_link_policy }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/update_folder_policy';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    shared_folder_id,
    member_policy,
    acl_update_policy,
    shared_link_policy
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
    console.error('Error updating folder policy:', error);
    return { error: 'An error occurred while updating the folder policy.' };
  }
};

/**
 * Tool configuration for updating folder policy in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_folder_policy',
      description: 'Update the sharing policies for a shared folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          shared_folder_id: {
            type: 'string',
            description: 'The ID of the shared folder to update.'
          },
          member_policy: {
            type: 'string',
            description: 'The member policy for the shared folder.'
          },
          acl_update_policy: {
            type: 'string',
            description: 'The ACL update policy for the shared folder.'
          },
          shared_link_policy: {
            type: 'string',
            description: 'The shared link policy for the shared folder.'
          }
        },
        required: ['shared_folder_id', 'member_policy', 'acl_update_policy', 'shared_link_policy']
      }
    }
  }
};

export { apiTool };