import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testTokenType() {
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  
  if (!token) {
    console.error('❌ No API key found. Please set DROPBOX_S_PUBLIC_WORKSPACE_API_KEY in your .env file');
    return;
  }

  console.log('🔑 Testing Dropbox API token type...\n');

  // Test 1: Try to get current account (personal token)
  console.log('📋 Test 1: Checking if this is a personal token...');
  try {
    const response1 = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response1.ok) {
      const data = await response1.json();
      console.log('✅ This appears to be a PERSONAL token');
      console.log('👤 Account:', data.name.display_name);
      console.log('📧 Email:', data.email);
      console.log('🏢 Account Type: Personal');
      console.log('\n🎯 Personal token tools that should work:');
      console.log('  - list_folder (personal files)');
      console.log('  - search_files (personal files)');
      console.log('  - get_current_account');
      console.log('  - get_space_usage');
      return;
    }
  } catch (error) {
    console.log('❌ Personal token test failed');
  }

  // Test 2: Try to get team info (team token)
  console.log('\n📋 Test 2: Checking if this is a team token...');
  try {
    const response2 = await fetch('https://api.dropboxapi.com/2/team/get_info', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response2.ok) {
      const data = await response2.json();
      console.log('✅ This appears to be a TEAM token');
      console.log('🏢 Team Name:', data.name);
      console.log('🆔 Team ID:', data.team_id);
      console.log('👥 Member Count:', data.num_licensed_users);
      console.log('\n🎯 Team token tools that should work:');
      console.log('  - get_info (team info)');
      console.log('  - list_team_folders');
      console.log('  - list_members (if admin)');
      console.log('  - add_member_to_team (if admin)');
      console.log('\n⚠️  Note: Personal file operations require specifying a team member');
      return;
    }
  } catch (error) {
    console.log('❌ Team token test failed');
  }

  // Test 3: If both failed, show error details
  console.log('\n❌ Token type unclear. Testing with error details...');
  try {
    const response3 = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const errorText = await response3.text();
    console.log('📊 Response Status:', response3.status);
    console.log('📄 Response Body:', errorText.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ All tests failed:', error.message);
  }
}

testTokenType(); 