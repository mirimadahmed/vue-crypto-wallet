import {
    buildEvmTransferErc20Tx,
    buildEvmTransferNativeTx,
} from '../js/TxHelper'

import { web3 } from '../evm'

async function getEthBalance(wallet) {
    return await web3.eth.getBalance(wallet)
}

async function sendEth(
    wallet,
    to,
    amount, // in wei
    gasPrice,
    gasLimit) {
    let fromAddr = '0x' + wallet.getEvmAddress()

    let tx = await buildEvmTransferNativeTx(fromAddr, to, amount, gasPrice, gasLimit)

    let signedTx = await wallet.signEvm(tx)

    let txHex = signedTx.serialize().toString('hex')
    let hash = await web3.eth.sendSignedTransaction('0x' + txHex)
    return hash.transactionHash
}

async function sendErc20(
    wallet,
    to,
    amount,
    gasPrice,
    gasLimit,
    token,
    contract
) {
    let fromAddr = wallet.getAddressC().toLowerCase();
    let tx = await buildEvmTransferErc20Tx(fromAddr, to, amount, gasPrice, gasLimit, token, contract)

    let signedTx = await wallet.signEvm(tx)
    let txHex = signedTx.serialize().toString('hex')
    let hash = await web3.eth.sendSignedTransaction('0x' + txHex)
    return hash.transactionHash
}

async function estimateTxGas(wallet, tx) {
    let estGas = await tx.estimateGas({ from: wallet })
    return Math.round(estGas * 1.1)
}

async function estimateGas(wallet, to, amount, token) {
    let tx = token.createTransferTx(to, amount)
    let estGas = await tx.estimateGas({
            from: wallet,
        })
        // Return 10% more
    return Math.round(estGas * 1.1)
}

export { getEthBalance, sendEth, sendErc20, estimateTxGas, estimateGas }