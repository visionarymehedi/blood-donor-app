import React, { useState } from 'react';
import {
  Droplet,
  MapPin,
  Phone,
  Clock,
  CircleDot,
  CircleSlash,
  Copy,
  Check,
  StickyNote,
  X,
} from 'lucide-react';

const DonorCard = ({ donor }) => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const getAvatar = () => {
    if (donor.image) return donor.image;
    if (donor.gender === 'female') return '/avatars/female.png';
    if (donor.gender === 'male') return '/avatars/male.png';
    const name = donor.name?.split(' ').join('+') || 'User';
    return `https://ui-avatars.com/api/?name=${name}&background=F43F5E&color=fff`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(donor.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const maskPhone = (phone) => {
    if (!phone || phone.length !== 11) return phone;
    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-xxxxx`;
  };

  return (
    <div className="w-full text-left">
      <div className="group cursor-pointer flex justify-between items-start p-5 rounded-2xl shadow hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 mb-5 border border-gray-200 bg-white hover:bg-gradient-to-br hover:from-orange-600 hover:via-yellow-600 hover:to-red-600 hover:text-white">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img
            src={getAvatar()}
            alt="profile"
            className="w-16 h-16 rounded-full object-cover border border-gray-300 group-hover:border-white"
          />
          <div className="space-y-1">
            <h4 className="text-3xl font-semibold text-blue-700 group-hover:text-white transition">
              {donor.name}
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <Droplet size={30} className="text-red-500 group-hover:text-red-200 transition" />
              <span className="font-medium text-2xl text-black group-hover:text-white transition">
                Blood Group:
              </span>
              <span className="font-bold text-2xl text-red-700 group-hover:text-yellow-100 transition">
                {donor.bloodGroup}
              </span>
            </div>
            {donor.note && (
              <p className="text-sm italic flex items-center gap-1 group-hover:text-white transition text-gray-500">
                <StickyNote size={14} className="text-gray-400 group-hover:text-white" />
                {donor.note}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="text-sm flex flex-col items-end justify-start gap-2 min-w-[180px] pt-1">
          {/* Phone */}
          <div className="flex items-center gap-2 text-xl group-hover:text-yellow-100 transition">
            <Phone size={16} className="text-green-600 group-hover:text-green-300" />
            <span>Mobile:</span>
            {showFullNumber ? (
              <>
                <span className="font-semibold">{donor.phone}</span>
                <button onClick={handleCopy} className="text-blue-600 hover:text-white">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowPrivacyPopup(true)}
                className="underline text-blue-600 group-hover:text-yellow-200"
              >
                {maskPhone(donor.phone)}
              </button>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-700 group-hover:text-white transition">
            <MapPin size={16} className="text-blue-500 group-hover:text-yellow-200" />
            <span>Location: {donor.district}, {donor.thana}</span>
          </div>

          {/* Availability */}
          <div
            className={`flex items-center gap-1 font-semibold transition ${
              donor.available
                ? 'text-green-600 group-hover:text-green-200'
                : 'text-red-500 group-hover:text-pink-200'
            }`}
          >
            {donor.available ? <CircleDot size={16} /> : <CircleSlash size={16} />}
            <span>{donor.available ? 'Available Now' : 'Unavailable'}</span>
          </div>

          {/* Last Donation */}
          <div className="flex items-center gap-1 text-gray-500 text-xs group-hover:text-white transition">
            <Clock size={14} />
            <span>Last Donation: {formatDate(donor.lastDonation)}</span>
          </div>
        </div>
      </div>

      {/* Privacy Popup */}
      {showPrivacyPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md relative">
            <button
              onClick={() => setShowPrivacyPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-3 text-red-600">Privacy Notice</h2>
            <p className="text-gray-600 mb-4 text-sm">
              The donor has provided this phone number for emergency contact purposes. Please do not misuse or share it without consent. Thank you for respecting their privacy.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 px-4 py-1 rounded"
                onClick={() => setShowPrivacyPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-1 rounded"
                onClick={() => {
                  setShowPrivacyPopup(false);
                  setShowFullNumber(true);
                }}
              >
                Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorCard;
