<template>
  <v-app id="inspire">
    <v-app-bar app color="white" flat>
      <v-container class="py-0 fill-height">
        {{ mallName }}
        <v-spacer></v-spacer>
        <v-btn @click="onConnectAndLogin()" v-if="!address">连接钱包</v-btn>
        <div class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-chip color="primary" dark v-bind="attrs" v-on="on">
                {{ address }}
              </v-chip>
            </template>
            <v-list>
              <v-list-item @click="$store.dispatch('disconnect')"
                >断开连接
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="2" md="2">
            <v-sheet rounded="lg">
              <v-list color="transparent">
                <v-list-item
                  v-for="item in linkList"
                  :key="item.path"
                  link
                  @click="$router.push(item.path)"
                >
                  <v-list-item-content>
                    <v-list-item-title> {{ item.text }} </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey lighten-4">
                  <v-list-item-content>
                    <v-list-item-title> Refresh </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="10" md="10">
            <v-sheet
              min-height="75vh"
              max-height="85vh"
              rounded="lg"
              style="overflow: hidden"
            >
              <router-view />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
      <vMsg></vMsg>
    </v-main>
  </v-app>
</template>

<script>
import { maskingAddress } from '@/utils'
import { mallName } from '../config'
import vMsg from '../components/Msg'
export default {
  name: 'Index',
  components: { vMsg },
  data() {
    return {
      address: '',
      mallName: mallName,
      isShowMenu: false,
      linkList: [
        {
          text: '作品管理',
          path: '/goods',
        },
        {
          text: '订单管理',
          path: '/orders',
        },
        {
          text: '服务费管理',
          path: '/fee',
        },
        {
          text: '焦点图管理',
          path: '/banner',
        },
      ],
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
  },
  watch: {
    '$store.state.web3Modal.account': {
      handler(cur) {
        if (cur) {
          this.address = maskingAddress(this.$store.getters.getAccount, 2)
          this.$store.dispatch('initConnect')
        } else {
          this.address = ''
        }
      },
      immediate: true,
    },
  },
  methods: {
    triggerMenu(bool) {
      this.isShowMenu = bool
    },
    onConnectAndLogin() {
      this.$store.dispatch('connect')
    },
  },
}
</script>

<style scoped></style>
