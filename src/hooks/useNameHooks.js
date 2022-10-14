// === Utils === //
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

// === Hooks === //
import { useSelector } from 'react-redux'

// === Constants === //
import { IERC20_ABI } from '@/constants'
import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'ethers'

const useNameHooks = (array = []) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const userProvider = useSelector(state => state.walletReducer.userProvider)
  const provider = useSelector(state => state.walletReducer.provider)

  const userAddress = provider?.selectedAddress

  const load = useCallback(() => {
    if (isEmpty(array) || isEmpty(userAddress)) return
    setLoading(true)
    Promise.all(
      map(array, async address => {
        const contract = new Contract(address, IERC20_ABI, userProvider)
        return {
          name: (await contract.name()) || address,
          address
        }
      })
    )
      .then(rs => {
        setData(rs)
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 300)
      })
  }, [array, userProvider, userAddress])

  useEffect(() => {
    load()
  }, [load])

  return {
    data,
    loading
  }
}

export default useNameHooks
