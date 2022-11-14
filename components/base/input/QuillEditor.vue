<template>
  <validation-provider
    :vid="vid"
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ errors }"
    class="b-editor"
  >
    <b-form-group
      v-bind="$attrs"
      :label-class="required ? 'required' : null"
      :class="{ 'single-row': singleRow }"
    >
      <client-only>
        <quill-editor
          ref="quillEdit"
          v-model="innerValue"
          :options="editorOption"
          v-bind="$attrs"
          @image-added="handleImageAdded"
          :useCustomImageHandler="true"
          style="height:300px; padding-bottom: 15px"
          rows="3"
          max-rows="8"
        />
        <input
          id="quill-get-file"
          @change="handleImageAdded($event)"
          type="file"
        />
      </client-only>
      <b-form-invalid-feedback
        >{{ errors[0] || error }}
      </b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider
  },
  props: {
    vid: {
      type: String,
      default: null
    },
    rules: {
      type: [Object, String],
      default: ''
    },
    value: {
      type: null,
      default: null
    },
    error: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    singleRow: {
      type: Boolean,
      defautl: true
    }
  },
  data() {
    return {
      innerValue: '',
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [
                { align: '' },
                { align: 'center' },
                { align: 'right' },
                { align: 'justify' }
              ],
              ['link', 'image', 'video']
            ],
            handlers: {
              image() {
                document.getElementById('quill-get-file').click()
              }
            }
          },
          imageResize: {
            displaySize: true
          },
          imageDrop: true
        }
      }
    }
  },
  watch: {
    innerValue(newVal) {
      this.$emit('input', newVal)
    },
    value(newVal) {
      this.innerValue = newVal
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  },
  methods: {
    async handleImageAdded(e) {
      this.selectedFile = e.target.files[0]

      const form = new FormData()
      form.append('targetFolder', 'organization/')
      form.append('image', this.selectedFile)

      try {
        const { data } = await this.$axios.post(
          '/media/upload-single-image',
          form
        )
        if (data) {
          const url = data.filePath
          const range = this.$refs.quillEdit.quill.getSelection()
          this.$refs.quillEdit.quill.insertEmbed(range.index, 'image', url)
        }
      } catch (e) {
        console.log('e')
      }
    }
  }
}
</script>

<style scoped>
#quill-get-file {
  display: none;
}
</style>
