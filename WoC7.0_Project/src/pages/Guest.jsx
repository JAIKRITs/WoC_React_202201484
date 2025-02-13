import React, { useState, useCallback, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { oneDark } from "@codemirror/theme-one-dark";
import { basicLight } from "@uiw/codemirror-theme-basic";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { solarizedLight, solarizedDark } from "@uiw/codemirror-theme-solarized";
import { lineNumbers, EditorView } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
import { LANGUAGE_DATA } from "./utils";
import Terminal from "../components/Terminal";
import AIChat from "../components/AIChat";
import { Rnd } from "react-rnd";
import axios from "axios";
import { motion } from "framer-motion"; // Import framer-motion for animations

function IDE() {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "javascript");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "oneDark");
  const [isWrappingEnabled, setIsWrappingEnabled] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);
  const [output, setOutput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const handleDownloadCode = () => {
    const fileExtensions = {
      javascript: "js",
      python: "py",
      html: "html",
      css: "css",
      java: "java",
      cpp: "cpp",
      php: "php",
      rust: "rs",
      sql: "sql",
      xml: "xml",
    };

    const fileExtension = fileExtensions[language] || "txt"; // Default to .txt if no match
    const fileName = `code.${fileExtension}`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Trigger the download
    link.click();

    // Cleanup
    URL.revokeObjectURL(link.href);
  };
  // Load the code for the selected language from localStorage
  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem(`code_${language}`);
    if (savedCode) return savedCode;

    const defaultSnippet = LANGUAGE_DATA.find((lang) => lang.language === language)?.codeSnippet;
    return defaultSnippet || "";
  });

  // Save language, theme, and code in localStorage on change
  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("theme", theme);
  }, [language, theme]);

  // Update code snippet when the language changes manually
  const handleLanguageChange = (newLanguage) => {
    // Save the current code for the previous language
    localStorage.setItem(`code_${language}`, code);

    // Update the language
    setLanguage(newLanguage);

    // Load the default snippet for the new language
    const defaultSnippet = LANGUAGE_DATA.find((lang) => lang.language === newLanguage)?.codeSnippet;
    setCode(defaultSnippet || "");
  };

  // Save the code for the current language on change
  useEffect(() => {
    localStorage.setItem(`code_${language}`, code);
  }, [code, language]);

  const onChange = useCallback((value) => {
    setCode(value);
  }, []);

  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "html":
        return html();
      case "css":
        return css();
      case "java":
        return java();
      case "cpp":
        return cpp();
      case "php":
        return php();
      case "rust":
        return rust();
      case "sql":
        return sql();
      case "xml":
        return xml();
      default:
        return javascript();
    }
  };

  const getTheme = () => {
    switch (theme) {
      case "oneDark":
        return oneDark;
      case "basicLight":
        return basicLight;
      case "githubLight":
        return githubLight;
      case "githubDark":
        return githubDark;
      case "dracula":
        return dracula;
      case "solarizedLight":
        return solarizedLight;
      case "solarizedDark":
        return solarizedDark;
      default:
        return oneDark;
    }
  };

  const executeCode = async () => {
    try {
      const languageData = LANGUAGE_DATA.find((lang) => lang.language === language);
      if (!languageData) {
        setOutput("Language not supported.");
        return;
      }

      const response = await axios.post("https://winter-of-code-react-js.vercel.app/code/execute-code", {
        language: language,
        version: languageData.version,
        sourceCode: code,
        codeInput: codeInput,
      });

      setOutput(response.data.output);
    } catch (error) {
      setOutput(error.response?.data?.output || "An error occurred while executing the code.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-lg">
      {/* Group Terminal, Language Selector, and Theme Selector together */}
          <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsTerminalVisible((prev) => !prev)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all duration-300"
          >
            <span className="material-icons text-white">Terminal</span>
          </motion.button>

        {/* Language Selector */}
        <motion.select
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="p-2 bg-gray-700 rounded-md text-white focus:outline-none"
          >
            {LANGUAGE_DATA.map((lang) => (
              <option key={lang.language} value={lang.language}>
                {lang.language.toUpperCase()}
              </option>
            ))}
          </motion.select>
          <motion.select
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="p-2 bg-gray-700 rounded-md text-white focus:outline-none"
          >
            <option value="oneDark">One Dark</option>
            <option value="basicLight">Basic Light</option>
            <option value="githubLight">GitHub Light</option>
            <option value="githubDark">GitHub Dark</option>
            <option value="dracula">Dracula</option>
            <option value="solarizedLight">Solarized Light</option>
            <option value="solarizedDark">Solarized Dark</option>
          </motion.select>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={executeCode}
          className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          Run Code
        </motion.button>

      {/* Group Enable Wrapping and Download Buttons together */}
      <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWrappingEnabled((prev) => !prev)}
            className="p-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-md hover:from-green-700 hover:to-teal-700 transition-all duration-300"
          >
            {isWrappingEnabled ? "Disable Wrapping" : "Enable Wrapping"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadCode}
            className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.5"
                d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* CodeMirror Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow"
      >
        <CodeMirror
          value={code}
          height="calc(100vh - 64px)"
          width="100%"
          extensions={[
            getLanguageExtension(),
            lineNumbers(),
            autocompletion(),
            isWrappingEnabled ? EditorView.lineWrapping : [],
          ]}
          theme={getTheme()}
          onChange={onChange}
        />
      </motion.div>

      {/* Terminal */}
      {isTerminalVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 w-full bg-black p-4 shadow-lg"
        >
          <Terminal
            onClose={() => setIsTerminalVisible(false)}
            output={output}
            onInputChange={(input) => setCodeInput(input)}
          />
        </motion.div>
      )}

      {/* AI Chat Button */}
      {!isAIChatVisible && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAIChatVisible(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          <svg
            height="24px"
            width="24px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 58 58"
            xmlSpace="preserve"
            className="w-6 h-6"
          >
            <g>
              <path
                style={{ fill: "#FFFFFF" }}
                d="M25,9.586C11.193,9.586,0,19.621,0,32c0,4.562,1.524,8.803,4.135,12.343
              C3.792,48.433,2.805,54.194,0,57c0,0,8.47-1.191,14.273-4.651c0.006-0.004,0.009-0.01,0.014-0.013
              c1.794-1.106,3.809-2.397,4.302-2.783c0.301-0.417,0.879-0.543,1.328-0.271c0.298,0.181,0.487,0.512,0.488,0.86
              c0.003,0.582-0.008,0.744-3.651,3.018c2.582,0.81,5.355,1.254,8.245,1.254c13.807,0,25-10.035,25-22.414S38.807,9.586,25,9.586z"
              />
              <path
                style={{ fill: "#FFFFFF" }}
                d="M58,23.414C58,11.035,46.807,1,33,1c-9.97,0-18.575,5.234-22.589,12.804
              C14.518,11.153,19.553,9.586,25,9.586c13.807,0,25,10.035,25,22.414c0,4.735-1.642,9.124-4.437,12.743
              C51.162,47.448,58,48.414,58,48.414c-2.805-2.805-3.792-8.566-4.135-12.657C56.476,32.217,58,27.976,58,23.414z"
              />
              <path
                style={{ fill: "#FFFFFF" }}
                d="M32.5,26h-14c-0.552,0-1-0.447-1-1s0.448-1,1-1h14c0.552,0,1,0.447,1,1S33.052,26,32.5,26z"
              />
              <path
                style={{ fill: "#FFFFFF" }}
                d="M38,33H13c-0.552,0-1-0.447-1-1s0.448-1,1-1h25c0.552,0,1,0.447,1,1S38.552,33,38,33z"
              />
              <path
                style={{ fill: "#FFFFFF" }}
                d="M38,40H13c-0.552,0-1-0.447-1-1s0.448-1,1-1h25c0.552,0,1,0.447,1,1S38.552,40,38,40z"
              />
            </g>
          </svg>
        </motion.button>
      )}

      {/* AI Chat */}
      {isAIChatVisible && (
        <Rnd
          default={{
            x: window.innerWidth - 400,
            y: window.innerHeight - 500,
            width: 350,
            height: 450,
          }}
          minWidth={300}
          minHeight={400}
          bounds="window"
          enableResizing={{ bottom: true, bottomRight: true, right: true }}
          className="z-50"
        >
          <AIChat onClose={() => setIsAIChatVisible(false)} />
        </Rnd>
      )}
    </div>
  );
}

export default IDE;