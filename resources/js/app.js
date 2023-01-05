import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './components/App.vue'

import '../sass/app.scss'

const app = createApp(App)
app.use(createPinia())
.mount('#app')
