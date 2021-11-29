export const formatGoodsType = (type) => {
  //  0 艺术 1 运动 2 娱乐 3 游戏 4 收藏品 100其他
  let map = {
    0: '艺术',
    1: '运动',
    2: '娱乐',
    3: '游戏',
    4: '收藏品',
    100: '其他',
  }
  return map[type] || ''
}
export const formatGroundingState = (type) => {
  return type === 1 ? '在售' : '未售'
}
export const formatOrderState = (state)=> {
  //  状态字段 0 交易成功，1待支付，2交易中，3交易失败，4交易关闭
  let map = {
    0: '交易成功',
    1: '待支付',
    2: '交易中',
    3: '交易失败',
    4: '交易关闭'
  }
  return map[state] || ''
}
