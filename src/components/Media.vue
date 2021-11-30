<template>
  <div :class="type">
    <div class="media-container">
      <v-img
        :src="$attrs.mediaUrl"
        v-if="type === 'img'"
        width="100%"
        height="100%"
        contain
      ></v-img>
      <video
        v-if="type === 'sound'"
        controls=""
        :autoplay="false"
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
  },
}
</script>

<style scoped lang="stylus">
.sound
  background url("../assets/sound.png") center center no-repeat
</style>
