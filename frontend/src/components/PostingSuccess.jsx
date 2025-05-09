import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Alert = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 3000); // auto-close after 3s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-5 right-5 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg z-50"
        >
          Thank you for posting! Your ad has been submitted successfully.
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
