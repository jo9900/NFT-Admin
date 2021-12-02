<template>
  <v-app id="inspire">
    <v-app-bar app color="white" flat>
      <v-container class="py-0 fill-height">
        <span class="mall-name">{{ mallName }}</span>
        <v-spacer></v-spacer>
        <div class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-chip color="primary" dark v-bind="attrs" v-on="on">
                {{ address }}
              </v-chip>
            </template>
            <v-list>
              <v-list-item @click="$store.dispatch('disconnect')"
                >{{ $t('text83') }}
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="ml-4" v-bind="attrs" v-on="on"
                >mdi-translate</v-icon
              >
            </template>
            <v-list>
              <v-list-item @click="changeLocale('zh')">简体中文 </v-list-item>
              <v-list-item @click="changeLocale('en')">English </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3" id="main">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="2" md="2">
            <v-sheet rounded="lg">
              <v-list color="transparent" flat>
                <v-list-item-group v-model="selectedItem" color="indigo">
                  <v-list-item
                    v-for="(item, index) in linkList"
                    :key="item.path"
                    link
                    @click="toRoute(item, index)"
                  >
                    <v-list-item-content>
                      <v-list-item-title> {{ item.text }} </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="10" md="10">
            <v-sheet
              min-height="75vh"
              max-height="85vh"
              rounded="lg"
              style="overflow: auto; position: relative"
              class="pa-2"
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
      selectedItem: 0,
      address: '',
      mallName: mallName,
      isShowMenu: false,
    }
  },
  computed: {
    linkList() {
      return [
        {
          text: this.$t('text35'),
          path: '/goods',
        },
        {
          text: this.$t('text84'),
          path: '/orders',
        },
        {
          text: this.$t('text85'),
          path: '/fee',
        },
        {
          text: this.$t('text86'),
          path: '/banner',
        },
      ]
    },
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
          this.address = maskingAddress(localStorage.getItem('account'), 2)
          this.$store.dispatch('initConnect')
        } else {
          this.address = ''
        }
      },
      immediate: true,
    },
    '$route.path': {
      handler(cur) {
        if (!cur) return
        this.linkList.find((el, index)=> {
          if (el.path === cur) {
            this.selectedItem = index
            return el
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    toRoute(item, index) {
      this.selectedItem = index
      this.$router.push(item.path)
    },
    triggerMenu(bool) {
      this.isShowMenu = bool
    },
    onConnectAndLogin() {
      this.$store.dispatch('connect')
    },
    changeLocale(lang) {
      window.localStorage.setItem('locale', lang)
      window.location.reload()
    },
  },
}
</script>

<style scoped lang="stylus">
#main
  background url("../assets/background.png") center center no-repeat
  background-size cover
.mall-name
  cursor default
</style>
