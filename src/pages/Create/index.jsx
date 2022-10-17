import React from 'react'

// === Components === //
import { Link } from 'react-router-dom'
import { Button, Row, Col, Card, Spin, Avatar, Descriptions } from 'antd'
import { VerticalAlignBottomOutlined, LineChartOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons'

// === Hooks === //
import { useParams } from 'react-router-dom'
import useRiskOnVault from '@/hooks/useRiskOnVault'
import usePersonalVault from '@/hooks/usePersonalVault'

// === Utils === //
import map from 'lodash/map'
import merge from 'lodash/merge'

// === Constants === //
import { VAULT_FACTORY_ADDRESS } from '@/constants'

const { Meta } = Card

const Create = () => {
  const params = useParams()
  const { personalVault, addVault, deleteVault } = useRiskOnVault(VAULT_FACTORY_ADDRESS, params.templateVaultId)
  const { data, loading } = usePersonalVault(map(personalVault, 'address'))
  const datas = merge(personalVault, data)
  console.log('params=', personalVault, data, datas)

  return (
    <Row>
      <Col span={20} push={2}>
        <Card
          title={
            <Link to={'/'}>
              <div style={{ cursor: 'pointer' }}>&lt; Back</div>
            </Link>
          }
        >
          <Spin spinning={loading}>
            <Row gutter={[24, 24]}>
              {map(datas, (item, i) => {
                const { name, token, address, hasCreate } = item
                return (
                  <Col span={12} key={i}>
                    <Card
                      style={{ width: '100%' }}
                      cover={<img alt="example" src={`https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png`} />}
                      actions={
                        hasCreate
                          ? [
                              <Link to={`/deposit/${address}`} key="deposit">
                                <Button type="primary" icon={<VerticalAlignBottomOutlined />}>
                                  Deposit
                                </Button>
                              </Link>,
                              <Link to={`/analysis/${address}`} key="analysis">
                                <Button type="primary" icon={<LineChartOutlined />}>
                                  Analysis
                                </Button>
                              </Link>,
                              <Button type="primary" icon={<DeleteOutlined />} key="delete" onClick={deleteVault}>
                                delete
                              </Button>
                            ]
                          : [
                              <Button type="primary" icon={<CopyOutlined />} onClick={addVault} key="create">
                                Create
                              </Button>
                            ]
                      }
                    >
                      <Meta
                        avatar={<Avatar src={`https://bankofchain.io/images/${token}.png`} />}
                        title={hasCreate ? name : <span>null</span>}
                        description={
                          <Descriptions column={1}>
                            <Descriptions.Item label="Address">{hasCreate ? address : <span>null</span>}</Descriptions.Item>
                          </Descriptions>
                        }
                      />
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </Spin>
        </Card>
      </Col>
    </Row>
  )
}

export default Create
