<template>
  <div>
    <v-row justify="center" align="center" class="mt-10">
      <v-col cols="12" md="6">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          :readonly="isReadonly"
        >
          <v-text-field
            v-model.trim="form.serviceFee"
            :rules="rules.serviceFee"
            label="交易服务费"
            hint="当作品每次交易时，从成交额中收取的服务费，由卖家支付"
            persistent-hint
            ref="feeInput"
            required
            suffix="%"
          ></v-text-field>
          <v-text-field
            class="mt-8"
            v-model.trim="form.transWalletAddress"
            :rules="rules.transWalletAddress"
            label="收款钱包地址"
            hint="收取每笔交易服务费的钱包地址"
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
              提交
            </v-btn>
            <v-btn
              v-else
              outlined
              color="primary"
              large
              class="mt-10"
              block
              @click="toEdit"
              >编辑</v-btn
            >
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import {validate} from 'trezor-address-validator'
import { getFee, updateFee } from '../api'

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
    rules: {
      serviceFee: [(v) => !!v || '必填'],
      transWalletAddress: [(v) => !!v || '必填'],
    },
  }),
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
    toEdit(){
      this.$refs.feeInput.focus()
      this.isReadonly = false
    },
    validate() {
      if (this.$refs.form.validate()) {
        updateFee(this.form).then((res) => {
          console.log(res)
          this.isReadonly = true
          this.$store.commit('TOGGLE_SNACKBAR',
            { bool: true, msg: '更新成功' }
          )
        })
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style scoped lang="stylus"></style>
