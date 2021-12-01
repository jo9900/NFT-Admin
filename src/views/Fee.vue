<template>
  <div>
    <v-row justify="center" align="center" class="mt-10">
      <v-col cols="12" md="5" lg="4">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          :readonly="isReadonly || isLoading"
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
              :disabled="!valid || isLoading"
              :loading="isLoading"
              color="primary"
              large
              class="mt-10"
              @click="updateValidate"
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
import { setFeeAndAddress } from '../utils'
import { BigNumber } from 'ethers'
const checkPrice = (price) => {
  let ret = /^([1-9][0-9]*(\.[0-9])?|0\.(?!0+$)[0-9])$/
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
    isLoading: false,
    currentForm: {},
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
        this.currentForm = JSON.parse(JSON.stringify(this.form))
      })
    },
    toEdit() {
      this.$refs.feeInput.focus()
      this.isReadonly = false
    },
    updateValidate() {
      if (this.$refs.form.validate()) {
        const newFee = BigNumber.from(this.form.serviceFee * 10).toString()
        const newAddress = this.form.transWalletAddress
        if (JSON.stringify(this.form) !== JSON.stringify(this.currentForm)) {
          this.isLoading = true
          if (this.form.serviceFee !== this.currentForm.serviceFee) {
            this.onSetContract(newFee)
          } else {
            this.onSetContract(null, newAddress)
          }
        }
      }
    },
    toHttpUpdate() {
      updateFee(this.form)
        .then((res) => {
          this.isReadonly = true
          this.$store.commit('TOGGLE_SNACKBAR', {
            bool: true,
            msg: this.$t('text45'),
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    reset() {
      this.$refs.form.reset()
    },
    /**
     * 只有市场合约所有者可以调用合约设置交易服务费和收款钱包地址
     */
    onSetContract(newFee, newAddress) {
      setFeeAndAddress(newFee, newAddress).then((res) => {
        console.log('setFeeAndAddress:', res)
        const isAllSuccess = res.every((el) => {
          if (el.status === 'rejected') {
            this.isLoading = false
            this.$store.commit('TOGGLE_SNACKBAR', {
              msg: el.reason?.code === 4001 ? this.$t('text87') : this.$t('text88'),
              bool: true,
            })
            return false
          }
          if (el.status === 'fulfilled') return true
        })
        console.log('isAllSuccess:', isAllSuccess)
        isAllSuccess && this.toHttpUpdate()
      })
    },
  },
}
</script>

<style scoped lang="stylus"></style>
