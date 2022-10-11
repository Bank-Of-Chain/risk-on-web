import React from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Menu, Dropdown } from 'antd'
import { UserOutlined, LoginOutlined } from '@ant-design/icons'

// === Hooks === //
import { useSelector } from 'react-redux'
import useWallet from '@/hooks/useWallet'

// === Utils === //
import isEmpty from 'lodash/isEmpty'

const Header = () => {
  const { disconnect, connect } = useWallet()
  const provider = useSelector(state => state.walletReducer.provider)

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
  return (
    <Row>
      <Col span={12}>
        <Link to="/">
          <img src="https://bankofchain.io/logo.svg" alt="" style={{ width: '173px', height: '27px' }} />
        </Link>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
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
