import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FileUploadProvider } from "./context/FileUploadContext";


createRoot(document.getElementById('root')).render(
  <FileUploadProvider>
    <App />
  </FileUploadProvider>
)
