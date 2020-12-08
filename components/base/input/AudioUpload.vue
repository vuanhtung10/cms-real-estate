<template>
  <div class="image-uploader uploader-single">
    <el-upload
      :file-list="fileList"
      :multiple="false"
      :limit="1"
      :before-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :before-upload="beforeUpload"
      :headers="this.$axios.defaults.headers.common"
      :action="this.$axios.defaults.baseURL + '/media/upload-single-audio'"
      list-type="picture-card"
      name="audio"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import $ from 'jquery'
import { notify } from '~/utils/bootstrap-notify'

export default {
  name: 'AudioUpload',
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fileList: this.value
        ? [
            {
              name: this.value,
              url: require('~/assets/media/activity/audio.png')
            }
          ]
        : [],
      innerValue: null
    }
  },
  watch: {
    value(val) {
      this.fileList = val
        ? [{ name: val, url: require('~/assets/media/activity/audio.png') }]
        : []
      this.innerValue = val
    },
    innerValue(val) {
      this.$emit('input', val)

      if (val) {
        $(this.$el)
          .find('.el-upload')
          .hide()
      } else {
        $(this.$el)
          .find('.el-upload')
          .show()
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  },
  mounted() {
    if (this.innerValue) {
      $(this.$el)
        .find('.el-upload')
        .hide()
    } else {
      $(this.$el)
        .find('.el-upload')
        .show()
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.innerValue = null
    },
    beforeUpload(file) {
      const isIMG = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/mp4',
        'audio/vnd.wav'
      ].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 100

      if (!isIMG) {
        notify('Thông báo', 'Tập tin phải có định dạng mp3, mp4, wav!')
      }
      if (!isLt5M) {
        notify('Thông báo', 'Tập tin phải có kích thước nhỏ hơn 100MB!')
      }

      if (isIMG && isLt5M) {
        $(this.$el)
          .find('.el-upload')
          .hide()
        return true
      }

      return false
    },
    handleUploadSuccess(res, file) {
      this.innerValue = res.filePath
      this.$emit('getDuration', res.duration)
    }
  }
}
</script>

<style lang="scss">
.uploader-single {
  min-height: 133px;

  .el-list-enter,
  .el-list-leave-active {
    opacity: 0;
    transition: none;
  }
  .el-list-enter-active,
  .el-list-leave-active {
    transition: none;
  }
}
</style>
