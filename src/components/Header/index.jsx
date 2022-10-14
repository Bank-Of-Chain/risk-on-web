import React, { useEffect, useState } from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Menu, Dropdown, Switch, Space } from 'antd'
import { UserOutlined, LoginOutlined } from '@ant-design/icons'

// === Hooks === //
import { useSelector } from 'react-redux'
import useWallet from '@/hooks/useWallet'

// === Utils === //
import isEmpty from 'lodash/isEmpty'

import styles from './style.module.css'

const KEY = 'theme-mode'
const currentTheme = window.localStorage.getItem(KEY)

const SUN = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
)
const MOON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
)

const Header = () => {
  const { disconnect, connect } = useWallet()
  const provider = useSelector(state => state.walletReducer.provider)
  const [isDark, setIsDark] = useState(currentTheme ? currentTheme === 'dark-theme' : true)

  const onChange = value => {
    setIsDark(value)
    const theme = value ? 'dark-theme' : 'light-theme'
    document.getElementsByTagName('body')[0].className = theme
    window.localStorage.setItem(KEY, theme)
  }

  const menu = (
    <Menu
      onClick={disconnect}
      items={[
        {
          label: 'Disconnect',
          key: '1',
          icon: <LoginOutlined />
        }
      ]}
    />
  )

  useEffect(() => {
    if (currentTheme === 'light-theme') {
      document.getElementsByTagName('body')[0].className = 'light-theme'
    }
  }, [])

  return (
    <Row>
      <Col span={12}>
        <Link to="/">
          <img className={styles.logo} src="https://bankofchain.io/logo.svg" alt="" />
        </Link>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <Space>
          <Switch checked={isDark} checkedChildren={MOON} unCheckedChildren={SUN} onChange={onChange} />
          {!isEmpty(provider?.selectedAddress) ? (
            <Dropdown.Button overlay={menu} placement="bottomRight" icon={<UserOutlined />}>
              {provider?.selectedAddress}
            </Dropdown.Button>
          ) : (
            <Button type="primary" onClick={() => connect()}>
              Connect
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  )
}

export default Header
