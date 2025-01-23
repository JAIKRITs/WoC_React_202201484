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
import { lineNumbers } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
import Terminal from "../components/Terminal";
import AIChat from "../components/AIChat";
import Navbar from "../components/Navbar";
import { LANGUAGE_DATA } from "./utils";
import { Rnd } from "react-rnd"; // Import Rnd from react-rnd

function IDE() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("oneDark");
  const [isWrappingEnabled, setIsWrappingEnabled] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);

  // Set initial code snippet based on the selected language
  useEffect(() => {
    const selectedLanguage = LANGUAGE_DATA.find((lang) => lang.language === language);
    if (selectedLanguage) {
      setCode(selectedLanguage.codeSnippet);
    }
  }, [language]);

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

  return (
    <div className="flex flex-col h-screen">
      {/* <Navbar /> */}

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        {/* Terminal Toggle Button */}
        <button
          onClick={() => setIsTerminalVisible((prev) => !prev)}
          className="p-2 hover:bg-gray-700 rounded-md transition-colors"
        >
          <span className="material-icons">terminal</span>
        </button>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 bg-gray-700 rounded-md"
        >
          {LANGUAGE_DATA.map((lang) => (
            <option key={lang.language} value={lang.language}>
              {lang.language.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Theme Selector */}
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="p-2 bg-gray-700 rounded-md"
        >
          <option value="oneDark">One Dark</option>
          <option value="basicLight">Basic Light</option>
          <option value="githubLight">GitHub Light</option>
          <option value="githubDark">GitHub Dark</option>
          <option value="dracula">Dracula</option>
          <option value="solarizedLight">Solarized Light</option>
          <option value="solarizedDark">Solarized Dark</option>
        </select>

        {/* Run Code Button */}
        <button
          onClick={() => console.log("Running code:", code)}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Run Code
        </button>

        {/* Toggle Line Wrapping Button */}
        <button
          onClick={() => setIsWrappingEnabled((prev) => !prev)}
          className="p-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
        >
          {isWrappingEnabled ? "Disable Wrapping" : "Enable Wrapping"}
        </button>
      </div>

      {/* CodeMirror Editor */}
      <CodeMirror
        value={code}
        height="calc(100vh - 64px)"
        width="100%"
        extensions={[getLanguageExtension(), lineNumbers(), autocompletion()]}
        theme={getTheme()}
        onChange={onChange}
        basicSetup={{
          lineWrapping: isWrappingEnabled,
        }}
      />

      {/* Terminal */}
      {isTerminalVisible && (
        <div className="fixed bottom-0 left-0 w-full bg-black p-4">
          <Terminal onClose={() => setIsTerminalVisible(false)} />
        </div>
      )}


      {/* AI Chat Button */}
      {!isAIChatVisible && ( // Conditionally render the button
        <button
          onClick={() => setIsAIChatVisible(true)} // Open AI Chat
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
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
        </button>
      )}

      {/* AI Chat */}
      {isAIChatVisible && (
        <Rnd
          default={{
            x: window.innerWidth - 400, // Initial X position (right side)
            y: window.innerHeight - 500, // Initial Y position (bottom side)
            width: 350, // Initial width
            height: 450, // Initial height
          }}
          minWidth={300} // Minimum width
          minHeight={400} // Minimum height
          bounds="window" // Restrict dragging within the window
          enableResizing={{
            bottom: true,
            bottomRight: true,
            right: true,
          }} // Enable resizing
          className="z-50" // Ensure it stays on top
        >
          <AIChat onClose={() => setIsAIChatVisible(false)} />
        </Rnd>
      )}
    </div>
  );
}

export default IDE;