import { createSlice } from '@reduxjs/toolkit';
import { saveFile, getFile, getFiles, updateFile, deleteFile } from '../firebase';

const initialState = {
    files: [], // Array of all files
    currentFile: null, // Currently selected file
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        setFiles: (state, action) => {
            state.files = action.payload;
            state.status = 'succeeded';
        },
        setCurrentFile: (state, action) => {
            state.currentFile = action.payload;
        },
        addFile: (state, action) => {
            const { userId, fileId, data } = action.payload;
            state.files.push({ id: fileId, ...data }); 
        },
        removeFile: (state, action) => {
            const { fileId } = action.payload;
            state.files = state.files.filter(file => file.id !== fileId);
            if (state.currentFile?.id === fileId) {
              state.currentFile = null; 
            }
        },
        editFile: (state, action) => {
            const index = state.files.findIndex(file => file.id === action.payload.id);
            if (index !== -1) {
              state.files[index] = { ...state.files[index], ...action.payload.data };
              if (state.currentFile?.id === action.payload.id) {
                state.currentFile = { ...state.currentFile, ...action.payload.data };
              }
            }
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
        setLoading: (state) => {
            state.status = 'loading';
        }
    }
});

// Export actions
export const {
    setFiles,
    setCurrentFile,
    addFile,
    removeFile,
    editFile,
    setError,
    setLoading
} = fileSlice.actions;

// Thunk actions
export const fetchFiles = ({ userId }) => async (dispatch) => {
    try {
        dispatch(setLoading());
        const filesData = await getFiles(userId);
        dispatch(setFiles(filesData));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const fetchFile = ({ userId, fileId }) => async (dispatch) => {
    try {
        dispatch(setLoading());
        const fileData = await getFile(userId, fileId);
        if (fileData) {
            dispatch(setCurrentFile({ id: fileId, ...fileData }));
        }
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const createFile = ({ userId, fileName, content = '' }) => async (dispatch) => {
    try {
        const fileId = Date.now().toString();
        const fileData = {
            name: fileName,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await saveFile(userId, fileId, fileData);
        dispatch(addFile({ id: fileId, ...fileData }));
        return fileId;
    } catch (error) {
        dispatch(setError(error.message));
        return null;
    }
};

export const updateFileContent = ({ userId, fileId, data }) => async (dispatch) => {
    try {
        await updateFile(userId, fileId, data);
        dispatch(editFile({ id: fileId, data }));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const deleteFileById = ({ userId, fileId }) => async (dispatch) => {
    try {
        await deleteFile(userId, fileId);
        dispatch(removeFile(fileId));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export default fileSlice.reducer;