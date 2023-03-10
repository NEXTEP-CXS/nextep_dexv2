import { createReducer, nanoid } from '@reduxjs/toolkit'
import { addPopup, PopupContent, removePopup, toggleWalletModal, updateBlockNumber, updatePrices } from './actions'

type PopupList = Array<{ key: string; show: boolean; content: PopupContent }>

interface ApplicationState {
  blockNumber: { [chainId: number]: number }
  popupList: PopupList
  walletModalOpen: boolean
  tokenPrices: any
}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: [],
  walletModalOpen: false,
  tokenPrices: {}
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(updatePrices, (state, action) => {
      const { symbol, value } = action.payload
      state.tokenPrices[symbol] = value;
    })
    .addCase(toggleWalletModal, state => {
      state.walletModalOpen = !state.walletModalOpen
    })
    .addCase(addPopup, (state, { payload: { content } }) => {
      state.popupList.push({
        key: nanoid(),
        show: true,
        content
      })
    })
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach(p => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
)
