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
          label="所属页面"
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
        class="elevation-1"
        disable-sort
        fixed-header
        :no-data-text="'暂无数据'"
        :loading="isLoading"
        @page-count="pageCount = $event"
      >
        <template v-slot:item.numState="{ item }">
          <v-chip :color="item.numState === 1 ? 'indigo' : 'grey'" outlined>
            {{ item.numState | formatBannerState }}
          </v-chip>
        </template>
        <template v-slot:item.focusMapUrl="{ item }">
          <v-hover v-slot="{ hover }">
            <v-img :src="item.focusMapUrl" width="30" contain>
              <div class="align-self-center">
                <v-btn
                  :class="{ 'show-btns': hover }"
                  :color="transparent"
                  icon
                >
                  <v-icon :class="{ 'show-btns': hover }" :color="transparent">
                    mdi-magnify-expand
                  </v-icon>
                </v-btn>
              </div>
            </v-img>
          </v-hover>
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
        ></v-pagination>
      </div>
    </v-sheet>

    <v-dialog v-model="isShowDialog" persistent max-width="650px">
      <v-card class="px-8 py-4">
        <v-card-title class="py-8">
          <span class="text-h5">{{
            isEditing ? '编辑焦点图' : '添加焦点图'
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model.trim="form.focusName"
              :rules="rules.focusName"
              label="焦点图名称"
              required
              counter="30"
              class="mb-4"
            ></v-text-field>
            <v-row no-gutters>
              <v-file-input
                accept="image/.jpg, .jpeg, .png, .gif"
                label="请选择图片"
                v-model="imageFile"
                prepend-icon=""
                class="mb-4"
                :error-messages="fileErrorText"
                :error="isFileError"
              ></v-file-input>
              <v-img
                :src="form.focusMapUrl"
                :rules="rules.focusMapUrl"
                contain
                height="100"
              ></v-img>
            </v-row>

            <v-text-field
              v-model.trim="form.focusLink"
              label="链接"
              class="mb-4"
            ></v-text-field>
            <v-select
              item-color="indigo"
              v-model="form.focusLocation"
              :items="items"
              :rules="rules.focusLocation"
              label="焦点图位置"
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
            取消
          </v-btn>
          <v-btn
            v-if="!isEditing"
            large
            :disabled="!valid"
            class="mr-4 white--text"
            @click="onConfirm"
            color="indigo"
          >
            添加
          </v-btn>
          <v-btn
            v-if="isEditing"
            large
            :disabled="!valid"
            class="mr-4 white--text"
            @click="onUpdate"
            color="indigo"
          >
            更新
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
  getRssUrl,
  triggerBannerState,
  updateBanner,
} from '../api'
import { mallCode } from '../config'
import { debounce } from 'lodash'

export default {
  name: 'Banner',
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
    rules: {
      focusName: [
        (v) => !!v || '必填',
        (v) => (v && v.length <= 30) || '超过长度限制',
      ],
      focusMapUrl: [(v) => !!v || '必选'],
      focusLocation: [(v) => v != null || '必选'],
    },
    fileErrorText: '',
    isFileError: false,
    imageFile: null,
    VUE_APP_WEB_URL: process.env.VUE_APP_WEB_URL,
  }),
  watch: {
    imageFile: {
      handler(cur) {
        if (cur) {
          this.form.focusMapUrl = ''
          this.isFileError = false
          this.fileErrorText = ''
          // rss
          this.getFileUrl(cur)
        }
      },
    },
  },
  computed: {
    items() {
      return [
        {
          text: '首页',
          value: 0,
        },
        {
          text: '市场',
          value: 1,
        },
        {
          text: '转售',
          value: 2,
        },
      ]
    },
    headers() {
      return [
        {
          text: '焦点图名称',
          align: 'start',
          sortable: false,
          value: 'focusName',
        },
        { text: '图片', value: 'focusMapUrl' },
        { text: '链接', value: 'focusLink' },
        { text: '状态', value: 'numState' },
        { text: '添加时间', value: 'createTime', width: '180' },
        { text: '操作', value: '_actions', align: 'center' },
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
        limit: 10,
        mallCode,
        pageNum,
      }
      getBannerList(params)
        .then((res) => {
          this.list = res.data.list
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    onRefresh: debounce(function () {
      this.page = 1
      this.getData()
    }, 300),
    onEdit(rowData) {
      console.log('打开编辑')
      this.isEditing = true
      this.isShowDialog = true
      getBannerData({}, rowData.id).then((res) => {
        this.form = res.data
        delete this.form.id
      })
    },
    onUpdate: debounce(function () {
      updateBanner(this.form).then((res) => {
        this.$store.commit('TOGGLE_SNACKBAR', {
          bool: true,
          msg: '更新成功',
        })
        this.closeDialog()
        this.getData(1)
      })
    }, 300),
    getFileUrl(file) {
      let size = file.size
      let MB = size / (1024 * 1024)
      if (MB > 5) {
        this.isFileError = true
        this.fileErrorText = '文件大小不能超过5M'
        return
      }
      let form = new FormData()
      form.append('project', 'nft_adm')
      form.append('file_url', file)
      getRssUrl().then((res) => {
        this.form.focusMapUrl = this.VUE_APP_WEB_URL + res.data.file_url
      })
    },
    onTriggerState: debounce(function ({ id, numState }) {
      triggerBannerState({}, id).then((res) => {
        this.$store.commit('TOGGLE_SNACKBAR', {
          bool: true,
          msg: numState === 1 ? '禁用成功' : '启用成功',
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
          msg: '添加成功',
        })
      })
    },
    toOuterPage(rowData) {
      window.open(rowData.focusLink, '_blank')
    },
    onConfirm: debounce(function () {
      if (!this.$refs.form.validate()) return
      this.onAdd()
      this.closeDialog()
    }, 300),
    closeDialog() {
      this.isShowDialog = false
      this.isEditing = false
      this.$refs.form.reset()
      this.form.focusMapUrl = ''
    },
  },
}
</script>

<style scoped lang="stylus">
.refresh-btn
  height 38px !important
</style>
