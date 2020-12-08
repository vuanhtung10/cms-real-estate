<template>
  <el-upload
    ref="uploadImage"
    :file-list="fileList"
    :before-upload="beforeUpload"
    :on-success="onSuccessFile"
    :headers="this.$axios.defaults.headers.common"
    :data="postData"
    :action="this.$axios.defaults.baseURL + '/review-activity-media/add'"
    name="image"
    multiple
    list-type="picture-card"
    class="select-upload-wrap"
  >
    <i class="el-icon-plus"></i>
    <div
      slot="file"
      slot-scope="{ file }"
      :class="
        innerSelectedImages.includes(file.url) ? 'selected-image-upload' : ''
      "
      class="item-el-upload"
    >
      <img
        :src="file.url"
        :alt="file.url"
        class="el-upload-list__item-thumbnail"
      />
      <span class="el-upload-list__item-actions"
        ><span @click="selectImage(file)" class="el-upload-list__item-preview"
          ><i class="el-icon-circle-check"></i
        ></span>
        <span @click="removeFile(file)" class="el-upload-list__item-delete"
          ><i class="el-icon-delete"></i></span
      ></span>
      <label
        v-if="innerSelectedImages.includes(file.url)"
        class="el-upload-list__item-status-label display__block"
        ><i class="el-icon-upload-success el-icon-check"></i
      ></label>
      <el-progress
        v-if="file.status === 'uploading'"
        :type="'line'"
        :stroke-width="2"
        :percentage="parseInt(file.percentage, 10)"
        class="mt-2"
      >
      </el-progress>
    </div>
  </el-upload>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { notify } from '~/utils/bootstrap-notify'

export default {
  name: 'ImageUploadSelection',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    dataImages: {
      type: Array,
      default: () => []
    },
    postData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fileList: [],
      innerSelectedImages: [],
      innerDataImages: []
    }
  },
  watch: {
    innerSelectedImages(newVal) {
      this.$emit('input', newVal)
    },
    dataImages(newVal) {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const dataImages = cloneDeep(this.dataImages)
      this.fileList = dataImages.map((item) => ({
        name: item._id,
        url: item.image
      }))
      this.innerSelectedImages = this.value
      this.innerDataImages = dataImages.map((item) => item.image)
    },
    removeFile(file) {
      this.$refs.uploadImage.handleRemove(file)
      this.removeFileFromOptions(file, this.innerSelectedImages)
      this.removeFileFromOptions(file, this.innerDataImages)
      this.$axios.$post('/review-activity-media/delete', {
        _id: file.name
      })
    },
    removeFileFromOptions(file, options) {
      const index = options.findIndex((item) => item === file.url)

      if (index !== -1) {
        options.splice(index, 1)
      }
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
    onSuccessFile(res, file, fileList) {
      file.url = res.image
      file.name = res._id
      this.innerDataImages.unshift(res.image)
    },
    selectImage(file) {
      if (this.innerSelectedImages.includes(file.url)) {
        this.removeFileFromOptions(file, this.innerSelectedImages)
      } else {
        this.innerSelectedImages.push(file.url)
      }
    }
  }
}
</script>
