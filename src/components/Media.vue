<template>
  <div :class="type">
    <div class="media-container"
         @click="showExpandMedia($attrs.mediaUrl)">
      <v-img
        :src="$attrs.mediaUrl"
        v-if="type === 'img'"
        class="content"
        contain
      ></v-img>
      <video
        v-if="type === 'sound'"
        controls=""
        :autoplay="false"
        class="content"
        name="media"
        loop
        muted="muted"
        controlslist="nodownload"
        preload="metadata"
      >
        <source :src="$attrs.mediaUrl" type="audio/mpeg" />
      </video>
      <video
        :autoplay="false"
        muted="muted"
        controls=""
        class="content"
        v-if="type === 'video'"
        controlslist="nodownload"
        loop
        playsinline
        preload="metadata"
      >
        <source :src="$attrs.mediaUrl" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
import { validatedMediaExt } from '../config'

export default {
  name: 'Media',
  data: () => ({
    type: '',
    mediaUrl: '',
  }),
  watch: {
    '$attrs.mediaUrl': {
      handler(cur) {
        if (cur) {
          this.mediaFileType(cur)
        }
      },
      immediate: true,
    },
  },
  methods: {
    mediaFileType(url) {
      let arr = url.split('.')
      const ext = arr[arr.length - 1].toLowerCase()
      for (let key in validatedMediaExt) {
        if (validatedMediaExt[key].includes(ext)) {
          this.type = key
          return
        }
      }
    },
    showExpandMedia(url) {
      window.open(url, '_blank')
    },
  },
}
</script>

<style scoped lang="stylus">
.media-container
  cursor pointer

.media-wrap
  ::v-deep .content
    max-width 100px
    height 30px
  ::v-deep .sound .content
    max-width 100px

</style>
