import CryptoJS from 'crypto-js/core'
import AES from 'crypto-js/aes'
const randomstring = require('randomstring')
import * as bip39 from 'bip39'

// The purpose of this class is for obfuscation only rather than secure encryption
export default class MnemonicPhrase {

    constructor(mnemonic) {
        if (!bip39.validateMnemonic(mnemonic)) throw new Error('Invalid mnemonic phrase.')
        this.pass = randomstring.generate(32)
        this.encrypted = AES.encrypt(mnemonic, this.pass).toString()
    }

    getValue() {
        let decrypted = AES.decrypt(this.encrypted, this.pass).toString(CryptoJS.enc.Utf8)
        if (!bip39.validateMnemonic(decrypted)) throw new Error('Decrypted mnemonic is not valid.')
        return decrypted
    }

    static getValueFromPassAndEncrypted(pass, encrypted) {
        let decrypted = AES.decrypt(encrypted, pass).toString(CryptoJS.enc.Utf8)
        if (!bip39.validateMnemonic(decrypted)) throw new Error('Decrypted mnemonic is not valid.')
        return decrypted
    }

    getEncrypted() {
        return this.encrypted
    }
}
