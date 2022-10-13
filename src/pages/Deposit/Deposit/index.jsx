import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// === Components === //
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Row, Col, Input, message } from 'antd'
import { ethers } from 'ethers'
import BN from 'bignumber.js'
import isEmpty from 'lodash/isEmpty'

import { IERC20_ABI, IUNISWAPV3_RISK_ON_VAULT } from '@/constants'
import { WETH_ADDRESS } from '@/constants/tokens'
import DECIMAL from '@/constants/decimal'
import { toFixed } from '@/helpers/number-format'

import styles from './style.module.css'

const getLogo = address => {
  if (!address) {
    return ''
  }
  return `https://bankofchain.io/images/${address}.png`
}

const { Contract, BigNumber } = ethers

const Deposit = () => {
  const provider = useSelector(state => state.walletReducer.provider)
  const userAddress = provider?.selectedAddress
  const userProvider = useSelector(state => state.walletReducer.userProvider)

  const [token, setToken] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [estimatedTotalAssets, setEstimatedTotalAssets] = useState('')
  const [balance, setBalance] = useState('')
  const [allowance, setAllowance] = useState('')
  const [value, setValue] = useState('')
  const [depositing, setDepositing] = useState(false)

  const { personalVaultId } = useParams()

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

  const getBalance = useCallback(() => {
    if (!userAddress || !token) {
      return
    }
    const contract = new Contract(token, IERC20_ABI, userProvider)
    contract.balanceOf(userAddress).then(response => {
      setBalance(response.toString())
    })
    contract.symbol().then(response => {
      setTokenName(response.toString())
    })
  }, [token, userProvider, userAddress])

  const getAllowance = useCallback(() => {
    if (!userAddress || !token) {
      return
    }
    const signer = userProvider.getSigner()
    const tokenContract = new Contract(token, IERC20_ABI, userProvider)
    const tokenContractWithUser = tokenContract.connect(signer)
    tokenContractWithUser.allowance(userAddress, personalVaultId).then(response => {
      setAllowance(response.toString())
    })
  }, [token, userProvider, userAddress, personalVaultId])

  const onValueChange = val => {
    const num = Number(val)
    if (isNaN(num) || num < 0) {
      return
    }
    setValue(val)
  }

  const onMaxClick = () => {
    setValue(toFixed(balance, decimal))
  }

  const deposit = async () => {
    setDepositing(true)
    try {
      const signer = userProvider.getSigner()
      const tokenContract = new Contract(token, IERC20_ABI, userProvider)
      const tokenContractWithUser = tokenContract.connect(signer)
      const nextValue = BigNumber.from(value).mul(decimal.toString())
      const allowanceAmount = await tokenContractWithUser.allowance(userAddress, personalVaultId)
      // If deposit amount greater than allow amount, need approve
      if (nextValue.gt(allowanceAmount)) {
        // If allowance gt 0, increaseAllowance, otherwise approve nextAmount
        if (allowanceAmount.gt(0)) {
          if (token === WETH_ADDRESS) {
            // WETH don't support increaseAllowance
            await tokenContractWithUser.approve(personalVaultId, 0)
            await tokenContractWithUser.approve(personalVaultId, nextValue)
          } else {
            await tokenContractWithUser
              .increaseAllowance(personalVaultId, nextValue.sub(allowanceAmount))
              .then(tx => tx.wait())
              .catch(async e => {
                console.table(e)
                // cancel by user
                if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
                  return Promise.reject(e)
                }
                // If increase failed, approve 0 and approve nextAmounts
                await tokenContractWithUser.approve(personalVaultId, 0)
                await tokenContractWithUser.approve(personalVaultId, nextValue).then(tx => tx.wait())
              })
          }
        } else {
          await tokenContractWithUser.approve(personalVaultId, nextValue)
        }
      }
      const contract = new Contract(personalVaultId, IUNISWAPV3_RISK_ON_VAULT, userProvider)
      const contractWithUser = contract.connect(signer)
      const tx = await contractWithUser.lend(nextValue)
      const result = await tx.wait()
      console.log('result', result)
      message.success('Deposit success')
      getEstimate()
      getBalance()
      setValue('')
    } catch (error) {
      console.log('error', error)
      message.error('Deposit failed')
    }
    setDepositing(false)
  }

  useEffect(() => {
    const contract = new Contract(personalVaultId, IUNISWAPV3_RISK_ON_VAULT, userProvider)
    contract.getStatus().then(info => {
      console.log('Vault info:', info)
      const { _wantToken } = info
      setToken(_wantToken)
    })
  }, [personalVaultId, userProvider])

  useEffect(() => {
    getEstimate()
    getBalance()
    getAllowance()
  }, [getEstimate, getBalance, getAllowance])

  const overBalance = BN(value).gt(BN(toFixed(balance, decimal)))
  const isEmptyValue = isEmpty(value) || Number(value) === 0

  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Input
            placeholder={`Balance: ${toFixed(balance, decimal)}`}
            prefix={<img className={styles.logo} src={getLogo(token)} alt="" />}
            suffix={
              <span className={styles.max} onClick={onMaxClick}>
                Max
              </span>
            }
            status={overBalance ? 'error' : ''}
            value={value}
            onChange={e => onValueChange(e.target.value)}
          />
          <div className={styles.asset}>
            estimatedTotalAssets: {toFixed(estimatedTotalAssets, decimal)} {tokenName}
          </div>
          {/* <div>Allowance: {toFixed(allowance, decimal)}</div> */}
        </Col>
        <Col span={24}>
          <Button block type="primary" disabled={isEmptyValue || overBalance} loading={depositing} onClick={deposit}>
            Deposit
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

export default Deposit
