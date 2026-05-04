import React, { useEffect } from 'react';
import { FiTrash2, FiUser, FiMail, FiShield, FiCalendar } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, deleteUser } from '../../redux/slices/userSlice';
import toast from 'react-hot-toast';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch, success]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id)).then(() => {
        toast.success('User deleted successfully');
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-accent">Customer Management</h3>
        <p className="text-gray-400 text-sm mt-1">Manage and monitor all registered customers</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400 font-bold animate-pulse">Loading users...</div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 font-bold">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">User</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Email</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Role</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Joined</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(Array.isArray(users) ? users : []).map((user) => (
                  <tr key={user?._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-accent">{user?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: {user?._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FiMail className="text-gray-400" />
                        <span>{user?.email}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user?.role === 'admin' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                      }`}>
                        <FiShield />
                        <span>{user?.role}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="text-gray-400" />
                        <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => deleteHandler(user?._id)}
                        className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                        disabled={user?.role === 'admin'}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
