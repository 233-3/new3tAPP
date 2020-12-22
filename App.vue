<script>
	export default {
		globalData: {
			userInfo: {},
			systemInfo:{}
		},
		onLaunch: function() {
			// console.log('app初始化完成')
			this.getSystemInfo()
		},
		onShow: function() {
			// console.log('app启动')
		},
		onHide: function() {
			// console.log('从前台进入后台')
		},
		methods:{
			//获取系统相关信息
			getSystemInfo(){
				uni.getSystemInfo({
					success:(res)=> {
						this.globalData.systemInfo = res
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
