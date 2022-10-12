import React from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Card, Descriptions, Tag, Space } from 'antd'

// === Hooks === //
import useRiskOnVault from '@/hooks/useRiskOnVault'

// === Constants === //
import { VAULT_ADDRESS } from '@/constants'

const Add = () => {
  const { typeSelector, tokenSelector, isSupport, reset } = useRiskOnVault(VAULT_ADDRESS)
  return (
    <Row>
      <Col span={12} push={6}>
        <Card
          title="Add Personal Vault"
          extra={
            <Button danger size="small" onClick={reset}>
              Reset
            </Button>
          }
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Descriptions column={1}>
                <Descriptions.Item label="Vault">{VAULT_ADDRESS}</Descriptions.Item>
              </Descriptions>
              <Descriptions>
                <Descriptions.Item label="Type">{typeSelector}</Descriptions.Item>
                <Descriptions.Item label="Token">{tokenSelector}</Descriptions.Item>
                <Descriptions.Item label="Support">
                  <Tag color={isSupport ? '#87d068' : '#f50'}>{isSupport.toString()}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={24}>
              <Space>
                <Button block type="primary">
                  Ok
                </Button>
                <Button block type="primary" danger>
                  <Link to="/">Cancel</Link>
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Add
