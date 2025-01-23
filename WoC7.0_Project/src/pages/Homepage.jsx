import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white">
      {/* <Navbar /> */}
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4 transition-transform transform hover:scale-105">
            Welcome to Codepad
          </h1>
          <p className="text-lg mb-8">
            Your online IDE for coding, collaborating, and creating.
          </p>
          <div className="flex justify-center items-center space-x-4">
            {/* Login as Guest Button */}
            <a
              href="/guest"
              className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition duration-300"
            >
              Login as Guest
            </a>

            {/* Get Started Button */}
            <a
              href="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
            >
              Get Started
            </a>
          </div>
        </div>

        <section className="mt-16 w-full max-w-5xl">
          <h2 className="text-3xl font-semibold mb-6 text-center">Why Use Codepad?</h2>
          <ul className="grid gap-8 sm:grid-cols-2">
            {[
              {
                title: "Real-time Collaboration",
                description: "Collaborate with your team in real time, from anywhere."
              },
              {
                title: "Code Execution",
                description: "Run your code instantly with support for multiple languages."
              },
              {
                title: "Syntax Highlighting",
                description: "Enjoy rich syntax highlighting for better readability."
              },
              {
                title: "File Management",
                description: "Save, organize, and access your code files easily."
              }
            ].map((feature, index) => (
              <li
                key={index}
                className="bg-gray-800 shadow-lg rounded-lg p-6 cursor-pointer transition-transform transform hover:scale-105"
              >
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm">{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
