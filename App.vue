<script>
	export default {
		globalData: {
			userInfo: {
				xsid: 0,
				xsmc:'游客',
				xstx: require('@/static/login_img.png'),
				sfrb: 0,
				ygkc: JSON.stringify([])
			},
			systemInfo:{},
			shzt:'',
		},
		onLaunch: function() {
			// console.log('app初始化完成')
			this.getSystemInfo()
		},
		onShow: function() {
			this.getUserInfo()
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
						console.log(this.globalData.systemInfo)
						if(this.globalData.systemInfo.platform == 'ios'){
							this.globalData.systemInfo.platform = 1
							this.getSHZT()
						} else {
							this.globalData.systemInfo.platform = 0
						}
					}
				})
			},
			getSHZT(){
				this.$u.get('api/ACommonController/queryAPPZT').then(res=>{
					this.globalData.shzt = 0
				})
			},
			getUserInfo(){
				// console.log('app启动获取缓存数据')
				uni.getStorage({
				    key: 'userInfo',
				    success:  (res) => {
				//         console.log('获取缓存数据',res.data);
						this.globalData.userInfo = res.data
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import  "./static/animate.css";
	/*每个页面公共css */
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
