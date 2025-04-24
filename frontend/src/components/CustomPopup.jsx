// src/components/CustomPopup.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

const CustomPopup = ({ show, onClose, message, subMessage }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full relative text-center border border-blue-200"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-blue-500 hover:text-blue-700"
            >
              <X size={22} />
            </button>

            <div className="flex justify-center mb-4">
              <AlertCircle className="text-blue-500" size={48} />
            </div>

            <h3 className="text-xl font-semibold text-blue-600">{message}</h3>
            <p className="text-sm text-gray-500 mt-2">{subMessage}</p>

            <button
              onClick={onClose}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl shadow transition"
            >
              Okay
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomPopup;
