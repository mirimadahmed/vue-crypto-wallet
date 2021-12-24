import { web3 } from '@/evm'
import { BN } from 'avalanche'
import { bnToBig } from '@/helpers/helper'
import Big from 'big.js'

import ERC20Abi from '@openzeppelin/contracts/build/contracts/ERC20.json'

class Erc20Token {
    data
    contract
    balanceRaw
    balanceBN
    balanceBig

    constructor(tokenData) {
        this.data = tokenData
        this.balanceRaw = '0'
        this.balanceBN = new BN('0')
        this.balanceBig = Big(0)

        //@ts-ignore
        var tokenInst = new web3.eth.Contract(ERC20Abi.abi, tokenData.address)
        this.contract = tokenInst
    }

    // Returns a new instance of the token, given only the erc20 address
    static fromAddress(address) {
        //@ts-ignore
        var tokenInst = new web3.eth.Contract(ERC20Abi.abi, address)
        console.log(tokenInst)
    }

    createTransferTx(to, amount) {
        return this.contract.methods.transfer(to, amount.toString())
    }

    async updateBalance(address) {
        let bal = await this.contract.methods.balanceOf('0x' + address).call()
        this.balanceRaw = bal
        this.balanceBN = new BN(bal)
        this.balanceBig = bnToBig(this.balanceBN, parseInt(this.data.decimals))
    }
}

export default Erc20Token;