const express = require('express');
const router = express.Router();
const { authMiddleware, roleCheck } = require('../middleware/auth');

const {
    createUser, 
    getAllUsers,
    updateUserRoleAndDepartment,
    deleteUser,
    changePassword
} = require('../controllers/userController');

router.post('/', authMiddleware, roleCheck('admin'), createUser);

router.get('/', authMiddleware, roleCheck('admin'), getAllUsers);

router.put('/:id', authMiddleware, roleCheck('admin'), updateUserRoleAndDepartment);

router.delete('/:id', authMiddleware, roleCheck('admin'), deleteUser);

router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department || null
    });
});

router.post('/change-password', authMiddleware, changePassword);

module.exports = router;