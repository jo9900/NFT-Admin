<template>
  <v-snackbar v-model="snackbar" timeout="-1" top>
    {{ msg }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="white"
        text
        v-bind="attrs"
        @click="$store.commit('TOGGLE_SNACKBAR', { bool: false })"
      >
        <v-icon light color="primary">
          mdi-close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "vMsg",
  data: ()=> ({
    msg: '',
    snackbar: false,
    timer: undefined
  }),
  watch: {
    '$store.state.snackbar': {
      handler(cur) {
        clearTimeout(this.timer)
        this.snackbar = cur.isShow
        this.msg = cur.msg
        if (this.snackbar) {
          this.timer = setTimeout( () => {
            this.$store.commit('TOGGLE_SNACKBAR',
              { bool: false, msg: '' }
            )
          }, 1000 * 4)
        }
      },
      deep: true
    }
  },
  computed: {
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.timer = null
  }
}
</script>

<style scoped>

</style>
