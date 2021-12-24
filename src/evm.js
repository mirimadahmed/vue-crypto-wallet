import Web3 from 'web3'

import ERC20Abi from '@openzeppelin/contracts/build/contracts/ERC20.json'

const abiDecoder = require('abi-decoder') // NodeJS

abiDecoder.addABI(ERC20Abi.abi)

let rpcUrl = `https://api.avax-test.network:443/ext/bc/C/rpc`

let web3 = new Web3(rpcUrl)

export { web3, abiDecoder }