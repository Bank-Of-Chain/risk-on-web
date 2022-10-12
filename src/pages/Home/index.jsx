import React, { useEffect, useState } from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Card, List } from 'antd'

import styles from './style.module.css'

const logoWETH = 'https://bankofchain.io/images/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png'

const Home = () => {
  const [personalVault, setPersonalVault] = useState([])

  useEffect(() => {
    setPersonalVault(['Racing car sd.', 'Japanese prinner.', 'Australian walcrash.', 'Man charged ogirl.', 'Los Angeles bfires.'])
  }, [])

  return (
    <Row>
      <Col span={12} push={6}>
        <Card bordered={false}>
          <Row>
            <Col span={24}>
              <List
                header={<div>Personal Vaults</div>}
                footer={
                  <div>
                    <Button type="primary">
                      <Link to="/add">Add new Vault</Link>
                    </Button>
                  </div>
                }
                bordered
                dataSource={personalVault}
                renderItem={(item, index) => (
                  <List.Item actions={[<Link to={`/deposit/${index}`}>Deposit</Link>, <Link to={`/analysis/${index}`}>Analysis</Link>]}>
                    <List.Item.Meta avatar={<img className={styles.logo} src={logoWETH} alt="" />} title={<span>{item}</span>} description={null} />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Home
