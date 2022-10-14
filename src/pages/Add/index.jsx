import React from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Card, Descriptions, Tag } from 'antd'

// === Hooks === //
import { useSelector } from 'react-redux'
import useRiskOnVault from '@/hooks/useRiskOnVault'

// === Constants === //
import { VAULT_FACTORY_ADDRESS } from '@/constants'

// === Utils === //
import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import styles from './style.module.css'

const Add = () => {
  const { typeSelector, tokenSelector, isSupport, reset, addVault, adding } = useRiskOnVault(VAULT_FACTORY_ADDRESS)
  const provider = useSelector(state => state.walletReducer.provider)

  const userAddress = provider?.selectedAddress

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
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Descriptions column={1}>
                <Descriptions.Item label="VaultFactory">{VAULT_FACTORY_ADDRESS}</Descriptions.Item>
                <Descriptions.Item label="Type" className={styles.label}>
                  {typeSelector}
                </Descriptions.Item>
                <Descriptions.Item label="Token" className={styles.label}>
                  {tokenSelector}
                </Descriptions.Item>
                <Descriptions.Item label="Support">
                  {!isUndefined(isSupport) && <Tag color={isSupport ? '#87d068' : '#f50'}>{isSupport.toString()}</Tag>}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={24}>
              <Button block type="primary" onClick={addVault} disabled={!isSupport || isEmpty(userAddress)} loading={adding}>
                Ok
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

export default Add
