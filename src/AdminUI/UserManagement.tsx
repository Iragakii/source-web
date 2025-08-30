import React, { useState, useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5002/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setUsers(result.data);
        }
      } else {
        showNotification("Failed to load users", "error");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      showNotification("Failed to load users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser && formData.password !== formData.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      if (editingUser) {
        // Update user (excluding password fields for updates)
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        };

        const response = await fetch(`http://localhost:5002/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          showNotification("User updated successfully!", "success");
          loadUsers(); // Reload users
        } else {
          showNotification("Failed to update user", "error");
        }
      } else {
        // Create new user
        const response = await fetch('http://localhost:5002/api/admin/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role
          })
        });

        if (response.ok) {
          showNotification("User created successfully!", "success");
          loadUsers(); // Reload users
        } else {
          const errorResult = await response.json();
          showNotification(errorResult.message || "Failed to create user", "error");
        }
      }
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      showNotification("Failed to save user", "error");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
      confirmPassword: "",
    });
    setShowModal(true);
  };

  const handleDelete = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.role === "admin" && users.filter(u => u.role === "admin" && u.isActive).length <= 1) {
      showNotification("Cannot delete the last active admin user", "error");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5002/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          showNotification("User deleted successfully!", "success");
          loadUsers(); // Reload users
        } else {
          showNotification("Failed to delete user", "error");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        showNotification("Failed to delete user", "error");
      }
    }
  };

  const handleToggleActive = async (userId: string) => {
    const userToToggle = users.find(u => u.id === userId);
    if (userToToggle?.role === "admin" && userToToggle.isActive && 
        users.filter(u => u.role === "admin" && u.isActive).length <= 1) {
      showNotification("Cannot deactivate the last active admin user", "error");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5002/api/admin/users/${userId}/toggle-active`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showNotification("User status updated!", "success");
        loadUsers(); // Reload users
      } else {
        showNotification("Failed to update user status", "error");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      showNotification("Failed to update user status", "error");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (userToUpdate?.role === "admin" && newRole === "user" && 
        users.filter(u => u.role === "admin" && u.isActive).length <= 1) {
      showNotification("Cannot change role of the last active admin user", "error");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5002/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...userToUpdate,
          role: newRole
        })
      });

      if (response.ok) {
        showNotification("User role updated!", "success");
        loadUsers(); // Reload users
      } else {
        showNotification("Failed to update user role", "error");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      showNotification("Failed to update user role", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    });
    setEditingUser(null);
    setShowModal(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && user.isActive) ||
                         (filterStatus === "inactive" && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-mono text-[#2b4539] font-bold">[ USER MANAGEMENT ]</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2b4539] text-[#61dca3] font-mono py-2 px-6 rounded hover:bg-[#3a5a47] transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          [ + ADD USER ]
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-[#61dca3] font-bold">{users.length}</div>
          <div className="text-sm font-mono text-[#2b4539]">Total Users</div>
        </div>
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-[#61b3dc] font-bold">
            {users.filter(u => u.role === "admin").length}
          </div>
          <div className="text-sm font-mono text-[#2b4539]">Admins</div>
        </div>
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-[#61dca3] font-bold">
            {users.filter(u => u.isActive).length}
          </div>
          <div className="text-sm font-mono text-[#2b4539]">Active</div>
        </div>
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-red-400 font-bold">
            {users.filter(u => !u.isActive).length}
          </div>
          <div className="text-sm font-mono text-[#2b4539]">Inactive</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-black/50 border border-[#2b4539] rounded-lg p-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-[#2b4539] rounded px-4 py-2 text-[#2b4539] font-mono focus:border-[#2b4539] focus:outline-none"
          />
        </div>
        <div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-black border border-[#2b4539] rounded px-4 py-2 text-[#2b4539] font-mono focus:border-[#2b4539] focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black border border-[#2b4539] rounded px-4 py-2 text-[#2b4539] font-mono focus:border-[#2b4539] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-[#2b4539] font-mono">Loading users...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-black/50 border rounded-lg p-4 transition-all duration-300 ${
                user.isActive ? 'border-[#2b4539] hover:border-[#61dca3]' : 'border-red-500/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-[#61dca3] font-mono font-bold">{user.username}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      user.role === 'admin' 
                        ? 'bg-[#61b3dc] text-black' 
                        : 'bg-[#2b4539] text-[#61dca3]'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      user.isActive 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  
                  <p className="text-[#61b3dc] font-mono text-sm">{user.email}</p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="text-[#2b4539] font-mono">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[#2b4539] font-mono">
                      Updated: {new Date(user.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-black border border-[#2b4539] rounded px-2 py-1 text-xs text-[#2b4539] font-mono focus:border-[#2b4539] focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  
                  <button
                    onClick={() => handleToggleActive(user.id)}
                    className={`font-mono py-1 px-3 rounded text-xs transition-all duration-300 ${
                      user.isActive
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {user.isActive ? 'DISABLE' : 'ENABLE'}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-[#2b4539] text-[#61dca3] font-mono py-1 px-3 rounded text-xs hover:bg-[#3a5a47] transition-all duration-300"
                  >
                    EDIT
                  </button>
                  
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 text-white font-mono py-1 px-3 rounded text-xs hover:bg-red-700 transition-all duration-300"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* No users found */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <div className="text-[#2b4539] font-mono">No users found matching your criteria.</div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-black border-2 border-[#2b4539] rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-[#2b4539] font-mono text-xl mb-6">
              {editingUser ? "[ EDIT USER ]" : "[ ADD NEW USER ]"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#2b4539] font-mono text-sm mb-2">Username:</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#2b4539] font-mono focus:border-[#61dca3] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#2b4539] font-mono text-sm mb-2">Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#2b4539] font-mono focus:border-[#61dca3] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#2b4539] font-mono text-sm mb-2">Role:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-black border border-[#2b4539] rounded px-3 py-2 text-[#2b4539] font-mono focus:border-[#61dca3] focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label className="block text-[#2b4539] font-mono text-sm mb-2">Password:</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#2b4539] font-mono focus:border-[#61dca3] focus:outline-none"
                      required={!editingUser}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-[#2b4539] font-mono text-sm mb-2">Confirm Password:</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#2b4539] font-mono focus:border-[#61dca3] focus:outline-none"
                      required={!editingUser}
                      minLength={6}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-transparent border-2 border-[#61b3dc] text-[#61b3dc] font-mono py-2 px-6 rounded hover:bg-[#61b3dc] hover:text-black transition-all duration-300"
                >
                  [ CANCEL ]
                </button>
                <button
                  type="submit"
                  className="bg-[#2b4539] text-[#61dca3] font-mono py-2 px-6 rounded hover:bg-[#3a5a47] transition-all duration-300"
                >
                  [ {editingUser ? "UPDATE" : "CREATE"} ]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
