// IDE.jsx
import React, { useState, useCallback, useEffect ,useRef} from "react";
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
import Terminal from "../components/Terminal";
import AIChat from "../components/AIChat";
import { LANGUAGE_DATA } from "./utils";
import { Rnd } from "react-rnd";
import FileStructure from "../components/FileStructure";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, saveFile, getFile, getFiles, deleteFile } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { addFile, setFiles,fetchFiles } from '../store/fileSlice';
import CreateFileModal from "../components/CreateFileModal";
import { showLoader,hideLoader } from "../store/LoaderSlice";
import Loader from "../components/Loader";

function IDE() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("oneDark");
  const [isWrappingEnabled, setIsWrappingEnabled] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);
  const [isFilePanelVisible, setIsFilePanelVisible] = useState(false);
  const [output, setOutput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [currentFileId, setCurrentFileId] = useState(null);
  const [user] = useAuthState(auth);
  const [lastSaved, setLastSaved] = useState(null);
  const [currentFileName, setCurrentFileName] = useState("");
  const [showSuggestionBox, setShowSuggestionBox] = useState(true);
  const [isFileStructureClickable, setIsFileStructureClickable] = useState(false);
  const dispatch = useDispatch();
  const files = useSelector(state => state.files.files);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [filesLoaded, setFilesLoaded] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showInitialSuggestion, setShowInitialSuggestion] = useState(false);
  const [initialFileLoaded, setInitialFileLoaded] = useState(false);
  const [isCreateFileModalOpen, setIsCreateFileModalOpen] = useState(false);
  const isLoading = useSelector((state) => state.loader.isLoading);
  // Handle file selection
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

    const fileExtension = fileExtensions[language] || "txt";
    const fileName = `code.${fileExtension}`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    link.click();

    URL.revokeObjectURL(link.href);
  };

  // Load files and check for last opened file
  useEffect(() => {
    const loadFilesAndRestore = async () => {
      if (user?.uid) {
        try {
          const files = await getFiles(user.uid);
          dispatch(setFiles(files));
          
          // Check localStorage for last opened file
          const lastFileId = localStorage.getItem('lastFileId');
          let fileToOpen = null;

          if (lastFileId) {
            fileToOpen = files.find(f => f.id === lastFileId);
          }

          if (!fileToOpen && files.length > 0) {
            // Auto-select first file if none was previously open
            fileToOpen = files[0];
          }

          if (fileToOpen) {
            handleFileSelect(fileToOpen);
            setShowSuggestionBox(false);
          } else {
            setShowSuggestionBox(true);
          }

          setInitialLoadComplete(true);
        } catch (error) {
          console.error("Error loading files:", error);
          setShowSuggestionBox(true);
          setInitialLoadComplete(true);
        } finally{
          dispatch(hideLoader());
        }
      }
    };
    loadFilesAndRestore();
  }, [user, dispatch]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchFiles({ userId: user.uid }));
    }
  }, [user, dispatch]);

  // Simplified suggestion box visibility logic
  useEffect(() => {
    if (initialLoadComplete) {
      dispatch(showLoader()); // Show loader while checking the condition
      const timer = setTimeout(() => {
        setShowSuggestionBox(files.length === 0);
        dispatch(hideLoader()); // Hide loader after condition is checked
      }, 500); // Simulate a delay for demonstration
      return () => clearTimeout(timer);
    }
  }, [initialLoadComplete, files.length, dispatch]);
  
  useEffect(() => {
    if (currentFileId) {
      localStorage.setItem('lastFileId', currentFileId);
    }
  }, [currentFileId]);

  // Suggestion Box visibility logic
  useEffect(() => {
    if (initialLoadComplete) {
      if (showInitialSuggestion) {
        setShowSuggestionBox(true);
      } else if (files.length === 0) {
        setShowSuggestionBox(true);
        setShowEmptyState(true);
      } else if (!currentFileId) {
        setShowSuggestionBox(false); // Don't show suggestion if files exist but none selected
      }
    }
  }, [initialLoadComplete, files.length, currentFileId, showInitialSuggestion]);

  const handleOpenExisting = () => {
    setIsFileStructureClickable(true);
    setShowSuggestionBox(false);
    setShowInitialSuggestion(false);
  };

  // Handle file upload
  const handleUploadFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    dispatch(showLoader()); // Show loader
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target.result;
      const fileName = file.name.split(".").slice(0, -1).join(".");
      const fileExtension = file.name.split(".").pop();
      const language = fileExtension === "js" ? "javascript" : fileExtension;
  
      const fileId = `file${Date.now()}`;
      const newFile = { id: fileId, name: fileName, code: fileContent, language };
  
      // Save to Firestore and update Redux state
      await saveFile(user.uid, fileId, newFile);
      dispatch(addFile({ userId: user.uid, fileId, data: newFile }));
      setCurrentFileId(fileId);
      setCurrentFileName(fileName);
      setCode(fileContent);
      setLanguage(language);
      setShowSuggestionBox(false); // Hide the suggestion box
      dispatch(hideLoader()); // Hide loader
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const selectedLanguage = LANGUAGE_DATA.find((lang) => lang.language === language);
    if (selectedLanguage) {
      setCode(selectedLanguage.codeSnippet);
    }
  }, [language]);

  //Autosave 
  const onChange = useCallback((value) => {
    setCode(value);
    localStorage.setItem(`file-${currentFileId}`, value); // Update local storage
  
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
  
    saveTimeoutRef.current = setTimeout(() => {
      if (currentFileId) {
        saveFile(user.uid, currentFileId, {
          name: currentFileName,
          code: value,
          language,
        });
      }
    }, 3000);
  }, [currentFileId, user, language, currentFileName]);
  
  // Load code from localStorage when file is selected
  useEffect(() => {
    if (currentFileId) {
      const savedCode = localStorage.getItem(`file-${currentFileId}`);
      if (savedCode) setCode(savedCode);
    }
  }, [currentFileId]);

  const handleFileSelect = async (file) => {
    // Save the current code before switching
    if (currentFileId) {
      const currentFileData = files.find(f => f.id === currentFileId);
      if (currentFileData) {
        const currentCode = localStorage.getItem(`file-${currentFileId}`) || currentFileData.code;
        await saveFile(user.uid, currentFileId, {
          ...currentFileData,
          code: currentCode, // Save the latest code from local storage
        });
      }
    }
  
    // Switch to the new file
    const newFileCode = localStorage.getItem(`file-${file.id}`) || file.code; // Retrieve from local storage
    setCurrentFileName(file.name);
    setCurrentFileId(file.id);
    setCode(newFileCode); // Set the code from local storage
    setLanguage(file.language);
    localStorage.setItem(`file-${file.id}`, newFileCode); // Update local storage
    localStorage.setItem('lastFileId', file.id);
    setShowInitialSuggestion(false);
  };

  // Handle creating a new file from the suggestion box
  const handleCreateFile = (fileName, language) => {
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

    const fileExtension = fileExtensions[language] || "txt";
    const fileId = `file${Date.now()}`;
    const languageSnippet = LANGUAGE_DATA.find((lang) => lang.language === language)?.codeSnippet || "";
    const newFile = {
      id: fileId,
      name: `${fileName}.${fileExtension}`, // Append the file extension
      code: languageSnippet,
      language,
    };

    saveFile(user.uid, fileId, newFile).then(() => {
      dispatch(addFile({ userId: user.uid, fileId, data: newFile }));
      handleFileSelect(newFile);
      setShowInitialSuggestion(false);
    });
  };

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

  // Load code from LocalStorage when file is selected
  useEffect(() => {
    if (currentFileId) {
      const savedCode = localStorage.getItem(`file-${currentFileId}`);
      if (savedCode) {
        setCode(savedCode); // Set the code from local storage
      } else {
        const fileData = files.find(f => f.id === currentFileId);
        if (fileData) {
          setCode(fileData.code); // Fallback to Firestore data
          localStorage.setItem(`file-${currentFileId}`, fileData.code); // Update local storage
        }
      }
    }
  }, [currentFileId, files]);



  // Set initial code snippet based on the selected language
  useEffect(() => {
    if (!currentFileId) {
      const selectedLanguage = LANGUAGE_DATA.find((lang) => lang.language === language);
      if (selectedLanguage && !code) { // Prevent overwriting existing code
        setCode(selectedLanguage.codeSnippet);
      }
    }
  }, [language, currentFileId, code]);  


  useEffect(() => {
    if (currentFileId) {
      setIsFileStructureClickable(false);
    }
  }, [currentFileId]);

  return (
    <div className="flex h-screen">
      {/* File Structure Panel */}
      <div className="w-1/4 bg-gray-900 text-white p-4">
        <FileStructure
          userId={user?.uid}
          onClose={() => setIsFilePanelVisible(false)}
          onFileSelect={handleFileSelect}
          isClickable={isFileStructureClickable}
          currentFileId={currentFileId}
          onCreateFile={() => setIsCreateFileModalOpen(true)}
        />
      </div>

      {/* CodeMirror Editor */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-gray-800 shadow-lg">
          {/* Group Hamburger, Terminal, Language Selector, and Theme Selector together */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Terminal Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTerminalVisible((prev) => !prev)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all duration-300"
            >
              <span className="material-icons text-white">Terminal</span>
            </motion.button>
  
  
  
            {/* Theme Selector */}
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
  
          {/* Run Code Button (in the middle) */}
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
            {/* Toggle Line Wrapping Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWrappingEnabled((prev) => !prev)}
              className="p-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-md hover:from-green-700 hover:to-teal-700 transition-all duration-300"
            >
              {isWrappingEnabled ? "Disable Wrapping" : "Enable Wrapping"}
            </motion.button>
  
            {/* Download Code Button */}
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

        {isLoading && <Loader />}

         {/* Suggestion Box */}
         {!isLoading && showSuggestionBox && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Welcome to Codepad!</h2>
              <p className="text-gray-300 mb-6">Get started by creating or uploading a file</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCreateFile}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Create New File
                </button>
                <label className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium cursor-pointer">
                  Upload File
                  <input
                    type="file"
                    accept=".js,.py,.html,.css,.java,.cpp,.php,.rs,.sql,.xml"
                    className="hidden"
                    onChange={handleUploadFile}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Create File Modal */}
        <CreateFileModal
          isOpen={isCreateFileModalOpen}
          onClose={() => setIsCreateFileModalOpen(false)}
          onSubmit={handleCreateFile}
        />

        {/* CodeMirror Editor */}
        {!showSuggestionBox && (
          <CodeMirror
            value={code}
            height="calc(100vh - 64px)"
            width="100%"
            extensions={[
              getLanguageExtension(),
              lineNumbers(),
              autocompletion(),
              isWrappingEnabled ? EditorView.lineWrapping : []
            ]}
            theme={getTheme()}
            onChange={onChange}
          />
        )}
  
        {/* Terminal */}
        {isTerminalVisible && (
          <div className="fixed bottom-0 left-0 w-full">
            <Terminal
              onClose={() => setIsTerminalVisible(false)}
              output={output}
              onInputChange={(input) => setCodeInput(input)}
            />
          </div>
        )}
  
        {/* AI Chat Button */}
        {!isAIChatVisible && (
          <button
            onClick={() => setIsAIChatVisible(true)}
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
              x: window.innerWidth / 2 - 175, // Center the AIChat horizontally
              y: window.innerHeight / 2 - 225, // Center the AIChat vertically
              width: 350,
              height: 450,
            }}
            minWidth={300}
            minHeight={400}
            bounds="parent" // Restrict movement within the parent container
            enableResizing={{
              bottom: true,
              bottomRight: true,
              right: true,
            }}
            className="z-50"
            style={{
              position: 'absolute', // Ensure the Rnd component is positioned absolutely
            }}
          >
            <AIChat onClose={() => setIsAIChatVisible(false)} />
          </Rnd>
        )}
      </div>
    </div>
  );
}

export default IDE;