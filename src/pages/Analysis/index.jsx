import React, { useCallback, useEffect, useState } from 'react'

// === Components === //
import ReactECharts from 'echarts-for-react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Row, Col, Card, Tooltip, Spin } from 'antd'

// === Hooks === //
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

// === Constants === //
import { IUNISWAPV3_RISK_ON_VAULT, VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, IUNISWAPV3_RISK_ON_HELPER } from '@/constants'
import { USDC_ADDRESS } from '@/constants/tokens'

// === Utils === //
import { Contract, BigNumber } from 'ethers'
import isEmpty from 'lodash/isEmpty'

// === Styles === //
import styles from './style.module.css'

const Analysis = () => {
  const params = useParams()
  const userProvider = useSelector(state => state.walletReducer.userProvider)
  const provider = useSelector(state => state.walletReducer.provider)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  console.log('params=', params, data)
  const { personalVaultId } = params

  const load = useCallback(() => {
    if (isEmpty(personalVaultId)) return
    setLoading(true)
    const vaultFactoryContract = new Contract(VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract.uniswapV3RiskOnHelper().then(helperAddress => {
      const contract = new Contract(personalVaultId, IUNISWAPV3_RISK_ON_VAULT, userProvider)
      const helperContract = new Contract(helperAddress, IUNISWAPV3_RISK_ON_HELPER, userProvider)
      Promise.all([
        contract.netMarketMakingAmount(),
        contract.estimatedTotalAssets(),
        helperContract.getCurrentBorrow(USDC_ADDRESS, personalVaultId, provider.selectedAddress),
        helperContract.borrowInfo(personalVaultId)
      ])
        .then(
          ([
            netMarketMakingAmount,
            estimatedTotalAssets,
            getCurrentBorrow,
            { _availableBorrowsETH, _currentLiquidationThreshold, _healthFactor, _ltv, _totalCollateralETH, _totalDebtETH },
            ...aa
          ]) => {
            console.log('aa=', aa)
            const nextData = {
              netMarketMakingAmount,
              getCurrentBorrow,
              estimatedTotalAssets,
              _availableBorrowsETH,
              _currentLiquidationThreshold,
              _healthFactor,
              _ltv,
              _totalCollateralETH,
              _totalDebtETH
            }
            setData(nextData)
          }
        )
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 300)
        })
    })
  }, [personalVaultId, userProvider, provider])

  useEffect(load, [load])

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

  const {
    netMarketMakingAmount = BigNumber.from(0),
    getCurrentBorrow = BigNumber.from(0),
    _totalCollateralETH = BigNumber.from(0),
    estimatedTotalAssets = BigNumber.from(0)
  } = data

  return (
    <Spin spinning={loading}>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card
            title="净做市资金"
            extra={
              <Tooltip title="净做市资金 = 累计投入资金 - 已提取资金（A资产）">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <p>{netMarketMakingAmount.toString()}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="AAVE未偿还借贷本息"
            extra={
              <Tooltip title="B资产">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <p>{getCurrentBorrow.toString()}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="AAVE抵押资金"
            extra={
              <Tooltip title="A资产">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <p>{_totalCollateralETH.toString()}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Uniswap LP Token净值"
            extra={
              <Tooltip title="以A资产计价">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <p>{estimatedTotalAssets.toString()}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="做市利润"
            extra={
              <Tooltip title="(Uniswap LP Token净值 + AAVE抵押资金)-(AAVE未偿还借贷本息 + 净做市资金)">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <p>{estimatedTotalAssets.add(_totalCollateralETH).sub(netMarketMakingAmount).sub(getCurrentBorrow).toString()}</p>
          </Card>
        </Col>
      </Row>
      <Row className={styles.chart}>
        <Col span={24}>{element}</Col>
      </Row>
    </Spin>
  )
}

export default Analysis
