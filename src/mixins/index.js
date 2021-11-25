const Mixins = {
  data: () => ({}),
  computed: {},
  methods: {
    formatGoodsType(type) {
      //  0 艺术 1 运动 2 娱乐 3 游戏 4 收藏品 100其他
      let map = {
        0: '艺术',
        1: '运动',
        2: '娱乐',
        3: '游戏',
        4: '收藏品',
        100: '其他',
      }
      return map[type]
    },
    formatGroundingState(type) {
      return type === 1 ? '在售' : '未售'
    },
  },
}
export default Mixins
