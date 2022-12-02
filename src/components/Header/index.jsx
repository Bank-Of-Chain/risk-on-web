import React, { useEffect } from 'react'

// === Components === //
import { Button, Row, Col, Dropdown, Space } from '@douyinfe/semi-ui'

// === Hooks === //
import { useSelector } from 'react-redux'
import useWallet from '@/hooks/useWallet'

// === Utils === //
import isEmpty from 'lodash/isEmpty'

const KEY = 'theme-mode'
const currentTheme = window.localStorage.getItem(KEY)

const Header = () => {
  const { disconnect, connect } = useWallet()
  const provider = useSelector(state => state.walletReducer.provider)

  const menu = (
    <Dropdown
      render={
        <Dropdown.Menu>
          <Dropdown.Item onClick={disconnect}>Disconnect</Dropdown.Item>
        </Dropdown.Menu>
      }
    >
      <Button theme="solid" type="primary" style={{ marginRight: 8 }}>
        {provider?.selectedAddress}
      </Button>
    </Dropdown>
  )

  useEffect(() => {
    if (currentTheme === 'light-theme') {
      document.getElementsByTagName('body')[0].className = 'light-theme'
    }
  }, [])

  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Space>
          {!isEmpty(provider?.selectedAddress) ? (
            menu
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
