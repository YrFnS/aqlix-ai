// Admin Users Management
// Extracted from anything-llm frontend/src/pages/Admin/Users/
// Adapted for Iraqi AI: User roles with cultural-validator permissions

import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export const AdminUsers = () => {
  const supabase = useSupabaseClient();

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    // Query users with Iraqi roles (e.g., cultural-validator, domain-expert)
    supabase.from('users').select('*').eq('role', 'cultural-validator').then(({ data }) => setUsers(data || []));
  }, [supabase]);

  return (
    <div dir="rtl">
      <h2>إدارة المستخدمين | Users Management</h2>
      <ul>{users.map(user => <li key={user.id}>{user.email} - {user.role}</li>)}</ul>
    </div>
  );
};
