import i18n from "@/locales";

export const formatGoodsType = (type) => {
  //  0 艺术 1 运动 2 娱乐 3 游戏 4 收藏品 100其他
  let map = {
    0: i18n.t('text68'),
    1: i18n.t('text69'),
    2: i18n.t('text70'),
    3: i18n.t('text71'),
    4: i18n.t('text72'),
    100: i18n.t('text73'),
  }
  return map[type] || ''
}
export const formatGroundingState = (type) => {
  return type === 1 ? i18n.t('text74') : i18n.t('text75')
}
export const formatOrderState = (state)=> {
  //  状态字段 0 交易成功，1待支付，2交易中，3交易失败，4交易关闭
  let map = {
    0: i18n.t('text76'),
    1: i18n.t('text77'),
    2: i18n.t('text78'),
    3: i18n.t('text79'),
    4: i18n.t('text80'),
  }
  return map[state] || ''
}

export const formatBannerState = (state)=> {
  //  启禁用状态 0 禁用 1 启用
  let map = {
    0: i18n.t('text81'),
    1: i18n.t('text82'),
  }
  return map[state] || ''
}
