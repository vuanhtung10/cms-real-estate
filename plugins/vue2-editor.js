import Vue from 'vue'
import { VueEditor, Quill } from 'vue2-editor'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-vue'
// import VideoResize from 'quill-video-resize-module'
import VueSummernote from '~/components/base/VueSummernote'

Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)
// Quill.register('modules/VideoResize', VideoResize)

/* const Container = Quill.import('blots/block')

class DivShadowBlot extends Container {
  static create(value) {
    const node = super.create(value)
    node.setAttribute(
      'style',
      'border-radius: 4px;background-color: #FFFFFF;box-shadow: 0 12px 19px 0 rgba(60,128,209,0.09);'
    )
    return node
  }
}

DivShadowBlot.blotName = 'code-block'
DivShadowBlot.className = 'bg-shadow'
DivShadowBlot.tagName = 'div'

Quill.register(DivShadowBlot) */
Vue.component('vue-editor', VueEditor)
Vue.component('vue-summernote', VueSummernote)
