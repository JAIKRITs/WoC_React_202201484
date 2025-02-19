import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white">
      {/* <Navbar /> */}
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Welcome to Codepad
          </h1>
          <p className="text-xl text-gray-300 mb-8">
          Empower your ideas with a feature-rich, collaborative, and cloud-powered coding platform. <br />
          Build, debug, and share your projects effortlessly all in one place.
          </p>
          <div className="flex justify-center items-center space-x-4">
            {/* Login as Guest Button */}
            <motion.a
              href="/guest"
              className="border-2 border-blue-500 bg-gray-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-600 transition duration-300 hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              Login as Guest
              </motion.a>
            <motion.a
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              Get Started
            </motion.a>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 w-full max-w-6xl"
        >
          <h2 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Why Use Codepad?
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Multi-language Support",
                description: "Write and execute code in various languages including JavaScript, Python, Java, and more.",
                icon: "💻"
              },
              {
                title: "Real-time Code Execution",
                description: "Run your code instantly and see the output in real-time.",
                icon: "⚡"
              },
              {
                title: "Integrated Code Editor",
                description: "Enjoy a powerful code editor with syntax highlighting and autocompletion.",
                icon: "✍️"
              },
              {
                title: "File Management System",
                description: "Easily create, upload, and manage your code files in the cloud.",
                icon: "📁"
              },
              {
                title: "Customizable Themes",
                description: "Choose from various themes to personalize your coding environment.",
                icon: "🎨"
              },
              {
                title: "Terminal Integration",
                description: "Access a built-in terminal for executing commands and scripts.",
                icon: "🖥️"
              },
              {
                title: "AI Code Assistance",
                description: "Get help with coding through our integrated AI chat feature.",
                icon: "🤖"
              },
              {
                title: "Version Control",
                description: "Keep track of changes and manage different versions of your code.",
                icon: "🔄"
              },
              {
                title: "Collaborative Features",
                description: "Work together with your team in real-time on shared projects.",
                icon: "👥"
              }
            ].map((feature, index) => (
              <li
                key={index}
                className="bg-gray-800 shadow-lg rounded-lg p-6 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Additional Section for Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 w-full max-w-6xl"
        >
          <h2 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "John Doe",
                role: "Full Stack Developer",
                testimonial: "Codepad has revolutionized the way I collaborate with my team. Highly recommended!",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg"
              },
              {
                name: "Jane Smith",
                role: "Data Scientist",
                testimonial: "The code execution feature is lightning-fast. It saves me so much time!",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg"
              },
              {
                name: "Alex Johnson",
                role: "UI/UX Designer",
                testimonial: "I love the customizable themes. It makes coding so much more enjoyable.",
                avatar: "https://randomuser.me/api/portraits/men/3.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{testimonial.testimonial}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;