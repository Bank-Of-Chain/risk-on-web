import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// === Components === //
import { Select, Spin, message } from 'antd'

// === Hooks === //
import { useSelector } from 'react-redux'
import useNameHooks from '@/hooks/useNameHooks'

// === Utils === //
import * as ethers from 'ethers'

// === Constants === //
import { USDC_ADDRESS, WETH_ADDRESS, ZERO_ADDRESS } from '@/constants/tokens'
import { VAULT_FACTORY_ABI } from '@/constants'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import flatten from 'lodash/flatten'
import { filter } from 'lodash'

const { Option } = Select
const { Contract } = ethers

const tokens = [USDC_ADDRESS, WETH_ADDRESS]

const useRiskOnVault = (vaultFactoryAddress, vaultImplAddress) => {
  const provider = useSelector(state => state.walletReducer.provider)
  const userProvider = useSelector(state => state.walletReducer.userProvider)
  const navigate = useNavigate()
  const [vaultImplList, setVaultImplList] = useState([])
  const [personalVault, setPersonalVault] = useState([])
  const [isSupport, setIsSupport] = useState()
  const { data: tokenArray, loading: tokenLoading } = useNameHooks(tokens)
  const { data: typeArray, loading: typeLoading } = useNameHooks(vaultImplList)
  const [type, setType] = useState()
  const [token, setToken] = useState()
  const [adding, setAdding] = useState(false)

  const userAddress = provider?.selectedAddress

  const reset = () => {
    setToken()
    setType()
  }

  const typeSelector = (
    <Spin size="small" spinning={typeLoading}>
      <Select value={type} onChange={setType} style={{ minWidth: 200 }} placeholder="Select a template">
        {map(typeArray, item => {
          const { name, address } = item
          return (
            <Option key={address} value={address}>
              {name}
            </Option>
          )
        })}
      </Select>
    </Spin>
  )

  const tokenSelector = (
    <Spin size="small" spinning={tokenLoading}>
      <Select value={token} onChange={setToken} style={{ minWidth: 200 }} placeholder="Select a want token">
        {map(tokenArray, item => {
          const { name, address } = item
          return (
            <Option key={address} value={address}>
              {name}
            </Option>
          )
        })}
      </Select>
    </Spin>
  )

  const addVault = useCallback(
    async (token, type) => {
      setAdding(true)
      try {
        const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
        const tx = await vaultFactoryContract.connect(userProvider.getSigner()).createNewVault(token, type)
        const { events } = await tx.wait()
        let args = []
        for (let i = events.length - 1; i >= 0; i--) {
          if (events[i].event === 'CreateNewVault') {
            args = events[i].args
            break
          }
        }
        const { _newVault } = args
        message.success('Add vault success')
        navigate(`/deposit/${_newVault}`)
      } catch (error) {
        message.error('Add vault failed')
      }
      setAdding(false)
    },
    [vaultFactoryAddress, userProvider, navigate]
  )

  const deleteVault = useCallback(async () => {
    setAdding(true)
    try {
      const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
      vaultFactoryContract
        .connect(userProvider.getSigner())
        .createNewVault(token, type)
        .then(tx => tx.wait())
      message.success('Delete vault success')
    } catch (error) {
      message.error('Delete vault failed')
    }
    setAdding(false)
  }, [vaultFactoryAddress, userProvider, token, type])

  const getVaultImplList = useCallback(() => {
    if (isEmpty(vaultFactoryAddress) || isEmpty(userProvider)) return
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract.getVaultImplList().then(setVaultImplList)
  }, [vaultFactoryAddress, userProvider])

  const getVaultImplListByUser = useCallback(() => {
    if (isEmpty(vaultFactoryAddress) || isEmpty(userProvider) || isEmpty(vaultImplList) || isEmpty(userAddress)) return
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    const requestArray = map(vaultImplList, implAddress => {
      if (!isEmpty(vaultImplAddress) && implAddress !== vaultImplAddress) return []
      const array = [WETH_ADDRESS, USDC_ADDRESS]
      return map(array, (arrayItem, index) => {
        return vaultFactoryContract.vaultAddressMap(userAddress, implAddress, index).then(rs => {
          if (rs === ZERO_ADDRESS) return { hasCreate: false, type: implAddress, token: arrayItem }
          return {
            address: rs,
            type: implAddress,
            hasCreate: true,
            token: arrayItem
          }
        })
      })
    })
    Promise.all(flatten(requestArray)).then(resp => {
      setPersonalVault(filter(resp, i => i !== ZERO_ADDRESS))
    })
  }, [userAddress, vaultFactoryAddress, userProvider, vaultImplList, vaultImplAddress])

  const estimateAdd = useCallback(() => {
    if (isEmpty(token) || isEmpty(type) || isEmpty(userAddress)) {
      setIsSupport()
      return
    }
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract
      .connect(userProvider.getSigner())
      .callStatic.createNewVault(token, type)
      .then(() => setIsSupport(true))
      .catch(() => setIsSupport(false))
  }, [token, type, userAddress, vaultFactoryAddress, userProvider])

  useEffect(getVaultImplList, [getVaultImplList])

  useEffect(getVaultImplListByUser, [getVaultImplListByUser])

  useEffect(estimateAdd, [estimateAdd])

  return {
    vaultFactoryAddress,
    isSupport,
    type,
    token,
    vaultImplList,
    personalVault,
    // elements
    typeSelector,
    tokenSelector,
    // functions
    reset,
    addVault,
    deleteVault,
    adding
  }
}

export default useRiskOnVault
