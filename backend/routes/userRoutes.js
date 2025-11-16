const express = require('express');
const router = express.Router();
const { authMiddleware, roleCheck } = require('../middleware/auth');

const {
    createUser, 
    getAllUsers,
    updateUserRoleAndDepartment
} = require('../controllers/userController');

router.post('/', authMiddleware, roleCheck('admin'), createUser);

router.get('/', authMiddleware, roleCheck('admin'), getAllUsers);

router.put('/:id', authMiddleware, roleCheck('admin'), updateUserRoleAndDepartment);

router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department || null
    });
});

module.exports = router;