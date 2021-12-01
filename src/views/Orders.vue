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
      :no-data-text="$t('text3')"
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
        <VMedia
          :mediaUrl="item.goodsUrl"
          class="media-wrap"
        />
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
        @input="onClickPage"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { unit, scanHref } from '../config'
import { getOrders } from '../api'
import VMedia from '@/components/Media'

export default {
  name: 'Orders',
  components: { VMedia },
  data: () => ({
    itemsPerPage: 10,
    page: 1,
    pageCount: 0,
    list: [],
    isLoading: false,
  }),
  created() {
    this.init()
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('text4'),
          align: 'start',
          sortable: false,
          value: 'orderNo',
          width: '130',
        },
        { text: this.$t('text5'), value: 'goodsName' },
        { text: this.$t('text6'), value: 'goodsType', width: '130' },
        { text: this.$t('text7'), value: 'goodsUrl' },
        { text: `${this.$t('text8')}（${unit}）`, value: 'orderDPrice', align: 'right' },
        { text: this.$t('text9'), value: 'orderSellerName', width: '130' },
        { text: this.$t('text10'), value: 'orderBuyerName', width: '130' },
        { text: this.$t('text11'), value: 'numState', width: '130' },
        { text: this.$t('text12'), value: 'transTime', width: '180' },
        { text: this.$t('text13'), value: '_actions', align: 'center' },
      ]
    },
  },
  watch:{
    page:{
      handler(cur) {
        console.log( cur );
        if (cur) {
          this.getData(cur)
        }
      }
    }
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
        mallWalletAddress: this.$store.getters.getAccount,
      }
      getOrders(params)
        .then((res) => {
          this.list = res.data.list
          this.$nextTick(()=> {
            this.pageCount = res.data.pageCount
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    toScan(rowData) {
      console.log(rowData)
      window.open(scanHref + 'tx/' + rowData.transHash, '_blank')
    },
    onClickPage(clickedNum) {
      this.page = clickedNum;
    }
  },
}
</script>

<style scoped lang="stylus">
@import "~@/stylus/mediaExpand.styl"

</style>
