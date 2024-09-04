require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: 'https://rpc.ankr.com/eth_sepolia',
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
