import React, { useCallback, useEffect, useState } from 'react'

// === Components === //
import ReactECharts from 'echarts-for-react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Row, Col, Card, Tooltip, Spin, Button } from 'antd'

// === Hooks === //
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

// === Constants === //
import { IERC20_ABI, IUNISWAPV3_RISK_ON_VAULT, VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, IUNISWAPV3_RISK_ON_HELPER } from '@/constants'

// === Utils === //
import { Contract, BigNumber } from 'ethers'
import isEmpty from 'lodash/isEmpty'
import { toFixed } from '@/helpers/number-format'

// === Styles === //
import styles from './style.module.css'

const Analysis = () => {
  const params = useParams()
  const navigate = useNavigate()
  const userProvider = useSelector(state => state.walletReducer.userProvider)
  const provider = useSelector(state => state.walletReducer.provider)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  const { personalVaultId } = params
  const userAddress = provider?.selectedAddress

  console.log('data===>', data)

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

  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: { alignWithLabel: true }
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
        </Row>
        <Row className={styles.chart}>
          <Col span={24}>
            <Card title="IRR" extra={<InfoCircleOutlined />}>
              <ReactECharts option={options} />
            </Card>
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default Analysis
