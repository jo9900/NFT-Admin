<template>
  <div>
    <v-row justify="center" align="center" class="mt-10">
      <v-col cols="12" md="5" lg="4">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          :readonly="isReadonly"
        >
          <v-text-field
            v-model.trim="form.serviceFee"
            :rules="rules.serviceFee"
            :label="$t('text37')"
            :hint="$t('text38')"
            persistent-hint
            ref="feeInput"
            required
            suffix="%"
          ></v-text-field>
          <v-text-field
            class="mt-8"
            v-model.trim="form.transWalletAddress"
            :rules="rules.transWalletAddress"
            :label="$t('text39')"
            :hint="$t('text40')"
            persistent-hint
            required
          ></v-text-field>
          <v-row no-gutters>
            <v-btn
              :disabled="!valid"
              color="primary"
              large
              class="mt-10"
              @click="validate"
              block
              v-if="!isReadonly"
            >
              {{ $t('text41') }}
            </v-btn>
            <v-btn
              v-else
              outlined
              color="indigo"
              large
              class="mt-10"
              block
              @click="toEdit"
              >{{ $t('text42') }}</v-btn
            >
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getFee, updateFee } from '../api'
const checkPrice = (price) => {
  let ret = /^([1-9][0-9]*(\.[0-9]{1,2})?|0\.(?!0+$)[0-9]{1,2})$/
  return ret.test(price.toString())
}
export default {
  name: 'Fee',
  data: () => ({
    valid: true,
    isFocus: false,
    isReadonly: true,
    form: {
      transWalletAddress: '',
      serviceFee: '',
    },
  }),
  computed: {
    rules() {
      return {
        serviceFee: [
          (v) => !!v || this.$t('text43'),
          (v) => checkPrice(v) || this.$t('text44'),
        ],
        transWalletAddress: [(v) => !!v || this.$t('text43')],
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getData()
    },
    getData() {
      getFee().then((res) => {
        this.form = res.data
      })
    },
    toEdit() {
      this.$refs.feeInput.focus()
      this.isReadonly = false
    },
    validate() {
      if (this.$refs.form.validate()) {
        updateFee(this.form).then((res) => {
          console.log(res)
          this.isReadonly = true
          this.$store.commit('TOGGLE_SNACKBAR', {
            bool: true,
            msg: this.$t('text45'),
          })
        })
      }
    },
    reset() {
      this.$refs.form.reset()
    },
  },
}
</script>

<style scoped lang="stylus"></style>
