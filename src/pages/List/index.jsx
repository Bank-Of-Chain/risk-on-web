import React from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Row, Col, Card, List, Space, Spin, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

// === Hooks === //
import useRiskOnVault from '@/hooks/useRiskOnVault'
import useTemplateVault from '@/hooks/useTemplateVault'

// === Utils === //
import filter from 'lodash/filter'
import size from 'lodash/size'
import { map } from 'lodash'
import copy from 'copy-to-clipboard'

// === Constants === //
import { VAULT_FACTORY_ADDRESS } from '@/constants'
import { USDC_ADDRESS, WETH_ADDRESS } from '@/constants/tokens'

import styles from './style.module.css'

const tokens = [USDC_ADDRESS, WETH_ADDRESS]

const ListComponent = () => {
  const { vaultImplList, personalVault } = useRiskOnVault(VAULT_FACTORY_ADDRESS)
  const { data, loading } = useTemplateVault(vaultImplList)

  const copyAddress = text => {
    copy(text)
    message.success('Copied')
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
                    const { address, name } = item
                    return (
                      <List.Item
                        actions={[
                          <Link to={`/create/${address}`}>
                            Create New Vaults&nbsp;({size(filter(personalVault, i => i.type === address && i.hasCreate === true))})
                          </Link>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={map(tokens, (i, index) => (
                            <img
                              key={i}
                              alt={i}
                              className={styles.logo}
                              style={{ marginLeft: `-${index * 20}%` }}
                              src={`https://bankofchain.io/images/${i}.png`}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null // prevents looping
                                currentTarget.src = 'https://bankofchain.io/default.png'
                              }}
                            />
                          ))}
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
