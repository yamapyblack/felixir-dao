
<script setup lang=ts>
import { ethers } from "ethers"


const hoge = (i: number) => {
  return i
}


const accounts  = async () => { 
    const addrs = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
    });
 console.log(addrs[0])
};
// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider((window as any).ethereum)

// MetaMask requires requesting permission to connect users accounts
await provider.send("eth_requestAccounts", []);

// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()
</script>

<template>
  <div class="container mx-auto">
    <main>
      <div class="">
        index
      </div>
    </main>
  </div>
</template>

<style lang="scss">
</style>