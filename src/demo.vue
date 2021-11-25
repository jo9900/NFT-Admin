<template>
  <div class="checkWallet">
   demo
  </div>
</template>

<script>
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
export default {
  name: 'checkWallet',
  data() {
    return {
    }
  },
  methods: {
    connected() {
    },
    async init(){

      const providerOptions = {
        /* See Provider Options Section */
        walletconnect: {
          package: function(){
            return new WalletConnectProvider({
              rpc: {
                80001: "https://matic-mumbai.chainstacklabs.com",
              },
              rpcUrl: "https://matic-mumbai.chainstacklabs.com",
              chainId: 80001
            });
          },
          options: {
            infuraId: "9aa3d95b3bc440fa88ea12eaa4456161"
          }
        }
      };

      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
      });
      window.web3Modal = web3Modal;
      console.log('web3Modal', web3Modal)
      const provider = await web3Modal.connect();
      console.log('web3Modal', web3Modal)
      const web3 = new Web3(provider);
      console.log( web3 );
    }
  },
  created () {
    this.init();
    let query = this.$route.query;
    if(query.version){
      localStorage.version = query.version;
    }
  },
}
</script>
