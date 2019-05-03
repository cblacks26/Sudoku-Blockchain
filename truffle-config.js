const path = require("path");
let HDWalletProvider = require('truffle-hdwallet-provider');
let mnemonic = 'science peace hungry gym decade sick turn tube wonder icon mean rather';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/5b64595286b9448eb99c2aebc14641bd');
      },
      network_id: 4
    }
  },
  compilers: {
    solc: {
      version: "0.4.25",
    },
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts")
};