import React, { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// === Components === //
import HeaderComponent from '@/components/Header'
import FooterComponent from '@/components/Footer'
import { Layout, Nav, Breadcrumb } from '@douyinfe/semi-ui'
import { IconHome, IconSetting } from '@douyinfe/semi-icons'

// === Hooks === //
import useWallet from '@/hooks/useWallet'

// === Utils === //
import { isInMobileWalletApp, isInMobileH5 } from '@/helpers/plugin-util'

// === Styles === //
import './theme/dark.css'
import './theme/light.css'
import './App.css'

// === Pages === //
const Home = lazy(() => import('./pages/Home'))
const Setting = lazy(() => import('./pages/Setting'))

const { Header, Footer, Sider, Content } = Layout

function App() {
  const { web3Modal, connect, getWalletName } = useWallet()

  const walletName = getWalletName()

  useEffect(() => {
    if (web3Modal.cachedProvider && !isInMobileWalletApp() && !isInMobileH5()) {
      connect()
    }
  }, [connect, web3Modal.cachedProvider, walletName])

  const navigate = useNavigate()
  return (
    <Layout style={{ border: '1px solid var(--semi-color-border)', height: '100%' }}>
      <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <Nav
          defaultSelectedKeys={['Home']}
          style={{ maxWidth: 220, height: '100%' }}
          items={[
            { itemKey: '', text: '首页', icon: <IconHome size="large" /> },
            { itemKey: 'setting', text: '设置', icon: <IconSetting size="large" /> }
          ]}
          header={{
            logo: <img alt="" src="https://bankofchain.io/logo.png" />,
            text: 'Bank Of Chain'
          }}
          onClick={data => {
            console.log('trigger onClick: ', data)
            navigate(data.itemKey)
          }}
          footer={{
            collapseButton: true
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
          <HeaderComponent />
        </Header>
        <Content
          style={{
            padding: '24px',
            backgroundColor: 'var(--semi-color-bg-0)'
          }}
        >
          <Breadcrumb
            style={{
              marginBottom: '24px'
            }}
            routes={['首页', '当这个页面标题很长时需要省略', '上一页', '详情页']}
          />
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
              path="home"
              element={
                <Suspense>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="setting"
              element={
                <Suspense>
                  <Setting />
                </Suspense>
              }
            />
          </Routes>
        </Content>
        <Footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
            color: 'var(--semi-color-text-2)',
            backgroundColor: 'rgba(var(--semi-grey-0), 1)'
          }}
        >
          <FooterComponent />
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App
