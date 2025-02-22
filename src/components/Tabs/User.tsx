import { type User } from '@prisma/client';
import React, { useState, useEffect } from 'react';
import { api } from '~/utils/api';

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { data: usersData, refetch } = api.user.getAllUsers.useQuery();
  const changeRoleMutation = api.user.changeUserRole.useMutation({
    onSuccess: async () => {
      setIsPopupOpen(false);
      await refetch();
    },
  });

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  const handleChangeRole = async () => {
    if (selectedUserId) {
      try {
        // Properly awaiting the mutateAsync function call
        await changeRoleMutation.mutateAsync({ userId: selectedUserId, role: newRole });
      } catch (error) {
        // Handle any potential errors
        console.error('Error changing role:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center text-3xl text-bold mb-8 py-5 text-center">ಅಧಿಕಾರ ನಿರ್ವಹಣೆ</h2>
      <table className="min-w-full border border-gray-300 bg-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center text-sm md:text-xl ">Email</th>
            <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center text-sm md:text-xl">Role</th>
            <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center text-sm md:text-xl ">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="py-2 px-4 border-b border-slate-700 text-center text-wrap text-sm md:text-xl ">{user.email}</td>
              <td className="py-2 px-4 border-b border-slate-700 text-center text-sm md:text-xl">{user.role}</td>
              <td className="py-2 px-4 border-b border-slate-700 text-center md:text-xl text-sm">
                <button 
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm md:text-xl"
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setNewRole(user.role);  // Set the default role to the user's current role
                    setIsPopupOpen(true);
                  }}
                >
                  Change Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-center w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Select New Role</h2>
            <select 
              className="w-full p-2 border rounded mb-4 bg-black text-white"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleChangeRole}  // Call the updated function
              >
                Submit
              </button>
              <button 
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
