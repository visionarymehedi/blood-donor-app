import Donor from '../models/Donor.js';

// Get all approved donors (for frontend)
export const getApprovedDonors = async (req, res) => {
  const { division, district, thana, bloodGroup, name } = req.query;
  const filters = { status: 'approved' };

  if (division) filters.division = division;
  if (district) filters.district = district;
  if (thana) filters.thana = thana;
  if (bloodGroup) filters.bloodGroup = bloodGroup;
  if (name) filters.name = { $regex: name, $options: 'i' }; // Case-insensitive search

  try {
    const donors = await Donor.find(filters);
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new donor (user submission - defaults to pending)
export const addUserDonor = async (req, res) => {
  const { name, phone, bloodGroup, division, district, thana, village, note, lastDonation, gender } = req.body;

  const existingDonor = await Donor.findOne({ phone });
  if (existingDonor && existingDonor.status !== 'rejected') {
    return res.status(400).json({ message: 'This phone number is already registered or pending approval.' });
  }

  const newDonor = new Donor({
    name,
    phone,
    bloodGroup,
    division,
    district,
    thana,
    village,
    note,
    lastDonation,
    gender,
  });

  try {
    const savedDonor = await newDonor.save();
    res.status(201).json(savedDonor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a new donor (admin adds - directly approved)
export const addAdminDonor = async (req, res) => {
  const { name, phone, bloodGroup, division, district, thana, village, note, lastDonation, gender } = req.body;

  const existingDonor = await Donor.findOne({ phone });
  if (existingDonor) {
    return res.status(409).json({ message: 'This phone number is already registered.' });
  }

  const newDonor = new Donor({
    name,
    phone,
    bloodGroup,
    division,
    district,
    thana,
    village,
    note,
    lastDonation,
    gender,
    status: 'approved',
    addedByAdmin: true,
  });

  try {
    const savedDonor = await newDonor.save();
    res.status(201).json(savedDonor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all pending donors (for admin panel)
export const getPendingDonors = async (req, res) => {
  try {
    const pendingDonors = await Donor.find({ status: 'pending' });
    res.status(200).json(pendingDonors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve donor
export const approveDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject donor
export const rejectDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json({ message: 'Donor rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete donor
export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update donor availability
export const updateDonorAvailability = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { available: req.body.available },
      { new: true }
    );
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json({ message: 'Donor availability updated successfully', donor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rejected donors (for admin panel)
export const getRejectedDonors = async (req, res) => {
  try {
    const rejectedDonors = await Donor.find({ status: 'rejected' });
    res.status(200).json(rejectedDonors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all donor stats including total donors, approved, pending, rejected, and blood group stats
export const getBloodGroupStats = async (req, res) => {
  try {
    // Calculate the total number of donors (approved, pending, rejected)
    const totalDonors = await Donor.countDocuments();
    const approvedDonors = await Donor.countDocuments({ status: 'approved' });
    const pendingDonors = await Donor.countDocuments({ status: 'pending' });
    const rejectedDonors = await Donor.countDocuments({ status: 'rejected' });

    // Aggregate donors by blood group
    const bloodGroupStats = await Donor.aggregate([
      {
        $group: {
          _id: "$bloodGroup",   // Group by blood group
          count: { $sum: 1 }     // Count the number of donors in each blood group
        }
      },
    ]);

    // Return all stats in one response
    res.json({
      totalDonors,
      approvedDonors,
      pendingDonors,
      rejectedDonors,
      bloodGroupStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching blood group statistics' });
  }
};
