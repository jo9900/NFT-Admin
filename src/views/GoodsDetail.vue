<template>
  <div>
    <v-breadcrumbs :items="nav" />
    <v-card min-width="50vw" max-width="70vw" flat class="pa-8">
      <v-row>
        <v-col cols="3">作品名称</v-col>
        <v-col cols="9">{{ nftData.goodsName }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">作品类型</v-col>
        <v-col cols="9">{{ nftData.goodsType | formatGoodsType }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">作品图像</v-col>
        <v-col cols="9">
          <div @click="showExpandMedia(nftData.goodsUrl)">
            <vMedia :mediaUrl="nftData.goodsUrl" class="media-wrap" />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">描述</v-col>
        <v-col cols="9">{{ nftData.goodsDes }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">售价</v-col>
        <v-col cols="9">{{ nftData.goodsPrice }} {{ unit }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">版税</v-col>
        <v-col cols="9">{{ nftData.goodsRoyalties }} %</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">创作者</v-col>
        <v-col cols="9">{{ nftData.goodsAuthorName }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">拥有者</v-col>
        <v-col cols="9">{{ nftData.goodsOwnName }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">首次挂售时间</v-col>
        <v-col cols="9">{{ nftData.firstSellTime }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">最后成交时间</v-col>
        <v-col cols="9">{{ nftData.lastTransTime }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">作品状态</v-col>
        <v-col cols="9">{{
          nftData.groundingState | formatGroundingState
        }}</v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { getGoodsDetail } from '../api'
import { unit } from '../config'
import vMedia from '@/components/Media'
export default {
  name: 'GoodsDetail',
  components: { vMedia },
  data: () => ({
    unit: unit,
    nftData: {
      firstSellTime: '',
      goodsAuthor: '',
      goodsAuthorName: '',
      goodsDes: '',
      goodsName: '',
      goodsOwn: '',
      goodsOwnName: '',
      goodsPrice: 0,
      goodsRoyalties: 0,
      goodsType: 0,
      goodsUrl: '',
      groundingState: 0,
      id: 0,
      lastTransTime: '',
    },
  }),
  computed: {
    nav() {
      return [
        {
          text: '作品管理',
          disabled: false,
          href: '/goods',
        },
        {
          text: this.nftData.goodsName,
          disabled: false,
          href: `/detail/${this.nftData.id}`,
        },
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
    getData() {
      console.log(this.$route)
      const id = this.$route.params.id
      getGoodsDetail({}, id).then((res) => {
        this.nftData = res.data
      })
    },
    showExpandMedia(url) {
      console.log(url)
      window.open(url, '_blank')
    },
  },
}
</script>

<style scoped lang="stylus">
.media-wrap
  min-width: 100px;
  min-height: 100px;
  cursor pointer
</style>
