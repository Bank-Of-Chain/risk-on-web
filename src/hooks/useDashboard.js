import { useCallback, useEffect, useState } from 'react'

// === Utils === //
import { Contract, BigNumber } from 'ethers'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

// === Hooks === //
import { useSelector } from 'react-redux'

// === Constants === //
import { IUNISWAPV3_RISK_ON_VAULT, IUNISWAPV3_RISK_ON_HELPER, VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, IERC20_ABI } from '@/constants'
import moment from 'moment'

const useDashboard = personalVaultId => {
  const [data, setData] = useState([])
  const [array, setDataArray] = useState([])
  const [loading, setLoading] = useState(false)
  const userProvider = useSelector(state => state.walletReducer.userProvider)

  console.log('dataArray=', array)
  const load = useCallback(() => {
    if (isEmpty(personalVaultId)) return
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
      ]).then(([borrowInfo, wantInfo]) => {
        const { borrowToken } = borrowInfo
        const { wantToken } = wantInfo
        return Promise.all(
          map(array, item => {
            const { blockTag } = item
            return Promise.all([
              contract.netMarketMakingAmount({ blockTag }).catch(() => null),
              helperContract.getCurrentBorrow(borrowToken, 2, personalVaultId, { blockTag }).catch(() => null),
              helperContract.getTotalCollateralTokenAmount(personalVaultId, wantToken, { blockTag }).catch(() => null),
              contract.depositTo3rdPoolTotalAssets({ blockTag }).catch(() => null),
              contract.estimatedTotalAssets({ blockTag }).catch(() => null),
              helperContract
                .getCurrentBorrow(borrowToken, 2, personalVaultId, { blockTag })
                .catch(() => BigNumber.from(0))
                .then(currentBorrow => {
                  return helperContract.calcCanonicalAssetValue(borrowToken, currentBorrow, wantToken)
                })
            ])
          })
        )
          .then(resp => {
            const nextData = map(array, (item, index) => {
              const { date } = item
              return {
                date,
                netMarketMakingAmount: resp[index][0],
                currentBorrow: resp[index][1],
                totalCollateralTokenAmount: resp[index][2],
                depositTo3rdPoolTotalAssets: resp[index][3],
                estimatedTotalAssets: resp[index][4],
                currentBorrowWithCanonical: resp[index][5]
              }
            })

            setData(nextData)
          })
          .finally(() => {
            setTimeout(() => {
              setLoading(false)
            }, 300)
          })
      })
    })
  }, [personalVaultId, userProvider, array])

  useEffect(load, [load])

  useEffect(() => {
    userProvider.getBlockNumber().then(blockNum => {
      const days = 5
      const nextDataArray = []
      for (let i = 0; i < days; i++) {
        const startDate = moment().subtract(i, 'days')
        nextDataArray.push({
          date: startDate.format('YYYY-MM-DD'),
          blockTag: blockNum - i * 28800
        })
      }
      setDataArray(nextDataArray.reverse())
    })
  }, [userProvider])

  return {
    data,
    loading
  }
}

export default useDashboard
