import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { StateContextProvider } from './context/index.jsx'

createRoot(document.getElementById('root')).render(
    <StateContextProvider>
        <Router>
            <App />
        </Router>
    </StateContextProvider>
)
