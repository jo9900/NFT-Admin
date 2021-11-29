<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" md="4">
        <v-select
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
      <v-spacer />
      <v-col>
        <v-btn class="mx-2 float-right" color="indigo" dark fab small>
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
          <v-chip
            :color="item.numState === 1 ? 'indigo' : 'grey'"
            outlined
          >
            {{ item.numState | formatBannerState }}
          </v-chip>
        </template>
        <template v-slot:item.focusMapUrl="{ item }">
          <v-hover v-slot="{ hover }">
            <v-img :src="item.focusMapUrl" width="30" contain>
              <div class="align-self-center">
                <v-btn :class="{ 'show-btns': hover }" :color="transparent" icon>
                  <v-icon :class="{ 'show-btns': hover }" :color="transparent">
                    mdi-magnify-expand
                  </v-icon>
                </v-btn>
              </div>
            </v-img>
          </v-hover>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination
          v-model="page"
          color="primary"
          total-visible="8"
          :length="pageCount"
        ></v-pagination>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import { getBannerList } from '../api'
import {mallCode} from "../config";

export default {
  name: 'Banner',
  data: () => ({
    itemsPerPage: 10,
    page: 1,
    pageCount: 0,
    list: [],
    isLoading: false,
    transparent: 'rgba(255, 255, 255, 0)',
    selected: 0,
  }),
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
        { text: '添加时间', value: 'createTime' },
        { text: '操作', value: '_actions' },
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
      const params = {
        focusLocation: Number(this.selected),
        limit: 10,
        mallCode,
        pageNum,
      }
      getBannerList(params).then((res) => {
        this.list = res.data.list
      })
    },
  },
}
</script>

<style scoped></style>
