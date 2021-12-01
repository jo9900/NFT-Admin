<template>
  <div class="checkWallet">
   demo
    <button @click="test">123</button>
  </div>
</template>

<script>
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { updateFee } from "./api";
export default {
  name: 'checkWallet',
  data() {
    return {
      form: {
        transWalletAddress: '1',
        serviceFee: 0,
      },
    }
  },
  methods: {
    test(){
      updateFee(this.form)
        .then((res) => {
        })
        .finally(() => {
        })
    }
  },
}
</script>
