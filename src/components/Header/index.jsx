import React, { useEffect, useState } from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Menu, Dropdown, Switch } from 'antd'
import { UserOutlined, LoginOutlined } from '@ant-design/icons'

// === Hooks === //
import { useSelector } from 'react-redux'
import useWallet from '@/hooks/useWallet'

// === Utils === //
import isEmpty from 'lodash/isEmpty'

import styles from './style.module.css'

const KEY = 'theme-mode'
const currentTheme = window.localStorage.getItem(KEY)

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
        <Switch checked={isDark} checkedChildren="dark" unCheckedChildren="light" onChange={onChange} />
        {!isEmpty(provider?.selectedAddress) ? (
          <Dropdown.Button overlay={menu} placement="bottomRight" icon={<UserOutlined />}>
            {provider?.selectedAddress}
          </Dropdown.Button>
        ) : (
          <Button type="primary" onClick={() => connect()}>
            Connect
          </Button>
        )}
      </Col>
    </Row>
  )
}

export default Header
