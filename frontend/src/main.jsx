import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FileUploadProvider } from "./context/FileUploadContext";
import { store } from './redux/store/Store.jsx'
import { Provider } from 'react-redux'


createRoot(document.getElementById('root')).render(
  <Provider store={store} >

    <FileUploadProvider>
      <App />
    </FileUploadProvider>
  </Provider>
)
