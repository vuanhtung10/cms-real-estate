<template>
  <div>
    <ValidationProvider v-slot="{ errors }" rules="required" tag="div">
      <input v-model="value" type="text" />
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
    <h1>tung</h1>
    <b-text-input-with-validation />
    <b-date-range-with-validation />
    <image-upload />
  </div>
</template>

<script>
// import RoleModal from '~/features/role/RoleModal'
import { ValidationProvider } from 'vee-validate'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation.vue'
import BDateRangeWithValidation from '~/components/base/input/BDateRangeWithValidation.vue'
import ImageUpload from '~/components/base/input/ImageUpload.vue'
export default {
  name: 'Testcomponent',
  // permission: ROLE_VIEW,
  components: {
    ValidationProvider,
    BTextInputWithValidation,
    BDateRangeWithValidation,
    ImageUpload
  },
  head() {
    return {
      //
    }
  },

  data() {
    return {
      //
    }
  },
  computed: {
    //
  },
  methods: {
    //
  }
}
</script>
