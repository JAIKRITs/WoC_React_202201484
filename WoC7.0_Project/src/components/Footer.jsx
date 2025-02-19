import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800"
    >
      <div className="container mx-auto px-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Codepad. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-gray-500">
          Made with ❤️ by Jaikrit
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;