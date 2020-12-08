<template>
  <el-upload
    :limit="100"
    :on-success="handleUploadSuccess"
    :on-error="handleUploadError"
    :on-exceed="handleExceed"
    :before-upload="beforeUpload"
    :headers="this.$axios.defaults.headers.common"
    :action="this.$axios.defaults.baseURL + '/emoji/add'"
    class="upload-fullwidth"
    name="image"
    drag
    multiple
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      Kéo và thả hình ảnh vào đây hoặc <em>nhấn vào đây để tải ảnh lên</em>
      <br />
      Chỉ chấp nhận ảnh gif nhỏ hơn 5MB
    </div>
  </el-upload>
</template>

<script>
import { notify, notifyDanger } from '~/utils/bootstrap-notify'

export default {
  name: 'EmojiUpload',
  props: {
    onSuccess: {
      type: Function,
      default: () => null
    }
  },
  methods: {
    beforeUpload(file) {
      const isIMG = ['image/gif'].includes(file.type)
      const isLt5M = file.size / 1024 < 5000

      if (!isIMG) {
        notify('Thông báo', 'Ảnh phải có định dạng gif!')
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
    },
    handleUploadError(err, file) {
      notifyDanger(err.message)
    },
    handleExceed(file) {
      notifyDanger('Bạn chỉ được phép tải lên 100 file một lần')
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
