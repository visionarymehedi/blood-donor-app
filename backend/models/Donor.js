import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  bloodGroup: { type: String, required: true },
  division: { type: String, required: true },
  district: { type: String, required: true },
  thana: { type: String, required: true },
  village: { type: String, default: '' },
  note: { type: String, default: '' },
  lastDonation: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return !isNaN(Date.parse(value));
      },
      message: 'Invalid date format for last donation.'
    }
  },
  available: { type: Boolean, default: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  image: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  addedByAdmin: { type: Boolean, default: false }, // To differentiate admin-added donors
}, { timestamps: true });

export default mongoose.model('Donor', donorSchema);