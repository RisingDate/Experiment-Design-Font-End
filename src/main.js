import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as echarts from 'echarts';

const app = createApp(App)

app.config.globalProperties.$echarts = echarts
app.use(ElementPlus)
app.mount('#app')

