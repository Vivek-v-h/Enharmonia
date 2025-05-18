import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const images = [
  'https://via.placeholder.com/600x224?text=Image+1',
  'https://via.placeholder.com/600x224?text=Image+2',
  'https://via.placeholder.com/600x224?text=Image+3',
];

const ImageSlider = () => {
  const [[index, direction], setIndex] = useState([0, 0]);

  const paginate = (newDirection) => {
    setIndex([
      (index + newDirection + images.length) % images.length,
      newDirection
    ]);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    }),
  };

  return (
    <div className="relative w-full h-56 bg-gray-200 rounded-md mb-2 overflow-hidden">
      <AnimatePresence custom={direction}>
        <motion.img
          key={index}
          src={images[index]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="absolute w-full h-full object-cover rounded-md"
        />
      </AnimatePresence>
      <button
        onClick={() => paginate(-1)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1"
      >
        ‹
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1"
      >
        ›
      </button>
    </div>
  );
};

export default ImageSlider;
