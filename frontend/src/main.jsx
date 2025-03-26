import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FileUploadProvider } from "./context/FileUploadContext";
import { store } from './redux/store/Store.jsx'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store} >

      <FileUploadProvider>
        <App />
      </FileUploadProvider>
    </Provider>
  </GoogleOAuthProvider>
)
