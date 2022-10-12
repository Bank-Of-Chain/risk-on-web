import React from 'react'

// === Components === //
import ReactECharts from 'echarts-for-react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Row, Col, Card } from 'antd'

// === Hooks === //
import { useParams } from 'react-router-dom'

import styles from './style.module.css'

const Analysis = () => {
  const params = useParams()
  console.log('params=', params)
  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      }
    ],
    tooltip: {
      trigger: 'axis'
    }
  }
  const element = (
    <Card title="Default size card" extra={<InfoCircleOutlined />}>
      <ReactECharts option={options} />
    </Card>
  )
  return (
    <>
      <Row gutter={12}>
        <Col span={6}>
          <Card title="Default size card" extra={<InfoCircleOutlined />}>
            <p>Content</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Default size card" extra={<InfoCircleOutlined />}>
            <p>Content</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Default size card" extra={<InfoCircleOutlined />}>
            <p>Content</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Default size card" extra={<InfoCircleOutlined />}>
            <p>Content</p>
          </Card>
        </Col>
      </Row>
      <Row className={styles.chart}>
        <Col span={24}>{element}</Col>
      </Row>
    </>
  )
}

export default Analysis
