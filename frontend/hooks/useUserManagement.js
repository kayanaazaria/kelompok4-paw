import { useState, useCallback } from 'react';
import { getAllUsers, updateUserRole, deleteUser, createUser } from '@/services/userService';

export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'hse',
    department: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllUsers();
      setUsers(data.data || data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat data pengguna');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'hse',
      department: ''
    });
    setFormErrors({});
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      department: user.department || ''
    });
    setFormErrors({});
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'hse',
      department: ''
    });
    setFormErrors({});
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!editingUser) {
      if (!formData.username.trim()) {
        errors.username = 'Username wajib diisi';
      }
      if (!formData.email.trim()) {
        errors.email = 'Email wajib diisi';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Format email tidak valid';
      }
      if (!formData.password.trim()) {
        errors.password = 'Sandi wajib diisi';
      } else if (formData.password.length < 8) {
        errors.password = 'Sandi minimal 8 karakter';
      }
    }

    if (formData.role === 'kepala_bidang' && !formData.department) {
      errors.department = 'Department wajib dipilih untuk Kepala Bidang';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [editingUser, formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setError('');
      
      if (editingUser) {
        // Update user - only role and department
        const userId = editingUser._id || editingUser.id;
        const updateData = {
          role: formData.role,
          ...(formData.role === 'kepala_bidang' && { department: formData.department })
        };
        await updateUserRole(userId, updateData.role, updateData.department);
        setUsers(users.map(u => 
          (u._id === userId || u.id === userId) 
            ? { ...u, ...updateData } 
            : u
        ));
      } else {
        // Create new user
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ...(formData.role === 'kepala_bidang' && { department: formData.department })
        };
        const newUser = await createUser(userData);
        setUsers([...users, newUser.data || newUser]);
      }
      
      closeModal();
    } catch (err) {
      setError(err.message || (editingUser ? 'Gagal mengupdate pengguna' : 'Gagal membuat pengguna baru'));
      console.error('Error:', err);
    }
  }, [validateForm, editingUser, formData, users, closeModal]);

  const handleDeleteUser = useCallback(async (userId) => {
    try {
      setError('');
      await deleteUser(userId);
      setUsers(users.filter(u => (u._id !== userId && u.id !== userId)));
      setShowDeleteModal(false);
      setUserToDelete(null);
      closeModal();
    } catch (err) {
      setError(err.message || 'Gagal menghapus pengguna');
      console.error('Error deleting user:', err);
    }
  }, [users, closeModal]);

  const openDeleteModal = useCallback((user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  }, []);

  return {
    users,
    loading,
    error,
    editingUser,
    showModal,
    showDeleteModal,
    userToDelete,
    formData,
    formErrors,
    setFormData,
    fetchUsers,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDeleteUser,
    openDeleteModal,
    closeDeleteModal
  };
}
