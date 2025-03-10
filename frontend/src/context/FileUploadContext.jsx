import { createContext, useState } from "react";


export const FileUploadContext = createContext();


export const FileUploadProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [engravings, setEngravings] = useState([]);

  return (
    <FileUploadContext.Provider 
      value={{ files, setFiles, engravings, setEngravings }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};
