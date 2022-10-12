import React, { useEffect, useState } from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Typography, Card, List } from 'antd'

const Home = () => {
  const [personalVault, setPersonalVault] = useState([])

  useEffect(() => {
    setPersonalVault(['Racing car sd.', 'Japanese prinner.', 'Australian walcrash.', 'Man charged ogirl.', 'Los Angeles bfires.'])
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
                      <Button type="link" key="deposit">
                        <Link to={`/deposit/${index}`}>Deposit</Link>
                      </Button>,
                      <Button type="link" key="analysis">
                        <Link to={`/analysis/${index}`}>Analysis</Link>
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
