import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa";

const Hero = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <section className="relative bg-gray-100 overflow-hidden">
      {/* Background layer for opacity effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d9e9f2] to-[#f0f9fa] z-0" />

      <div
        ref={ref}
        className="relative z-10 flex flex-col lg:flex-row items-center justify-between bg-[#f0f9fa] rounded-3xl px-8 py-16 lg:px-20 lg:py-20 m-6 lg:m-12 shadow-2xl"
      >
        <div className="text-left max-w-2xl w-full">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            variants={textVariants}
            initial="hidden"
            animate={controls}
            custom={1}
          >
            Easy way to find a <br /> perfect property
          </motion.h1>

          <motion.p
            className="text-gray-600 text-xl mb-10"
            variants={textVariants}
            initial="hidden"
            animate={controls}
            custom={2}
          >
            We provide a complete service for the sale, purchase or rental of real
            estate.
          </motion.p>

          {/* Search Filters Box */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate={controls}
            custom={3}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-4 lg:p-6 shadow-xl flex flex-col lg:flex-row gap-4 items-center lg:items-end w-full max-w-3xl"
          >
            {/* Location */}
            <div className="flex-1 w-full">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Location
              </label>
              <div className="relative">
                <FiMapPin className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Select Your City"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="flex-1 w-full">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Property Type
              </label>
              <div className="relative">
                <select className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <option>Choose Property Type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Land</option>
                </select>
                <FaAngleDown className="absolute top-3 right-3 text-gray-400" />
              </div>
            </div>

            {/* Price Range */}
            <div className="flex-1 w-full">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Price Range
              </label>
              <div className="relative">
                <select className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <option>Choose Price Range</option>
                  <option>$500 - $1,000</option>
                  <option>$1,000 - $2,000</option>
                  <option>$2,000+</option>
                </select>
                <FaAngleDown className="absolute top-3 right-3 text-gray-400" />
              </div>
            </div>

            {/* Search Button */}
            <button className="bg-[#29659e] hover:bg-[#8dccff] text-white hover:text-black p-3 rounded-xl mt-4 lg:mt-0 cursor-pointer">
              <FiSearch size={20} />
            </button>
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate={controls}
          className="hidden md:block mt-12 lg:mt-0 lg:ml-16 max-w-[550px] w-full"
        >
          <img
            src="/image.png"
            alt="hero"
            className="w-full h-auto object-cover rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
