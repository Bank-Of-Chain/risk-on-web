import React, { useState } from 'react'

// === Components === //
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Row, Col, Input } from 'antd'

const Deposit = () => {
  const [isDeposit, setIsDeposit] = useState(true)
  const params = useParams()
  console.log('params=', params)
  return (
    <Row>
      <Col span={24}>
        <Button onClick={() => setIsDeposit(!isDeposit)}>isDeposit={`${isDeposit}`}</Button>
      </Col>
      <Col span={12} push={6}>
        <Card title="Deposit">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Input />
            </Col>
            <Col span={24}>
              <Input />
            </Col>
            <Col span={24}>
              <Input />
            </Col>
            <Col span={24}>
              <Input />
            </Col>
            <Col span={24}>
              <Button block type="primary">
                Deposit
              </Button>
            </Col>
            <Col span={24}>
              <Button block type="primary" danger>
                <Link to="/">Cancel</Link>
              </Button>
            </Col>
          </Row>
        </Card>
        <Card title="Withdraw">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Input />
            </Col>
            <Col span={24}>
              <Input />
            </Col>
            <Col span={24}>
              <Input />
            </Col>
            <Col span={24}>
              <Input />
            </Col>
            <Col span={24}>
              <Button block type="primary">
                Withdraw
              </Button>
            </Col>
            <Col span={24}>
              <Button block type="primary" danger>
                <Link to="/">Cancel</Link>
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Deposit
