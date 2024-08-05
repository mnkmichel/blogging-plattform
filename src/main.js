import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router/router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


createApp(App).use(router).component('QuillEditor', QuillEditor).mount('#app')
