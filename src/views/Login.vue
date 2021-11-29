<template>
  <div class="login-wrap">
    <div class="drop-shadow">
      <div class="glass"></div>
      <span>
        <span class="title">后台管理面板</span>
        <span
          v-ripple
          role="button"
          class="connect-btn"
          @click="onConnectAndLogin"
        >
          连接钱包
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      mt: {},
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
  background url("../assets/login-background.jpg") center center no-repeat
.connect-btn
  display inline-block
  width 200px
  background #ffff
  color #000
  border-radius 8px
  text-align center
  height 50px
  line-height 50px
  margin-left 30px
.title
  font-size 30px
  font-weight bold
  line-height 50px




$blur = 20px;
$shadow-opacity =  0.30;

body, html {
  height: 100%;
  margin: 0;
  padding: 0;
}


body {
  display: flex;
  justify-content: center;
  align-items: center;
  background url("../assets/login-background.jpg") center center no-repeat
  background-size: cover;
  background-position: center;
  font-family: 'Rajdhani', sans-serif;

}

*, *:before, *:after {
  box-sizing: border-box;
}

.glass {
  height: 100%;
  width: 100%;
  background url("../assets/login-background.jpg") center center no-repeat
  background-size: cover;
  background-position: center;
  clip-path: inset(21em);
  filter: blur($blur);
  display: flex;
  justify-content: center;
  align-items: center;
}

.drop-shadow {
  height: 100%;
  width: 100%;
  filter:  drop-shadow(0px 20px 10px rgba(0, 0, 0, $shadow-opacity));
  display: flex;
  justify-content: center;
  align-items: center;
  &:before {
    display: block;
    content: "";
    position: absolute;
    top: 10em;
    height: calc(100% - 20em);
    width: calc(100% - 20em);
    z-index: 2;
    //  filter: blur(1px);
  }


  > span {
    position: absolute;
    z-index: 5;
    color: white;
    font-size: 20px
    padding-left: 0.375em;
  }
}

@media (max-width: 980px) {
  .glass {
    clip-path: inset(5em);
  }
  .drop-shadow {
    &:before {
      top: 5em;
      width: calc(100% - 10em);
    }
    > span {
      font-size: 4em;
    }
  }
}

@media (max-width: 640px) {

  .drop-shadow {
    > span {
      font-size: 2em;
    }
  }
}
</style>
