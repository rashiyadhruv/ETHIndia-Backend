import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

import { MarketAddress, MarketAddressABI } from './constants';

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const RealEstateContext = React.createContext();

export const RealEstateProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');

  // Check if it is connected to wallet
  const checkIfWalletIsConnect = async () => {
    // While installing metamask, it has an ethereum object in the window
    if (!window.ethereum) return alert('Please install MetaMask.');

    // Fetch all the eth accounts
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    // Connecting account if exists
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    // Fetch all the eth accounts------------------------------------here----------------
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);

    // Reloading window
    window.location.reload();
  };
  
  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');

    // solidity function call
    const listingPrice = await contract.getListingPrice();

    // solidity function call
    const transaction = !isReselling
      ? await contract.createToken(url, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() });

      // setIsLoadingNFT(true);
    await transaction.wait();
  };

  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });

    // setIsLoadingNFT(true);
    await transaction.wait();
    // setIsLoadingNFT(false);
  };

  return (
    <RealEstateContext.Provider value={{ connectWallet, createSale, buyNFT, currentAccount, setCurrentAccount}}>
      {children}
    </RealEstateContext.Provider>
  );
};
