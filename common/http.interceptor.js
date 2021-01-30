const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		// baseUrl: 'http://test.zzxiaoyi.com/', // 请求的本域名
		baseUrl: 'http://192.168.2.102/', // 请求的本域名
		dataType: 'json',
		showLoading: true, // 是否显示请求中的loading
		loadingText: '请求中...', // 请求loading中的文字提示
		loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
	});
	// 请求拦截部分，如配置，每次请求前都会执行，见上方说明
	Vue.prototype.$u.http.interceptor.request = (config) => {
		return config; 
	}
}
export default {
	install
}