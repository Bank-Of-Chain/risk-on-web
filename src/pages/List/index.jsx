import React from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Row, Col, Card, List, Space, Spin } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

// === Hooks === //
import useRiskOnVault from '@/hooks/useRiskOnVault'
import useTemplateVault from '@/hooks/useTemplateVault'

// === Utils === //
import filter from 'lodash/filter'
import size from 'lodash/size'

// === Constants === //
import { VAULT_FACTORY_ADDRESS } from '@/constants'

import styles from './style.module.css'

const ListComponent = () => {
  const { vaultImplList, personalVault } = useRiskOnVault(VAULT_FACTORY_ADDRESS)
  const { data, loading } = useTemplateVault(vaultImplList)

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
                  header={<div>Template List</div>}
                  bordered
                  dataSource={data}
                  renderItem={item => {
                    const { address, name, token } = item
                    return (
                      <List.Item
                        actions={[
                          <Link to={`/create/${address}`}>Create New Vaults&nbsp;({size(filter(personalVault, i => i.type === address))})</Link>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <img
                              alt={token}
                              className={styles.logo}
                              src={`https://bankofchain.io/images/${token}.png`}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null // prevents looping
                                currentTarget.src = 'https://bankofchain.io/default.png'
                              }}
                            />
                          }
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

export default ListComponent
