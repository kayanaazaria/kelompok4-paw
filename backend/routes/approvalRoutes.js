const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// CRUD Approval
router.post('/', authMiddleware, approvalController.createApproval);
router.get('/', authMiddleware, approvalController.getApprovals);
router.put('/:id', authMiddleware, approvalController.updateApproval);
router.delete('/:id', authMiddleware, approvalController.deleteApproval);

module.exports = router;
