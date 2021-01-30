import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

Vue.prototype.$errImg = require('@/static/icon-error.jpg')
Vue.prototype.$action = 'http://192.168.2.101/upload'
Vue.prototype.$resetInfo = function(xsid){
	this.$u.post('app/appLoginController/updateXueShengRedis',{
		xsid
	}).then(res=>{
		console.log(res)
		getApp().globalData.userInfo = res.data
		uni.setStorage({
		    key: 'userInfo',
		    data: res.data,
		})
	}).catch(err=>{
		console.log(this.$u.toast(err))
	})
}
Vue.prototype.$isLogin = function(){
	let flag
	let userInfo = getApp().globalData.userInfo
	userInfo.xsid == 0 ? flag = false : flag = true
	return flag
}
Vue.prototype.$goLogin = function(){
	uni.navigateTo({
		url:'/pages/center/login',
		complete(msg){
			console.log(msg)
		}
	})
}
Vue.prototype.$telXX = function(tel){
	var str = tel
	var enStr = str.slice(0,3) + '****' + str.slice(str.length - 4)
	return enStr
}
Vue.prototype.$nameXX = function(name) {
    let newStr;
    if (name.length === 2) {
    newStr = name.substr(0, 1) + '*';
    } else if (name.length > 2) {
      let char = '';
      for (let i = 0, len = name.length - 2; i < len; i++) {
        char += '*';
      }
      newStr = name.substr(0, 1) + char + name.substr(-1, 1);
    } else {
      newStr = name;
    }
    return newStr;
 }

const app = new Vue({
    ...App
})

//请求
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

app.$mount()