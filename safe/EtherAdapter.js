import { ethers } from 'ethers'
import EthersAdapter from '@safe-global/safe-ethers-lib'

const web3Modal = new Web3Modal();
const web3Provider = await web3Modal.connect();
// const web3Provider = // ...
const provider = new ethers.providers.Web3Provider(web3Provider)
const safeOwner = provider.getSigner(0)

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: safeOwner
})