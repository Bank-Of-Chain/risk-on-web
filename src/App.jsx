import React, { useEffect, lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'

// === Hooks === //
import useWallet from '@/hooks/useWallet'

// === Utils === //
import { isInMobileWalletApp, isInMobileH5 } from '@/helpers/plugin-util'

// === Styles === //
import './theme/dark.css'
import './theme/light.css'
import './App.css'

// === Pages === //
const Components = lazy(() => import('./pages/components'))

function App() {
  const { web3Modal, connect, getWalletName } = useWallet()

  const walletName = getWalletName()

  useEffect(() => {
    if (web3Modal.cachedProvider && !isInMobileWalletApp() && !isInMobileH5()) {
      connect()
    }
  }, [connect, web3Modal.cachedProvider, walletName])

  return (
    <HashRouter>
      <Routes>
        <Route
          index
          element={
            <Suspense>
              <Components />
            </Suspense>
          }
        />
        <Route
          path="component"
          element={
            <Suspense>
              <Components />
            </Suspense>
          }
        />
      </Routes>
    </HashRouter>
  )
}

export default App
