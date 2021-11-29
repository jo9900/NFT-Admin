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
      <template v-slot:item.numState="{ item }">
        {{ item.numState | formatOrderState }}
      </template>
      <template v-slot:item._actions="{ item }">
        <v-btn icon @click="toScan(item)">
          <v-icon>mdi-open-in-new</v-icon>
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
  </div>
</template>

<script>
import { mallWalletAddress, unit, scanHref } from '../config'
import { getOrders } from '../api'
export default {
  name: 'Orders',
  data: () => ({
    itemsPerPage: 10,
    page: 1,
    pageCount: 0,
    list: [],
    isLoading: false,
    transparent: 'rgba(255, 255, 255, 0)',

  }),
  created() {
    this.init()
  },
  computed: {
    headers() {
      return [
        {
          text: '订单编号',
          align: 'start',
          sortable: false,
          value: 'orderNo',
          width: '130'
        },
        { text: '作品名称', value: 'goodsName' },
        { text: '作品类型', value: 'goodsType', width: '130' },
        { text: '作品图像', value: 'goodsUrl' },
        { text: `成交价（${unit}）`, value: 'orderDPrice', align: 'right' },
        { text: '挂售者', value: 'orderSellerName', width: '130' },
        { text: '买入者', value: 'orderBuyerName', width: '130' },
        { text: '订单状态', value: 'numState', width: '130' },
        { text: '成交时间', value: 'transTime', width: '180' },
        { text: '操作', value: '_actions', align: 'center' },
      ]
    },
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
        mallWalletAddress: mallWalletAddress,
      }
      getOrders(params)
        .then((res) => {
          this.list = res.data.list
          this.pageCount = res.data.pageCount
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    toScan(rowData) {
      console.log(rowData)
      window.open(scanHref + 'tx/' + rowData.transHash, '_blank')
    },
  },
}
</script>

<style scoped></style>
