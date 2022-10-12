import React, { useEffect, useState } from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Typography, Card, List } from 'antd'

const Home = () => {
  const [personalVault, setPersonalVault] = useState([])

  useEffect(() => {
    setPersonalVault([
      'Racing car sprays burning fuel into crowd.',
      'Japanese princess to wed commoner.',
      'Australian walks 100km after outback crash.',
      'Man charged over missing wedding girl.',
      'Los Angeles battles huge wildfires.'
    ])
  }, [])

  return (
    <Row>
      <Col span={12} push={6}>
        <Card>
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
                  <List.Item
                    actions={[
                      <Button type="link">
                        <Link to={`/deposit/${index}`}>Deposit-{index}</Link>
                      </Button>
                    ]}
                  >
                    <Typography.Text mark>[USDC]</Typography.Text> {item}
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
