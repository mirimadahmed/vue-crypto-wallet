import Avalanche from 'avalanche'
//@ts-ignore
import BinTools from 'avalanche/dist/utils/bintools'

// Connect to TestNet by default
// Doesn't really matter how we initialize, it will get changed by the network module later
let ip = 'bootstrap.ava.network'
let port = 21000
let protocol = 'https'
let network_id = 2
let chain_id = 'X'
let bintools = BinTools.getInstance()
let ava = new Avalanche(ip, port, protocol, network_id, chain_id)

let avm = ava.XChain()
let cChain = ava.CChain()
let pChain = ava.PChain()
let infoApi = ava.Info()
let keyChain = avm.keyChain()

function isValidAddress(addr) {
    try {
        let res = bintools.stringToAddress(addr)
        return true
    } catch (err) {
        return false
    }
}

export { ava, avm, pChain, cChain, infoApi, bintools, isValidAddress, keyChain }