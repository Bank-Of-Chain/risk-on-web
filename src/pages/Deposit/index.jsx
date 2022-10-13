import React, { useState } from 'react'

// === Components === //
import { Row, Col, Tabs } from 'antd'
import DepositCard from './Deposit/index'
import WithdrawCard from './Withdraw/index'
import styles from './style.module.css'

const Deposit = () => {
  const [activeKey, setActiveKey] = useState('1')

  return (
    <Row>
      <Col span={12} push={6} className={styles.wrapper}>
        <Row>
          <Col span={24}>
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
        {activeKey === '1' && <DepositCard />}
        {activeKey === '2' && <WithdrawCard />}
      </Col>
    </Row>
  )
}

export default Deposit
