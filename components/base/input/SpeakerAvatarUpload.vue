<template>
  <el-upload
    :limit="10"
    :on-success="handleUploadSuccess"
    :before-upload="beforeUpload"
    :headers="this.$axios.defaults.headers.common"
    :action="this.$axios.defaults.baseURL + '/speaker-avatar/add'"
    class="upload-fullwidth"
    name="image"
    drag
    multiple
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      Kéo và thả hình ảnh vào đây hoặc <em>nhấn vào đây để tải ảnh lên</em>
      <br />
      Chỉ chấp nhận ảnh png nhỏ hơn 500kb, kích thước khuyến nghị là 64x64!
    </div>
  </el-upload>
</template>

<script>
import { notify } from '~/utils/bootstrap-notify'

export default {
  name: 'SpeakerAvatarUpload',
  props: {
    onSuccess: {
      type: Function,
      default: () => null
    }
  },
  methods: {
    beforeUpload(file) {
      const isIMG = ['image/png'].includes(file.type)
      const isLt5M = file.size / 1024 < 500

      if (!isIMG) {
        notify('Thông báo', 'Ảnh phải có định dạng png!')
        return false
      }
      if (!isLt5M) {
        notify('Thông báo', 'Ảnh phải có kích thước nhỏ hơn 500kb!')
        return false
      }

      return true
    },
    handleUploadSuccess(res, file) {
      this.onSuccess(res)
    }
  }
}
</script>

<style lang="scss">
.upload-fullwidth {
  .el-upload {
    display: block;
  }
  .el-upload-dragger {
    width: 100%;
  }
}
</style>
