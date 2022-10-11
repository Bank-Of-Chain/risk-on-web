import React from 'react'

// === Components === //
import ReactECharts from 'echarts-for-react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Row, Col, Card } from 'antd'

const Analysis = () => {
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
    <Row>
      <Col span={12}>{element}</Col>
      <Col span={12}>{element}</Col>
      <Col span={12}>{element}</Col>
      <Col span={12}>{element}</Col>
    </Row>
  )
}

export default Analysis
