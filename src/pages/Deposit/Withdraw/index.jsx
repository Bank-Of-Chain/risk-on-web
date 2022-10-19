import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'

// === Components === //
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Row, Col, Slider, Radio, message } from 'antd'
import { ethers } from 'ethers'
import BN from 'bignumber.js'
import { IERC20_ABI, IUNISWAPV3_RISK_ON_VAULT } from '@/constants'
import DECIMAL from '@/constants/decimal'
import { toFixed } from '@/helpers/number-format'

const { Contract } = ethers

const formatter = value => `${value}%`

const Withdraw = () => {
  const provider = useSelector(state => state.walletReducer.provider)
  const userAddress = provider?.selectedAddress
  const userProvider = useSelector(state => state.walletReducer.userProvider)
  const { personalVaultId } = useParams()

  const [token, setToken] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [percentage, setPercentage] = useState(0)
  const [radio, setRadio] = useState(0)
  const [estimatedTotalAssets, setEstimatedTotalAssets] = useState('')
  const [estimatedWithdrawAssets, setEstimatedWithdrawAssets] = useState('0')
  const [withdrawing, setWithdrawing] = useState(false)

  const decimal = DECIMAL[token]

  const getEstimate = useCallback(() => {
    if (!userAddress || !token) {
      return
    }
    const contract = new Contract(personalVaultId, IUNISWAPV3_RISK_ON_VAULT, userProvider)
    contract.estimatedTotalAssets().then(response => {
      setEstimatedTotalAssets(response.toString())
    })
  }, [token, userProvider, userAddress, personalVaultId])

  const getTokenName = useCallback(() => {
    if (!userAddress || !token) {
      return
    }
    const contract = new Contract(token, IERC20_ABI, userProvider)
    contract.symbol().then(response => {
      setTokenName(response.toString())
    })
  }, [token, userProvider, userAddress])

  const onPercentageChange = val => {
    setPercentage(val)
    const withdrawAsset = BN(estimatedTotalAssets).times(val / 100)
    setEstimatedWithdrawAssets(withdrawAsset)
  }

  const onRadioChange = val => {
    setRadio(val)
    setPercentage(val)
    const withdrawAsset = BN(estimatedTotalAssets).times(val / 100)
    setEstimatedWithdrawAssets(withdrawAsset.toString())
  }

  const withdraw = async () => {
    setWithdrawing(true)
    try {
      const signer = userProvider.getSigner()
      const contract = new Contract(personalVaultId, IUNISWAPV3_RISK_ON_VAULT, userProvider)
      const contractWithUser = contract.connect(signer)
      const tx = await contractWithUser.redeem(percentage, 100)
      const { events } = await tx.wait()
      let args = []
      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].event === 'Redeem') {
          args = events[i].args
          break
        }
      }
      const { _redeemAmount } = args
      message.success(`Withdraw ${toFixed(_redeemAmount, decimal)} ${tokenName}`)
      getEstimate()
      setPercentage(0)
      setEstimatedWithdrawAssets('0')
    } catch (error) {
      console.log('error', error)
      message.error('Withdraw failed')
    }
    setWithdrawing(false)
  }

  useEffect(() => {
    const contract = new Contract(personalVaultId, IUNISWAPV3_RISK_ON_VAULT, userProvider)
    contract.getStatus().then(info => {
      const { _wantToken } = info
      setToken(_wantToken)
    })
  }, [personalVaultId, userProvider])

  useEffect(() => {
    getEstimate()
    getTokenName()
  }, [getEstimate, getTokenName])

  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          Balance: {toFixed(estimatedTotalAssets, decimal)} {tokenName}
        </Col>
        <Col span={24}>
          <Slider
            tooltip={{
              formatter
            }}
            value={percentage}
            onChange={onPercentageChange}
          />
        </Col>
        <Col span={24}>
          <Radio.Group onChange={e => onRadioChange(e.target.value)} value={radio}>
            <Radio value={0}>0%</Radio>
            <Radio value={25}>25%</Radio>
            <Radio value={50}>50%</Radio>
            <Radio value={75}>75%</Radio>
            <Radio value={100}>100%</Radio>
          </Radio.Group>
        </Col>
        <Col span={24}>
          Estimate: {toFixed(estimatedWithdrawAssets, decimal)} {tokenName}
        </Col>
        <Col span={24}>
          <Button block type="primary" disabled={percentage <= 0} loading={withdrawing} onClick={withdraw}>
            Withdraw
          </Button>
        </Col>
        <Col span={24}>
          <Button block type="primary" danger>
            <Link to="/">Cancel</Link>
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default Withdraw
