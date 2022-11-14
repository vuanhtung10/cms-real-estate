<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('article.edit') : $t('article.add')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
    no-enforce-focus
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :label="$t('article.name')"
        :placeholder="$t('article.name')"
        :error="vForm.errors.get('name')"
        rules="required|max:100"
        name="name"
      />
      <b-text-area-with-validation
        v-model="form.description"
        :label="$t('article.description')"
        :placeholder="$t('article.description')"
        :error="vForm.errors.get('description')"
        rules="max:255"
        rows="5"
        name="description"
      />
      <b-text-input-with-validation
        v-model="form.view"
        :error="vForm.errors.get('view')"
        :label="$t('article.view')"
        :placeholder="$t('article.view')"
        rules="numeric"
        name="view"
      />
      <b-single-image-upload-with-validation
        v-model="form.thumbnail"
        label="Thumbnail (Tỉ lệ ảnh 16/9)"
        placeholder="Thumbnail"
      />
      <b-form-group>
        <el-switch v-model="form.is_recommend" active-text="Bài viết nổi bật">
        </el-switch>
      </b-form-group>
      <b-form-group>
        <el-switch v-model="form.is_published" active-text="Xuất bản">
        </el-switch>
      </b-form-group>
      <client-only>
        <b-form-group>
          <quill-editor
            v-model="form.content"
            :required="true"
            label="Nội dung"
            placeholder="Nội dung"
            rules="required"
            name="content"
            style="height: 500px"
          />
        </b-form-group>
      </client-only>
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'
import BSingleImageUploadWithValidation from '~/components/base/input/BSingleImageUploadWithValidation'

const defaultForm = {
  name: '',
  display_name: '',
  description: ''
}

export default {
  name: 'ArticleModal',
  components: {
    BTextAreaWithValidation,
    BTextInputWithValidation,
    BSingleImageUploadWithValidation,
    ValidationObserver
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      selected: null
    }
  },
  mounted() {},
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
      }

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.isEdit = false
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        if (this.isEdit) {
          await this.updateItem()
        } else {
          await this.addItem()
        }
      }
    },
    async addItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/article')

        notifyAddSuccess(this.$t('article.article'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('article.' + element.param)
              })
              this.vForm.errors.set(element.param, err)
            })
          } else {
            notifyTryAgain()
          }
        }
      }
    },
    async updateItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/article/' + this.form_id
        )

        notifyUpdateSuccess(this.$t('article.article'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('article.' + element.param)
              })
              this.vForm.errors.set(element.param, err)
            })
          } else {
            notifyTryAgain()
          }
        }
      }
    }
  }
}
</script>
