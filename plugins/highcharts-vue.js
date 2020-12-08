import Vue from 'vue'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'

Vue.use(HighchartsVue)

Highcharts.setOptions({
  lang: {
    thousandsSep: ','
  }
})
