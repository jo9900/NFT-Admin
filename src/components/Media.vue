<template>
  <div class="media-wrap">
    <div class="container">
      <v-img
        :src="$attrs.mediaUrl"
        v-if="type === 'img'"
        width="100%"
        height="100%"
        contain
      ></v-img>
      <audio
        v-if="type === 'sound'"
        ref="audioEL"
        class="content"
        controlslist="nodownload"
        loop
        preload="metadata"
        :src="$attrs.mediaUrl"
      ></audio>

      <video
        v-if="type === 'video'"
        ref="videoEL"
        class="video content"
        controlslist="nodownload"
        loop
        playsinline
        preload="metadata"
        style="border-radius: 0px"
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
  },
}
</script>

<style scoped lang="stylus">
</style>
