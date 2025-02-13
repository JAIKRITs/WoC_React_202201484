import React, { useState, useEffect } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { useDispatch, useSelector } from 'react-redux';
import { addFile, editFile, removeFile,fetchFiles } from '../store/fileSlice';
import { saveFile, getFiles, deleteFile } from '../firebase';
import { LANGUAGE_DATA } from '../pages/utils';
import { showLoader, hideLoader } from "../store/LoaderSlice";
import Loader from "./Loader";

const RenameIcon = () => (
  <img src="/Rename.svg" alt="Rename" className="h-5 w-5" />
);

const DeleteIcon = () => (
  <img src="/delete.svg" alt="Delete" className="h-5 w-5" />
);

const FileStructure = ({ userId, onClose, onFileSelect,currentFileId, onCreateFile}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loader.isLoading);
  const files = useSelector(state => state.files.files);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileLanguage, setNewFileLanguage] = useState("javascript");

  // Load files from Firestore
  useEffect(() => {
    const loadFiles = async () => {
      dispatch(showLoader()); // Show loader
      try {
        const files = await getFiles(userId);
        dispatch(setFiles(files));
      } catch (error) {
        console.error("Error loading files:", error);
      } finally {
        dispatch(hideLoader()); // Hide loader
      }
    };
    loadFiles();
  }, [userId, dispatch]);

  // Handle file selection
  const handleFileClick = async (file) => {
    onFileSelect(file);
    setCurrentFile(file.id);
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchFiles({ userId }));
    }
  }, [userId, dispatch]);
  
  // Add a new file
  const handleAddFile = async () => {
    const fileName = prompt("Enter the new file name:");
    const language = prompt("Enter the language (e.g., javascript, python):");
    if (fileName && language) {
      const fileId = `file${Date.now()}`;
      const languageSnippet = LANGUAGE_DATA.find(lang => lang.language === language)?.codeSnippet || '';
      const newFile = { id: fileId, name: fileName, code: languageSnippet, language };
  
      dispatch(addFile({ userId, fileId, data: newFile }));
  
      await saveFile(userId, fileId, newFile);
  
      onFileSelect(newFile);
    }
  };

  // Handle file upload
  const handleUploadFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target.result;
      const fileName = file.name.split('.').slice(0, -1).join('.');
      const fileExtension = file.name.split('.').pop();
      const language = fileExtension === 'js' ? 'javascript' : fileExtension;

      const fileId = `file${Date.now()}`;
      const newFile = { id: fileId, name: fileName, code: fileContent, language };

      // Save to Firestore and update Redux state
      saveFile(userId, fileId, newFile).then(() => {
        dispatch(addFile({ userId, fileId, data: newFile }));
        onFileSelect(newFile); // Automatically select the uploaded file
      });
    };
    reader.readAsText(file);
  };

  // Rename a file
  const handleRenameFile = async () => {
    if (!newFileName.trim() || !currentFile) return;

    try {
      const existingFile = files.find(file => file.id === currentFile);
      if (!existingFile) {
        console.error("File not found in state");
        return;
      }

      const updatedFile = { ...existingFile, name: newFileName };

      // Update in Firestore and Redux state
      await saveFile(userId, currentFile, updatedFile);
      dispatch(editFile({ id: currentFile, data: { name: newFileName } }));

      setIsModalOpen(false);
      setNewFileName("");
    } catch (error) {
      console.error("Error renaming file:", error);
    }
  };

  // Delete a file
  const handleDeleteFile = async (fileId) => {
    if (!userId || !fileId) {
      console.error("Missing userId or fileId in handleDeleteFile");
      return;
    }
  
    if (window.confirm(`Are you sure you want to delete ${fileId}?`)) {
      dispatch(showLoader()); 
      try {
        await deleteFile(userId, fileId);
        dispatch(removeFile({ fileId })); 
      } catch (error) {
        console.error("Error deleting file:", error);
      } finally {
        dispatch(hideLoader()); 
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg shadow-lg w-80">
      {isLoading && <Loader />}
      {/* Header and Add New File Button */}
      <div className="p-4">
        <h2 className="text-center text-2xl font-bold text-gray-100 mb-4">File Manager</h2>
        <div className="pt-4 border-t border-gray-700 mt-2"></div>
        <button
          onClick={onCreateFile}
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium mb-2"
        >
          Add New File
        </button>
        {/* Upload File Button */}
        <label className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium cursor-pointer text-center block">
          Upload File
          <input
            type="file"
            accept=".js,.py,.html,.css,.java,.cpp,.php,.rs,.sql,.xml"
            className="hidden"
            onChange={handleUploadFile}
          />
        </label>
      </div>

      {/* File List (Scrollable) */}
      {!isLoading &&(<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 px-4">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 mb-2 ${
              currentFileId === file.id ? 'bg-blue-600' : 'hover:bg-blue-600'
            }`}
            onClick={() => handleFileClick(file)} // Handle file click
          >
            <span className="text-gray-300 font-medium text-lg">{file.name}</span>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentFile(file.id);
                  setIsModalOpen(true);
                }}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
              >
                <RenameIcon/>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file.id);
                }}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                <DeleteIcon/>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Rename Modal */}
      {isModalOpen && (
        <div className="fixed flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-bold mb-4">Rename File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4"
              placeholder="Enter new file name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameFile}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileStructure;