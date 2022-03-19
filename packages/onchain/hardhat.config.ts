import { HardhatUserConfig } from "hardhat/config"
import { HttpNetworkAccountsConfig } from "hardhat/types"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "solidity-coverage"

const accounts = (): HttpNetworkAccountsConfig => {
  if (!process.env.PRIV_KEY) {
    return "remote"
  }
  console.log("Loaded key from environment");
  return [process.env.PRIV_KEY!]
};

const config: HardhatUserConfig = {
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
      chainId: 3,
      gasPrice: 1000000001,
      // accounts: accounts(),
    },
    shibuya: {
      url: 'https://rpc.shibuya.astar.network:8545',
      chainId: 81,
      accounts: accounts(),
    },
    shiden: {
      url: 'https://shiden.api.onfinality.io/public',
      chainId: 336,
      // accounts: accounts(),
    },
    astar: {
      url: 'https://rpc.astar.network:8545',
      chainId: 592,
      // accounts: accounts(),
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
    ]
  },
  gasReporter: {
    enabled: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config
