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
              <v-chip v-bind="attrs" v-on="on" @click="toDetail(item)">
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

      <template v-slot:item.groundingState="{ item }">
        <v-chip :color="item.groundingState === 1 ? 'indigo' : 'grey'" outlined>
          {{ item.groundingState | formatGroundingState }}
        </v-chip>
      </template>

      <template v-slot:item._actions="{ item }">
        <v-btn text @click="toDetail(item)">{{ $t('text36') }}</v-btn>
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
import VMedia from '@/components/Media'

export default {
  name: 'goods',
  components: { VMedia },
  data: () => ({
    itemsPerPage: 10,
    page: 1,
    pageCount: 0,
    list: [],
    isLoading: false,
    isShowMedia: false,
    mediaUrl: '',
  }),
  computed: {
    headers() {
      return [
        {
          text: this.$t('text5'),
          align: 'start',
          sortable: false,
          value: 'goodsName',
        },
        { text: this.$t('text6'), value: 'goodsType', width: '130' },
        { text: this.$t('text7'), value: 'goodsUrl' },
        { text: `${this.$t('text18')}（${unit}）`, value: 'goodsPrice', align: 'right' },
        { text: this.$t('text20'), value: 'goodsAuthorName', width: '130' },
        { text: this.$t('text31'), value: 'goodsOwnName', width: '130' },
        { text: this.$t('text32'), value: 'firstSellTime', width: '180' },
        { text: this.$t('text33'), value: 'lastTransTime', width: '180' },
        { text: this.$t('text34'), value: 'groundingState' },
        { text: this.$t('text13'), value: '_actions', align: 'center' },
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
@import "~@/stylus/mediaExpand.styl"
.w180
  max-width: 180px
</style>
