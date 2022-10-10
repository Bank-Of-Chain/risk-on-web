import { configureStore } from '@reduxjs/toolkit'

// === Reducers === //
import metaReducer from './reducers/meta-reducer'
import walletReducer from './reducers/wallet-reducer'

export default configureStore({
  reducer: {
    metaReducer,
    walletReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
