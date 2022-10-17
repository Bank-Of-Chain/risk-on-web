import React, { useState } from 'react'

// === Hooks === //
import { useNavigate } from 'react-router-dom'

// === Components === //
import { Row, Col, Tabs, Card, Button } from 'antd'
import DepositCard from './Deposit/index'
import WithdrawCard from './Withdraw/index'

const Deposit = () => {
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState('1')

  return (
    <Row>
      <Col span={20} push={2}>
        <Card
          title={
            <Button type="link" onClick={() => navigate(-1)}>
              &lt; Back
            </Button>
          }
        >
          <Row>
            <Col span={16} push={4}>
              <Tabs
                centered
                size="large"
                activeKey={activeKey}
                items={[
                  { label: 'Deposit', key: '1' },
                  { label: 'Withdraw', key: '2' }
                ]}
                onTabClick={setActiveKey}
              />
            </Col>
          </Row>
          <Row>
            <Col span={16} push={4}>
              {activeKey === '1' && <DepositCard />}
              {activeKey === '2' && <WithdrawCard />}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Deposit
