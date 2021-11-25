<template>
  <div class="login-wrap">
    <div class="connect-btn" role="button" @click="onConnectAndLogin">
      连接钱包
    </div>
    <ul>
      <li>mallCode: {{ mt.mallCode }} </li>
      <li>mallDescription: {{ mt.mallDescription }} </li>
      <li>商城名字: {{ mt.mallName }}</li>
      <li>token: {{ mt.token }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      mt: {}
    }
  },
  mounted() {
    window.addEventListener('beforeunload', () => {
      // 清除所有定时器
      let endTid = setTimeout(function () {})
      for (let i = 0; i <= endTid; i++) {
        clearTimeout(i)
        clearInterval(i)
      }
      if (this.$store.state.web3Modal.account)
        localStorage.setItem('account', this.$store.state.web3Modal.account)
    })
    window.addEventListener('load', async () => {
      let account = localStorage.getItem('account')
      if (account) {
        this.$store.commit('setAccount', account)
        await this.$store.dispatch('initConnect')
        await this.$store.dispatch('connect')
      }
    })
    this.$store.dispatch('initConnect')
  },
  watch: {
    'store.state.web3Modal.account': {
      handler(cur) {
        if (cur) {
          this.$store.dispatch('initConnect')
          this.mt = localStorage.getItem('uInfo')
        }
      },
      immediate: true,
    },
  },
  methods: {
    onConnectAndLogin() {
      this.$store.dispatch('connect')
    },
  },
}
</script>

<style scoped lang="stylus">
.login-wrap
  height 100%
  position absolute
  left 0
  right 0
  bottom 0
  top 0
  background #171a46
.connect-btn
  font-size 24px
  text-align center
  margin-top 30vh
  color #fff
</style>
