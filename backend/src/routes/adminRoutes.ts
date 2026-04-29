import express from 'express';
import { getLoansByStatus, updateLoanStatus, recordPayment } from '../controllers/adminController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

// Admin can access all, other roles are restricted within controller or specific routes
router.get('/loans', authorize('Admin', 'Sales', 'Sanction', 'Disbursement', 'Collection'), getLoansByStatus);
router.put('/loans/:id/status', authorize('Admin', 'Sales', 'Sanction', 'Disbursement'), updateLoanStatus);
router.post('/loans/:id/payment', authorize('Admin', 'Collection'), recordPayment);

export default router;
