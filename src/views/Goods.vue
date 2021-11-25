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
      <template v-slot:item.apply_time="{ item }">
        {{ formatGoodsType(item.goodsType) }}
      </template>

      <template v-slot:item.apply_time="{ item }">
        {{ formatGroundingState(item.groundingState) }}
      </template>

      <template v-slot:item._actions="{ item }">
        <v-btn text @click="toDetail(item)">查看</v-btn>
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
        { text: '作品类型', value: 'goodsType' },
        { text: '作品图像', value: 'goodsUrl' },
        { text: `售价（${unit}）`, value: 'goodsPrice' },
        { text: '创作者', value: 'goodsAuthorName' },
        { text: '拥有者', value: 'goodsOwnName' },
        { text: '首次挂售时间', value: 'firstSellTime' },
        { text: '最后成交时间', value: 'lastTransTime' },
        { text: '作品状态', value: 'groundingState' },
        { text: '操作', value: '_actions' },
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
        limit: this.limit,
        pageNum: pageNum,
      }
      getGoodsList(params)
        .then((res) => {
          this.list = res.data.list
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    toDetail(rowData) {
      console.log( rowData );
      this.$router.push('/detail')
    }
  },
}
</script>

<style scoped></style>
