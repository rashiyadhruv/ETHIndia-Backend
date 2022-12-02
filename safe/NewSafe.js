import Safe, { SafeFactory, SafeAccountConfig } from '@safe-global/safe-core-sdk'

const safeFactory = await SafeFactory.create({ ethAdapter })

const [owner1, owner2, owner3] = ['0x<address>', '0x<address>', '0x<address>']
const threshold = 3
const safeAccountConfig = {
  owners,
  threshold,
  // ...
}

// creating transction
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'

const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
const safeAddress = safeSdk.getAddress()


const safeTransactionData = {
  to: '0x<address>',
  value: '<eth_value_in_wei>',
  data: '0x<data>'
}
const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })

// signatures
// a. on chain
const ethAdapterOwner2 = new EthersAdapter({ ethers, signerOrProvider: owner2 })
const safeSdk2 = await safeSdk.connect({ ethAdapter: ethAdapterOwner2, safeAddress })
const txHash = await safeSdk2.getTransactionHash(safeTransaction)
const approveTxResponse = await safeSdk2.approveTransactionHash(txHash)
await approveTxResponse.transactionResponse?.wait()

// b. off-chain
const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction)

// execute transaction 
const ethAdapterOwner3 = new EthersAdapter({ ethers, signerOrProvider: owner3 })
const safeSdk3 = await safeSdk2.connect({ ethAdapter: ethAdapterOwner3, safeAddress })
const executeTxResponse = await safeSdk3.executeTransaction(safeTransaction)
await executeTxResponse.transactionResponse?.wait()