<template>
  <b-button variant="primary" class="file-btn">
    <div v-if="loading">
      <b-spinner small></b-spinner>
      uploading...
    </div>
    <template v-else>
      <div>Ảnh nền</div>
      <input @change="upload" type="file" name="avatar"/></template
  ></b-button>
</template>

<script>
import { notify } from '~/utils/bootstrap-notify'

export default {
  name: 'ImageUploadBtn',
  props: {
    requireDimension: {
      type: Boolean,
      default: true
    },
    heightRequire: {
      type: Number,
      default: 1080
    },
    widthRequire: {
      type: Number,
      default: 1440
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    upload(event) {
      const file = event.target.files[0]
      const isIMG = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isIMG) {
        notify('Thông báo', 'Ảnh phải có định dạng jpeg,png,jpg!')
      }
      if (!isLt5M) {
        notify('Thông báo', 'Ảnh phải có kích thước nhỏ hơn 5MB!')
      }

      const img = new Image()

      img.src = window.URL.createObjectURL(file)

      img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight

        window.URL.revokeObjectURL(img.src)
        if (this.requireDimension) {
          if (width === this.widthRequire && height === this.heightRequire) {
            this.uploadToserver(file, { width, height })
          } else {
            notify('Thông báo', 'Ảnh phải có kích thước 1440x1080!')
          }
        } else {
          this.uploadToserver(file, { width, height })
        }
      }
    },
    async uploadToserver(file, dimension) {
      try {
        this.loading = true
        const formData = new FormData()
        formData.append('image', file)
        const { data } = await this.$axios.post(
          '/media/upload-single-image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        this.$emit('getDimension', dimension)
        this.$emit('uploadSuccess', data.filePath)
      } catch (e) {}
      this.loading = false
    }
  }
}
</script>
