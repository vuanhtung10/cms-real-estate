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
      <vue-editor
        v-model="innerValue"
        :editor-toolbar="editorToolbar"
        @blur="emitBlur"
        v-bind="$attrs"
        :editorOptions="editorSettings"
        @image-added="handleImageAdded"
        :useCustomImageHandler="true"
        rows="3"
        max-rows="8"
      ></vue-editor>
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
    },
    editorToolbar: {
      type: Array,
      default: () => [
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' }
        ],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['image']
        /* ['link'] */
      ]
    }
  },
  data: () => ({
    innerValue: '',
    editorSettings: {
      modules: {
        imageDrop: true,
        imageResize: {}
      }
    }
  }),
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
    emitBlur() {
      this.$emit('blur')
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('image', file)
      try {
        const { data } = await this.$axios.post(
          '/media/upload-single-image',
          formData
        )
        if (data) {
          const url = data.filePath // Get url from response
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        }
      } catch (e) {
        console.log('e')
      }
    }
  }
}
</script>
