// -----------------------------
// HOW TO SET UP FRAMER MOTION
// -----------------------------
// 1. Install framer-motion with:
//      npm install framer-motion
//    OR
//      yarn add framer-motion
//
// 2. Import the components when needed:
//      import { motion, AnimatePresence } from "framer-motion"
//
// 3. Wrap your modal logic in <AnimatePresence> so
//    animations can run when the modal opens/closes
//
// -----------------------------
// EXAMPLE MODAL WITH ANIMATION
// -----------------------------

import { motion, AnimatePresence } from "framer-motion";

const ExampleModal = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        // Backdrop (fades in/out)
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal content (scales in/out) */}
          <motion.div
            className="relative bg-base-100 mockup-window max-w-4xl w-11/12 h-[80%] rounded-2xl shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            {/* Example content */}
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-purple-600">Goal Setting</h2>
              <p className="mt-4 text-gray-700">
                This is your modal content. Replace me with whatever you like ✨
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExampleModal;