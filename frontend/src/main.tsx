import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId="980377395210-85l65e0p2e5ijmq8vsgpq50r1qtbmptf.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
)
