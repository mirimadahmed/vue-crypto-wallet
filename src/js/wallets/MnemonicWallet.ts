// A simple wrapper thar combines avalanche.js, bip39 and HDWallet


import { privateToAddress } from 'ethereumjs-util'

import {
    KeyChain as EVMKeyChain,
    UnsignedTx as EVMUnsignedTx,
    Tx as EvmTx,
} from 'avalanche/dist/apis/evm'

import * as bip39 from 'bip39'
import { BN, Buffer as BufferAvalanche } from 'avalanche'
import { ava, bintools } from '../../AVA'
import HDKey from 'hdkey'
import { WalletNameType } from './types'
import { KeyChain } from 'avalanche/dist/apis/evm'
import Erc20Token from '../Erc20Token'
import { WalletHelper } from '../../helpers/wallet_helper'
import { Transaction } from '@ethereumjs/tx'
import MnemonicPhrase from './MnemonicPhrase'

const AVA_TOKEN_INDEX: string = '9000'
export const AVA_ACCOUNT_PATH: string = `m/44'/${AVA_TOKEN_INDEX}'/0'` // Change and index left out
export const ETH_ACCOUNT_PATH: string = `m/44'/60'/0'`
export const LEDGER_ETH_ACCOUNT_PATH = ETH_ACCOUNT_PATH + '/0/0'

const INDEX_RANGE: number = 20 // a gap of at least 20 indexes is needed to claim an index unused
const SCAN_SIZE: number = 70 // the total number of utxos to look at initially to calculate last index
const SCAN_RANGE: number = SCAN_SIZE - INDEX_RANGE // How many items are actually scanned

// Possible indexes for each request is
// SCAN_SIZE - INDEX_RANGE

export default class MnemonicWallet {
    seed: string
    hdKey: HDKey
    private mnemonic: MnemonicPhrase
    isLoading: boolean
    type: WalletNameType
    ethKey: string
    ethKeyBech: string
    ethKeyChain: EVMKeyChain
    ethAddress: string
    ethBalance: BN

    // The master key from avalanche.js
    constructor(mnemonic: string) {
        let seed: globalThis.Buffer = bip39.mnemonicToSeedSync(mnemonic)
        let masterHdKey: HDKey = HDKey.fromMasterSeed(seed)
        let ethAccountKey = masterHdKey.derive(ETH_ACCOUNT_PATH + '/0/0')

        // Derive EVM key and address
        let ethPrivateKey = ethAccountKey.privateKey
        this.ethKey = ethPrivateKey.toString('hex')
        this.ethAddress = privateToAddress(ethPrivateKey).toString('hex')
        this.ethBalance = new BN(0)

        let cPrivKey = `PrivateKey-` + bintools.cb58Encode(BufferAvalanche.from(ethPrivateKey))
        this.ethKeyBech = cPrivKey

        let cKeyChain = new KeyChain(ava.getHRP(), 'C')
        this.ethKeyChain = cKeyChain

        let cKeypair = cKeyChain.importKey(cPrivKey)

        this.type = 'mnemonic'
        this.seed = seed.toString('hex')
        this.hdKey = masterHdKey
        this.mnemonic = new MnemonicPhrase(mnemonic)
        this.isLoading = false
    }

    getEvmAddress(): string {
        return this.ethAddress
    }

    async getEthBalance() {
        let bal = await WalletHelper.getEthBalance(this)
        this.ethBalance = bal
        return bal
    }

    async sendEth(to: string, amount: BN, gasPrice: BN, gasLimit: number) {
        return await WalletHelper.sendEth(this, to, amount, gasPrice, gasLimit)
    }

    async estimateGas(to: string, amount: BN, token: Erc20Token): Promise<number> {
        return await WalletHelper.estimateGas(this, to, amount, token)
    }

    async sendERC20(
        to: string,
        amount: BN,
        gasPrice: BN,
        gasLimit: number,
        token: Erc20Token
    ): Promise<string> {
        return await WalletHelper.sendErc20(this, to, amount, gasPrice, gasLimit, token)
    }

    /**
     * Returns the mnemonic phrase of this wallet
     */
    getMnemonic(): string {
        return this.mnemonic.getValue()
    }

    getMnemonicEncrypted(): MnemonicPhrase {
        return this.mnemonic
    }

    async signC(unsignedTx: EVMUnsignedTx): Promise<EvmTx> {
        let keyChain = this.ethKeyChain
        return unsignedTx.sign(keyChain)
    }

    async signEvm(tx: Transaction) {
        let keyBuff = Buffer.from(this.ethKey, 'hex')
        return tx.sign(keyBuff)
    }
}
