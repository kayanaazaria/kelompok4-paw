const User = require('../models/userModel');

const createUser = async (req, res, next) => {
    const { username, email, password, role, department } = req.body;
    try {
        if (!username || !email || !password || !role) {
            res.status(400);
            return next(new Error('Silahkan isi bagian yang belum diisi'));
        }
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            res.status(400);
            return next(new Error('User dengan email atau username tersebut sudah ada'));
        }
        
        const user = await User.create({ username, email, password, role, department });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department
            });
        }
    } catch (err) {
        next(err);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const updateUserRoleAndDepartment = async (req, res, next) => {
    const { role, department } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            return next(new Error('User tidak ditemukan'));
        }

        user.role = role || user.role;

        if (role === 'kepala_bidang') {
            if (!department) {
                res.status(400);
                return next(new Error('Department wajib diisi untuk role Kepala Bidang.'));
            }
            user.department = department;
        } else {
            user.department = undefined; 
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    updateUserRoleAndDepartment
};
