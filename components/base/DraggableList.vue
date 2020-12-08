<template>
  <div class="list-collapse">
    <b-form-group :label="formTitle" class="mb-2" label-class="required">
      <el-collapse v-model="activeNames">
        <draggable
          :list="innerValue"
          handle=".btn-collapse-draggable"
          animation="250"
        >
          <transition-group type="transition" name="list-answer">
            <el-collapse-item
              v-for="(answer, index) in innerValue"
              :key="answer.key"
              :name="answer.key"
            >
              <template slot="title">
                <span class="list-collapse__title"
                  >{{ label }} {{ index + 1 }} / {{ innerValue.length }} -
                  <span v-if="isMulti">{{ options[answer.type] || '' }}</span>
                  <span v-else>{{ answer[properties] | truncate }}</span></span
                >
                <span class="collapse-action">
                  <a
                    href="javascript:;"
                    class="btn-sm btn text-primary btn-bold btn-outline-hover-primary btn-collapse-draggable"
                    ><i class="fa fa-arrows"></i
                  ></a>
                  <a
                    href="javascript:;"
                    class="btn-sm btn text-danger btn-bold btn-outline-hover-danger"
                    ><i
                      @click.self="removeItem(answer)"
                      class="la la-trash-o"
                    ></i
                  ></a>
                </span>
              </template>
              <div class="list-item-script__item px-3">
                <slot v-bind:index="index"> </slot>
              </div>
            </el-collapse-item>
          </transition-group>
        </draggable>
      </el-collapse>
    </b-form-group>

    <b-dropdown v-if="isMulti" block variant="primary" menu-class="w-100">
      <template v-slot:button-content>
        <i class="la la-plus"></i> Thêm {{ label }}
      </template>

      <b-dropdown-item
        v-for="option in options"
        :key="option.type"
        @click="addItem(option.type)"
        href="javascript:;"
        >{{ option.label }}</b-dropdown-item
      >
    </b-dropdown>

    <b-button v-else @click="addItem" block variant="primary" size="sm"
      ><i class="la la-plus"></i> Thêm {{ label }}</b-button
    >
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import randomstring from 'randomstring'
import { truncate, isEmpty } from 'lodash'

export default {
  name: 'DraggableList',
  components: {
    draggable
  },
  filters: {
    truncate(value) {
      return truncate(value, {
        length: 60,
        separator: ' '
      })
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    formTitle: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    properties: {
      type: String,
      default: 'text'
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      innerValue: null,
      activeNames: []
    }
  },
  computed: {
    isMulti() {
      return this.options.length > 0
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    if (!isEmpty(this.value)) {
      this.innerValue = this.value
    } else {
      this.innerValue = [this.generateDefault()]
    }
  },
  methods: {
    addItem(type = null) {
      const item = this.generateDefault()
      if (type) {
        item.type = type
      }
      this.innerValue.push(item)
      this.activeNames.push(item.key)
    },
    removeItem(question) {
      const index = this.innerValue.findIndex(
        (item) => item.key === question.key
      )

      if (index !== -1) {
        this.innerValue.splice(index, 1)
      }
    },
    generateDefault() {
      return {
        key: randomstring.generate()
      }
    }
  }
}
</script>
