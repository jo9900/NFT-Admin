<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" md="4">
        <v-select
          @change="onRefresh"
          item-color="indigo"
          dense
          v-model="selected"
          :items="items"
          item-text="text"
          item-value="value"
          class="elevation-0"
          solo
        ></v-select>
      </v-col>
      <v-col>
        <v-btn class="mx-2 refresh-btn" color="indigo" dark @click="onRefresh">
          <v-icon dark> mdi-refresh </v-icon>
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col>
        <v-btn
          class="mx-2 float-right"
          color="indigo"
          dark
          fab
          small
          @click="toAdd"
        >
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-sheet>
      <v-data-table
        :headers="headers"
        :items="list"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        height="70vh"
        hide-default-footer
        class="elevation-1 table"
        disable-sort
        fixed-header
        :no-data-text="$t('text3')"
        :loading="isLoading"
        @page-count="pageCount = $event"
      >
        <template v-slot:item.numState="{ item }">
          <v-chip :color="item.numState === 1 ? 'indigo' : 'grey'" outlined>
            {{ item.numState | formatBannerState }}
          </v-chip>
        </template>
        <template v-slot:item.focusMapUrl="{ item }">
          <VMedia :mediaUrl="item.focusMapUrl" class="media-wrap" />
        </template>
        <template v-slot:item.focusLink="{ item }">
          <v-btn icon @click="toOuterPage(item)" v-if="item.focusLink">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </template>

        <template v-slot:item._actions="{ item }">
          <v-btn @click="onEdit(item)" icon>
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn icon @click="onTriggerState(item)">
            <v-icon v-if="item.numState === 1">mdi-cancel</v-icon>
            <v-icon v-else>mdi-check</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination
          v-model="page"
          color="indigo"
          total-visible="8"
          :length="pageCount"
          @input="onClickPage"
        ></v-pagination>
      </div>
    </v-sheet>

    <v-dialog v-model="isShowDialog" persistent width="650px">
      <v-card class="px-8 py-4">
        <v-card-title class="py-8">
          <span class="text-h5">{{
            isEditing ? $t('text46') : $t('text47')
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              clearable
              v-model.trim="form.focusName"
              :rules="rules.focusName"
              :label="$t('text48')"
              required
              counter="30"
              class="mb-4"
            ></v-text-field>
            <div>
              {{ form.focusMapUrl }}
              <v-file-input
                show-size
                accept="image/.jpg, .jpeg, .png, .gif"
                :label="$t('text49')"
                v-model="imageFile"
                prepend-icon=""
                class="mb-4"
                :rules="rules.imageFile"
                :error-messages="fileErrorText"
                :error="isFileError"
              ></v-file-input>
            </div>
            <div>
              <v-img
                v-if="form.focusMapUrl"
                :src="form.focusMapUrl"
                contain
                height="100"
                @click="showExpandMedia(form.focusMapUrl)"
              ></v-img>
            </div>
            <v-text-field
              clearable
              v-model.trim="form.focusLink"
              :rules="rules.focusLink"
              :label="$t('text50')"
              class="mb-4"
              :hint="$t('text89')"
            >
            </v-text-field>
            <v-select
              item-color="indigo"
              v-model="form.focusLocation"
              :items="items"
              :rules="rules.focusLocation"
              :label="$t('text51')"
              item-text="text"
              item-value="value"
              class="mb-4"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="closeDialog"
            color="indigo"
            class="mr-3"
            outlined
            large
          >
            {{ $t('text52') }}
          </v-btn>
          <v-btn
            v-if="!isEditing"
            large
            :disabled="!valid"
            class="mr-4 white--text"
            @click="onConfirm"
            color="indigo"
          >
            {{ $t('text53') }}
          </v-btn>
          <v-btn
            v-if="isEditing"
            large
            :disabled="!valid"
            class="mr-4 white--text"
            @click="onUpdate"
            color="indigo"
          >
            {{ $t('text54') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  addBanner,
  getBannerData,
  getBannerList,
  triggerBannerState,
  updateBanner,
} from '../api'
import { getRssUrl } from '../api/rss'
import { mallCode } from '../config'
import { debounce } from 'lodash'
import VMedia from '@/components/Media'
const checkLink = (link) => {
  if (!link) return true
  let ret =
    /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?%#[\]@!$&'*+,;=]+$/
  return ret.test(link.toString())
}
export default {
  name: 'Banner',
  components: { VMedia },
  data: () => ({
    itemsPerPage: 10,
    page: 1,
    pageCount: 0,
    list: [],
    isLoading: false,
    isShowDialog: false,
    isEditing: false, // 正在编辑
    transparent: 'rgba(255, 255, 255, 0)',
    selected: 0,
    valid: true,
    form: {
      focusLink: '',
      focusLocation: 0,
      focusMapUrl: '',
      focusName: '',
    },
    fileErrorText: '',
    isFileError: false,
    imageFile: null,
    VUE_APP_WEB_URL: process.env.VUE_APP_WEB_URL,
    currentId: null,
  }),
  watch: {
    imageFile: {
      handler(cur) {
        this.form.focusMapUrl = ''
        if (cur) {
          this.isFileError = false
          this.fileErrorText = ''
          // rss
          this.getFileUrl(cur)
        }
        console.log('this.form', this.form)
      },
    },
    page: {
      handler(cur) {
        if (cur) {
          this.getData(cur)
        }
      },
    },
  },
  computed: {
    rules() {
      return {
        focusName: [
          (v) => !!v || this.$t('text43'),
          (v) => (v && v.length <= 30) || this.$t('text56'),
        ],
        imageFile: [(v) => !v || !this.focusMapUrl || this.$t('text55')],
        focusLink: [(v) => checkLink(v) || this.$t('text89')],
        focusLocation: [(v) => v != null || this.$t('text55')],
      }
    },
    items() {
      return [
        {
          text: this.$t('text57'),
          value: 0,
        },
        {
          text: this.$t('text58'),
          value: 1,
        },
        {
          text: this.$t('text59'),
          value: 2,
        },
      ]
    },
    headers() {
      return [
        {
          text: this.$t('text48'),
          align: 'start',
          sortable: false,
          value: 'focusName',
        },
        { text: this.$t('text60'), value: 'focusMapUrl', width: '120' },
        { text: this.$t('text61'), value: 'focusLink' },
        { text: this.$t('text62'), value: 'numState' },
        { text: this.$t('text63'), value: 'createTime', width: '180' },
        { text: this.$t('text13'), value: '_actions', align: 'center' },
      ]
    },
  },
  created() {
    this.selected = this.items[0].value
    this.init()
  },
  methods: {
    init() {
      this.getData()
    },
    getData(pageNum = 1) {
      this.isLoading = true
      const params = {
        focusLocation: Number(this.selected),
        limit: this.itemsPerPage,
        mallCode,
        pageNum,
      }
      getBannerList(params)
        .then((res) => {
          this.list = res.data.list
          this.$nextTick(() => {
            this.pageCount = res.data.pageCount
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    onRefresh: debounce(function () {
      this.getData(1)
    }, 300),
    onEdit(rowData) {
      this.isEditing = true
      this.isShowDialog = true
      getBannerData({}, rowData.id).then((res) => {
        this.form = res.data
      })
    },
    onUpdate: debounce(async function () {
      this.validateAll().then(() => {
        updateBanner(this.form).then((res) => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            bool: true,
            msg: this.$t('text45'),
          })
          this.closeDialog()
          this.getData(1)
        })
      })
    }, 300),
    getFileUrl(file) {
      let size = file.size
      let MB = size / (1024 * 1024)
      if (MB > 5) {
        this.isFileError = true
        this.fileErrorText = this.$t('text64')
        return
      }
      let form = new FormData()
      form.append('project', 'nft_adm')
      form.append('file_url', file)
      getRssUrl(form).then((res) => {
        this.form.focusMapUrl = this.VUE_APP_WEB_URL + res.data.file_url
      })
    },
    onTriggerState: debounce(function ({ id, numState }) {
      triggerBannerState({}, id).then((res) => {
        this.$store.commit('TOGGLE_SNACKBAR', {
          bool: true,
          msg: numState === 1 ? this.$t('text65') : this.$t('text66'),
        })
        this.getData(1)
      })
    }, 300),
    toAdd() {
      this.isShowDialog = true
    },
    onAdd() {
      const params = this.form
      params.focusLink = params.focusLink || ''
      addBanner(params).then((res) => {
        this.$store.commit('TOGGLE_SNACKBAR', {
          bool: true,
          msg: this.$t('text67'),
        })
        this.getData(1)
      })
    },
    toOuterPage(rowData) {
      window.open(rowData.focusLink, '_blank')
    },
    validateAll() {
      return new Promise((resolve, reject) => {
        let flag = true
        if (!this.form.focusMapUrl) {
          this.isFileError = true
          this.fileErrorText = this.$t('text55')
          flag = false
        } else {
          this.isFileError = false
          this.fileErrorText = ''
        }
        if (!this.$refs.form.validate()) {
          flag = false
        }
        if (flag) {
          resolve()
        } else reject()
      })
    },
    onConfirm: debounce(function () {
      this.validateAll().then(async () => {
        await this.onAdd()
        await this.closeDialog()
      })
    }, 300),
    closeDialog() {
      this.isShowDialog = false
      this.isEditing = false
      this.isFileError = false
      this.fileErrorText = ''
      this.$refs.form.reset()
      this.form.focusMapUrl = ''
    },
    showExpandMedia(url) {
      window.open(url, '_blank')
    },
    onClickPage(clickedNum) {
      this.page = clickedNum
    },
  },
}
</script>

<style scoped lang="stylus">
@import "~@/stylus/mediaExpand.styl"

.refresh-btn
  height 38px !important
</style>
