require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
const dotenv = require('dotenv');
dotenv.config();

const { ALCHEMY_API_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17", 
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mumbai: {
      url: ALCHEMY_API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
