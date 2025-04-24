import express from 'express';
import {
  getApprovedDonors,
  addUserDonor,
  addAdminDonor,
  getPendingDonors,
  approveDonor,
  rejectDonor,
  deleteDonor,
  updateDonorAvailability,
  getRejectedDonors,
  getBloodGroupStats,
} from '../controllers/donorController.js';

const router = express.Router();

// Frontend routes (approved donors)
router.get('/', getApprovedDonors); // Get all approved donors for frontend
router.post('/', addUserDonor);   // Add new donor (user submission)

// Admin routes
router.get('/rejected', getRejectedDonors);
router.get('/pending', getPendingDonors); // Get pending donors for admin
router.post('/admin', addAdminDonor);     // Add new donor (admin panel - directly approved)
router.put('/:id/approve', approveDonor);  // Approve a pending donor
router.delete('/:id/reject', rejectDonor); // Reject a pending donor
router.delete('/:id', deleteDonor);       // Delete a donor (approved or rejected)
router.patch('/:id/availability', updateDonorAvailability); // Update donor availability

// Admin routes for Blood Group Stats
router.get('/stats/blood-groups', getBloodGroupStats); // Corrected route for blood group stats
router.get('/rejected', getRejectedDonors);  // Get rejected donors for admin

export default router;
