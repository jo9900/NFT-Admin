export const maskingAddress = (account, prefix = 6, suffix = 4) => {
  if (typeof account === 'string') {
    if (account.length <= 10) return account
    let str = ''
    str = account.substring(0, prefix)
    str = str + '...'
    str = str + account.substring(account.length - suffix)
    return str
  }
  return ''
}
