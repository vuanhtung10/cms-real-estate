<template>
  <div class="image-uploader uploader-single">
    <el-upload
      :file-list="fileList"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :headers="this.$axios.defaults.headers.common"
      :action="this.$axios.defaults.baseURL + '/media/upload-single-image'"
      list-type="picture-card"
      multiple
      name="image"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import { notify } from '~/utils/bootstrap-notify'

export default {
  name: 'ImageMultiUpload',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileList: [],
      innerValue: []
    }
  },
  watch: {
    innerValue(val) {
      this.$emit('input', val)
    }
  },
  created() {
    this.init(this.value)
  },
  methods: {
    init(value) {
      this.fileList = value.map((item) => ({ name: item, url: item }))
      this.innerValue = value
    },
    beforeUpload(file) {
      const isIMG = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isIMG) {
        notify('Thông báo', 'Ảnh phải có định dạng jpeg,png,jpg!')
      }
      if (!isLt5M) {
        notify('Thông báo', 'Ảnh phải có kích thước nhỏ hơn 5MB!')
      }

      if (isIMG && isLt5M) {
        return true
      }

      return false
    },
    handleUploadSuccess(res, file) {
      file.url = res.filePath
      this.innerValue.push(res.filePath)
    },
    handleRemove(file, fileList) {
      const index = this.innerValue.findIndex((item) => item === file.url)
      if (index !== -1) {
        this.innerValue.splice(index, 1)
      }
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
