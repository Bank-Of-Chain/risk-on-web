import React from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Card, List, Space, Spin } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import styles from './style.module.css'

// === Hooks === //
import useRiskOnVault from '@/hooks/useRiskOnVault'
import usePersonalVault from '@/hooks/usePersonalVault'

// === Constants === //
import { VAULT_FACTORY_ADDRESS } from '@/constants'

const Home = () => {
  const { vaultImplList } = useRiskOnVault(VAULT_FACTORY_ADDRESS)
  const { data, loading } = usePersonalVault(vaultImplList)

  const copyAddress = text => {
    //TODO:
  }

  return (
    <Row>
      <Col span={20} push={2}>
        <Card bordered={false}>
          <Row>
            <Col span={24}>
              <Spin spinning={loading}>
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
                  dataSource={data}
                  renderItem={(item, index) => {
                    const { address, name, token } = item
                    return (
                      <List.Item actions={[<Link to={`/deposit/${index}`}>Deposit</Link>, <Link to={`/analysis/${index}`}>Analysis</Link>]}>
                        <List.Item.Meta
                          avatar={<img className={styles.logo} src={`https://bankofchain.io/images/${token}.png`} alt="" />}
                          title={<span>{name}</span>}
                          description={
                            <Space>
                              Address: {address}
                              <CopyOutlined style={{ cursor: 'pointer' }} onClick={() => copyAddress(address)} />
                            </Space>
                          }
                        />
                      </List.Item>
                    )
                  }}
                />
              </Spin>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Home
