
import React from 'react';
import { User, UserRole } from '../../types';

interface UserManagementProps {
  store: any;
}

const UserManagement: React.FC<UserManagementProps> = ({ store }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-xs font-bold text-slate-400 uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Role</th>
              <th className="p-4">Address</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {store.users.map((user: User) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{user.fullName}</td>
                <td className="p-4">{user.mobileNumber}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-xs">
                  {user.address.sector}, House {user.address.houseNumber}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => store.deleteUser(user.id)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
