require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const ETHERSCAN_KEYS = "TUZDAPHPI7TKABXTN6EB2PZNWQIGXBEYG8";
const BSCSCAN_KEYS = "FZM9YIFJMH7IRPRTSIBWGMERSMT3321G5Z";
const INFURA_PROJECT_ID = "43cdf99f43c745bbb22c14eaf821ceb0";

const PRIVATE_KEY = "e492164a9fe6e9d4a3e4fd595d8d2abe1dc0e1b35c4476c850fd5c4a516d1bd9";

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: BSCSCAN_KEYS
  },
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    bscTestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      // url: `https://tagd:Tag@2201@apis.ankr.com/95ea457c06e040d3bfa6f83cd7bdc88c/df041c6c4283774e19a0777f52feee44/binance/full/main/`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    local: {
      url: `http://localhost:7545/`,
    }

  }
};

