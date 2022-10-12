import React, { useEffect, lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'

// === Components === //
import { Layout } from 'antd'
import HeaderComponent from '@/components/Header'
import FooterComponent from '@/components/Footer'

// === Hooks === //
import useWallet from '@/hooks/useWallet'

// === Utils === //
import { isInMobileWalletApp, isInMobileH5 } from '@/helpers/plugin-util'

// === Styles === //
import './App.css'

const { Header, Footer, Content } = Layout

// === Pages === //
const Home = lazy(() => import('./pages/Home/index'))
const Add = lazy(() => import('./pages/Add/index'))
const Deposit = lazy(() => import('./pages/Deposit/index'))
const Analysis = lazy(() => import('./pages/Analysis/index'))

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
      <Layout>
        <Header>
          <HeaderComponent />
        </Header>
        <Content>
          <Routes>
            <Route
              index
              element={
                <Suspense>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense>
                  <Add />
                </Suspense>
              }
            />
            <Route
              path="deposit/:vaultId"
              element={
                <Suspense>
                  <Deposit />
                </Suspense>
              }
            />
            <Route
              path="analysis"
              element={
                <Suspense>
                  <Analysis />
                </Suspense>
              }
            />
          </Routes>
        </Content>
        <Footer>
          <FooterComponent />
        </Footer>
      </Layout>
    </HashRouter>
  )
}

export default App
