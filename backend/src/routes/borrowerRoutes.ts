import express from 'express';
import multer from 'multer';
import { updatePersonalDetails, uploadSalarySlip, applyForLoan, getLoanStatus } from '../controllers/borrowerController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.use(protect, authorize('Borrower'));

router.put('/personal-details', updatePersonalDetails);
router.post('/upload-salary-slip', upload.single('file'), uploadSalarySlip);
router.post('/apply', applyForLoan);
router.get('/loan-status', getLoanStatus);

export default router;
