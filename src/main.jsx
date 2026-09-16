import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import '@/shared/utils/console-suppress'
import '@/infrastructure/api/openapi-init'
import { store } from '@store/index'
import App from '@/App'
import UpdatePrompt from '@/app/components/UpdatePrompt'
import './index.css'
import './styles/ux-hardening.css'
import './styles/settings-light.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        {import.meta.env.PROD && <UpdatePrompt />}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
