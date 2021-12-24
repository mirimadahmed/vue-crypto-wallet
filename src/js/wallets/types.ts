import {
    KeyPair as AVMKeyPair,
} from 'avalanche/dist/apis/avm'

import {
    KeyChain as EVMKeyChain,
} from 'avalanche/dist/apis/evm'

import MnemonicWallet from './MnemonicWallet'

export interface IIndexKeyCache {
    [index: number]: AVMKeyPair
}

export type ChainAlias = 'X' | 'P'
export type AvmImportChainType = 'P' | 'C'
export type AvmExportChainType = 'P' | 'C'

export type WalletNameType = 'mnemonic'
export type WalletType = MnemonicWallet

// Wallets which have the private key in memory
export interface UnsafeWallet {
    ethKey: string
    ethKeyChain: EVMKeyChain
}