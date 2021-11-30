import { get, post } from '../axios/rss'

export const getRssUrl = (params) => {
  return post('rss/mgt/v1/file/upload', params)
}
