import React, { useCallback, useEffect, useState } from 'react'

// === Components === //
import ReactECharts from 'echarts-for-react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Row, Col, Card, Tooltip, Spin, Button } from 'antd'

// === Hooks === //
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import useDashboard from '@/hooks/useDashboard'

// === Constants === //
import { IERC20_ABI, IUNISWAPV3_RISK_ON_VAULT, VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, IUNISWAPV3_RISK_ON_HELPER } from '@/constants'

// === Utils === //
import { Contract, BigNumber } from 'ethers'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import { toFixed } from '@/helpers/number-format'

// === Styles === //
import styles from './style.module.css'

const Analysis = () => {
  const params = useParams()
  const { personalVaultId } = params

  const navigate = useNavigate()
  const { data: dataArray, loading: dataLoading } = useDashboard(personalVaultId)
  const userProvider = useSelector(state => state.walletReducer.userProvider)
  const provider = useSelector(state => state.walletReducer.provider)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  console.log('dataArray=', dataArray)
  const userAddress = provider?.selectedAddress

  const load = useCallback(() => {
    if (isEmpty(personalVaultId) || isEmpty(userAddress)) return
    setLoading(true)
    const vaultFactoryContract = new Contract(VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract.uniswapV3RiskOnHelper().then(helperAddress => {
      const contract = new Contract(personalVaultId, IUNISWAPV3_RISK_ON_VAULT, userProvider)
      const helperContract = new Contract(helperAddress, IUNISWAPV3_RISK_ON_HELPER, userProvider)
      return Promise.all([
        contract.borrowToken().then(async i => {
          const tokenContract = new Contract(i, IERC20_ABI, userProvider)
          return { borrowToken: i, name: await tokenContract.symbol(), borrowTokenDecimals: BigNumber.from(10).pow(await tokenContract.decimals()) }
        }),
        contract.wantToken().then(async i => {
          const tokenContract = new Contract(i, IERC20_ABI, userProvider)
          return { wantToken: i, name: await tokenContract.symbol(), wantTokenDecimals: BigNumber.from(10).pow(await tokenContract.decimals()) }
        })
      ])
        .then(([borrowInfo, wantInfo]) => {
          const { borrowToken, borrowTokenDecimals } = borrowInfo
          const { wantToken, wantTokenDecimals } = wantInfo
          return Promise.all([
            contract.netMarketMakingAmount(),
            helperContract.getCurrentBorrow(borrowToken, 2, personalVaultId),
            helperContract.getTotalCollateralTokenAmount(personalVaultId, wantToken),
            contract.depositTo3rdPoolTotalAssets()
          ]).then(([netMarketMakingAmount, currentBorrow, totalCollateralTokenAmount, estimatedTotalAssets]) => {
            return helperContract.calcCanonicalAssetValue(borrowToken, currentBorrow, wantToken).then(currentBorrowWithCanonical => {
              const nextData = {
                netMarketMakingAmount: toFixed(netMarketMakingAmount, wantTokenDecimals),
                currentBorrow: toFixed(currentBorrow, borrowTokenDecimals),
                currentBorrowWithCanonical: toFixed(currentBorrowWithCanonical, wantTokenDecimals),
                estimatedTotalAssets: toFixed(estimatedTotalAssets, wantTokenDecimals),
                totalCollateralTokenAmount: toFixed(totalCollateralTokenAmount, wantTokenDecimals),
                wantInfo,
                borrowInfo,
                result: toFixed(
                  estimatedTotalAssets.add(totalCollateralTokenAmount).sub(netMarketMakingAmount).sub(currentBorrowWithCanonical),
                  wantTokenDecimals
                )
              }
              setData(nextData)
            })
          })
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 300)
        })
    })
  }, [personalVaultId, userProvider, userAddress])

  useEffect(load, [load])

  const {
    netMarketMakingAmount = '0',
    currentBorrow = '0',
    totalCollateralTokenAmount = '0',
    estimatedTotalAssets = '0',
    result = '0',
    currentBorrowWithCanonical = '0',
    wantInfo = {},
    borrowInfo = {}
  } = data

  return (
    <Spin spinning={loading}>
      <Card
        title={
          <Button type="link" onClick={() => navigate(-1)}>
            &lt; Back
          </Button>
        }
      >
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card
              loading={loading}
              title="净做市资金"
              extra={
                <Tooltip title="净做市资金 = 累计投入资金 - 已提取资金（A资产）">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <p>
                {netMarketMakingAmount}&nbsp;
                {wantInfo.name}
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              loading={loading}
              title="AAVE未偿还借贷本息"
              extra={
                <Tooltip title="B资产">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <p>
                {currentBorrow}&nbsp;{borrowInfo.name}({currentBorrowWithCanonical}&nbsp;{wantInfo.name})
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              loading={loading}
              title="AAVE抵押资金"
              extra={
                <Tooltip title="A资产">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <p>
                {totalCollateralTokenAmount}&nbsp;{wantInfo.name}
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              loading={loading}
              title="Uniswap LP Token净值"
              extra={
                <Tooltip title="以A资产计价">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <p>
                {estimatedTotalAssets}&nbsp;{wantInfo.name}
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              loading={loading}
              title="做市利润"
              extra={
                <Tooltip title="(Uniswap LP Token净值 + AAVE抵押资金)-(AAVE未偿还借贷本息 + 净做市资金)">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <p>
                {result}&nbsp;{wantInfo.name}
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              loading={loading}
              title="IRR"
              extra={
                <Tooltip title="">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <p>7.62%</p>
            </Card>
          </Col>
        </Row>
        <Row className={styles.chart}>
          <Col span={24}>
            <Card
              loading={dataLoading}
              title="AAVE Outstanding Loan"
              extra={
                <Tooltip title="AAVE未偿还借贷本息">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <ReactECharts
                option={{
                  grid: { top: 8, right: 8, bottom: 24, left: 60 },
                  xAxis: {
                    type: 'category',
                    data: map(dataArray, 'date'),
                    axisTick: { alignWithLabel: true }
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [
                    {
                      data: map(dataArray, i => toFixed(i.netMarketMakingAmount, borrowInfo?.borrowTokenDecimals)),
                      type: 'line',
                      smooth: true
                    }
                  ],
                  tooltip: {
                    trigger: 'axis'
                  }
                }}
              />
            </Card>
          </Col>
        </Row>
        <Row className={styles.chart}>
          <Col span={24}>
            <Card
              loading={dataLoading}
              title="Collateral"
              extra={
                <Tooltip title="AAVE抵押价值">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <ReactECharts
                option={{
                  grid: { top: 8, right: 8, bottom: 24, left: 60 },
                  xAxis: {
                    type: 'category',
                    data: map(dataArray, 'date'),
                    axisTick: { alignWithLabel: true }
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [
                    {
                      data: map(dataArray, i => toFixed(i.currentBorrow, wantInfo?.wantTokenDecimals)),
                      type: 'line',
                      smooth: true
                    }
                  ],
                  tooltip: {
                    trigger: 'axis'
                  }
                }}
              />
            </Card>
          </Col>
        </Row>
        <Row className={styles.chart}>
          <Col span={24}>
            <Card
              loading={dataLoading}
              title="Health Ratio"
              extra={
                <Tooltip title="Outstanding Loan/Collateral">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <ReactECharts
                option={{
                  grid: { top: 8, right: 8, bottom: 24, left: 60 },
                  xAxis: {
                    type: 'category',
                    data: map(dataArray, 'date'),
                    axisTick: { alignWithLabel: true }
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [
                    {
                      data: map(dataArray, i => {
                        if (i?.currentBorrow?.toString() === '0') return 0
                        return toFixed(i?.netMarketMakingAmount?.div(i.currentBorrow), borrowInfo?.borrowTokenDecimals)
                      }),
                      type: 'line',
                      smooth: true
                    }
                  ],
                  tooltip: {
                    trigger: 'axis'
                  }
                }}
              />
            </Card>
          </Col>
        </Row>
        <Row className={styles.chart}>
          <Col span={24}>
            <Card
              loading={dataLoading}
              title="Uniswap Position Value"
              extra={
                <Tooltip title="Uniswap LP Token净值">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <ReactECharts
                option={{
                  grid: { top: 8, right: 8, bottom: 24, left: 60 },
                  xAxis: {
                    type: 'category',
                    data: map(dataArray, 'date'),
                    axisTick: { alignWithLabel: true }
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [
                    {
                      data: map(dataArray, i => toFixed(i.depositTo3rdPoolTotalAssets, wantInfo?.wantTokenDecimals)),
                      type: 'line',
                      smooth: true
                    }
                  ],
                  tooltip: {
                    trigger: 'axis'
                  }
                }}
              />
            </Card>
          </Col>
        </Row>
        <Row className={styles.chart}>
          <Col span={24}>
            <Card
              loading={dataLoading}
              title="Unrealized Profit"
              extra={
                <Tooltip title="Uniswap Position Value+AAVE Collateral-Net Deposit-AAVE Outstanding Loan">
                  <InfoCircleOutlined />
                </Tooltip>
              }
            >
              <ReactECharts
                option={{
                  grid: { top: 8, right: 8, bottom: 24, left: 60 },
                  xAxis: {
                    type: 'category',
                    data: map(dataArray, 'date'),
                    axisTick: { alignWithLabel: true }
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [
                    {
                      data: map(dataArray, i => toFixed(i.estimatedTotalAssets, borrowInfo?.borrowTokenDecimals)),
                      type: 'line',
                      smooth: true
                    }
                  ],
                  tooltip: {
                    trigger: 'axis'
                  }
                }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default Analysis
