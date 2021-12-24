import { web3 } from '../evm'
import { Transaction } from '@ethereumjs/tx'
import EthereumjsCommon from '@ethereumjs/common'

export async function buildEvmTransferNativeTx(
    from,
    to,
    amount, // in wei
    gasPrice,
    gasLimit
) {
    const nonce = await web3.eth.getTransactionCount(from)
    const chainId = await web3.eth.getChainId()
    const networkId = await web3.eth.net.getId()
    const chainParams = {
        common: EthereumjsCommon.forCustomChain('mainnet', { networkId, chainId }, 'istanbul'),
    }

    let tx = new Transaction({
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            to: to,
            value: amount,
            data: '0x',
        },
        chainParams
    )
    return tx
}

export async function buildEvmTransferErc20Tx(
    from,
    to,
    amount, // in wei
    gasPrice,
    gasLimit,
    token,
    contract
) {
    const nonce = await web3.eth.getTransactionCount(from)
    const chainId = await web3.eth.getChainId()
    const networkId = await web3.eth.net.getId()
    const chainParams = {
        common: EthereumjsCommon.forCustomChain('mainnet', { networkId, chainId }, 'istanbul'),
    }

    let tokenTx = contract.methods.transfer(
        to, amount
    );

    let tx = new Transaction({
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            value: '0x0',
            to: token,
            data: tokenTx.encodeABI(),
        },
        chainParams
    )
    return tx
}