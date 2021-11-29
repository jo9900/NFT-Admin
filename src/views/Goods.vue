<template>
  <div>
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
      <template v-slot:item.goodsName="{ item }">
        <div class="text-truncate w180">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-chip v-bind="attrs" v-on="on">
                {{ item.goodsName }}
              </v-chip>
            </template>
            <span>{{ item.goodsName }}</span>
          </v-tooltip>
        </div>
      </template>

      <template v-slot:item.goodsType="{ item }">
        {{ item.goodsType | formatGoodsType }}
      </template>

      <template v-slot:item.goodsUrl="{ item }">
        <v-hover v-slot="{ hover }">
          <v-img :src="item.goodsUrl" width="30" contain>
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

      <template v-slot:item.groundingState="{ item }">
        <v-chip
          :color="item.groundingState === 1 ? 'indigo' : 'grey'"
          outlined
        >
          {{ item.groundingState | formatGroundingState }}
        </v-chip>
      </template>

      <template v-slot:item._actions="{ item }">
        <v-btn text @click="toDetail(item)">查看</v-btn>
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
  </div>
</template>

<script>
import { unit } from '../config'
import { getGoodsList } from '../api'

export default {
  name: 'goods',
  data: () => ({
    itemsPerPage: 10,
    page: 1,
    pageCount: 0,
    list: [],
    isLoading: false,
    transparent: 'rgba(255, 255, 255, 0)',
  }),
  computed: {
    headers() {
      return [
        {
          text: '作品名称',
          align: 'start',
          sortable: false,
          value: 'goodsName',
        },
        { text: '作品类型', value: 'goodsType', width: '130' },
        { text: '作品图像', value: 'goodsUrl' },
        { text: `售价（${unit}）`, value: 'goodsPrice', align: 'right' },
        { text: '创作者', value: 'goodsAuthorName', width: '130' },
        { text: '拥有者', value: 'goodsOwnName', width: '130' },
        { text: '首次挂售时间', value: 'firstSellTime', width: '180' },
        { text: '最后成交时间', value: 'lastTransTime', width: '180' },
        { text: '作品状态', value: 'groundingState' },
        { text: '操作', value: '_actions', align: 'center' },
      ]
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getData()
    },
    getData(pageNum = 1) {
      this.isLoading = true
      const params = {
        limit: this.itemsPerPage,
        pageNum: pageNum,
      }
      getGoodsList(params)
        .then((res) => {
          this.list = res.data.list
          this.pageCount = res.data.pageCount
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    toDetail(rowData) {
      this.$router.push('/detail/' + rowData.id)
    },
  },
}
</script>

<style scoped lang="stylus">
.w180
  max-width: 180px
</style>
