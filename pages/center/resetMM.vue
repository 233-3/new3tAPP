<template>
	<view>
		<u-navbar title="修改密码" back-icon-color="#000"  title-color="#000" :border-bottom="false"></u-navbar>
		<view class="fixed"></view>
		<view class="list">
			<view class="list-wrapper">
				<text>输入密码</text>
				<u-input v-model="ymm" placeholder="输入原密码" :custom-style="{textAlign: 'right',color: '#999999'}" type="password"  :password-icon="true" />
			</view>
			<u-line></u-line>
			<view class="list-wrapper">
				<text>输入新密码</text>
				<u-input v-model="xmm" placeholder="输入新密码" :custom-style="{textAlign: 'right',color: '#999999'}" type="password"  :password-icon="true" />
			</view>
		</view>
		<view class="submitMM" @click="submit">确定</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xmm:'',
				ymm:'',
				userInfo:'',
			};
		},
		onLoad() {
			this.userInfo = getApp().globalData.userInfo
		},
		methods:{
			submit(){
				if(this.ymm == '' || this.xmm == ''){
					this.$refs.uToast.show({
						type:'error',
						title:'请补全信息后重试'
					})
					return false
				}
				if(this.ymm != this.userInfo.xsmm){
					this.$refs.uToast.show({
						type:'error',
						title:'原密码错误，请重试'
					})
					return false
				}
				this.$u.post('grzx/updateMM',{
					xsid:this.userInfo.xsid,
					mm:this.xmm
				}).then(res=>{
					if(res.success){
						this.$refs.uToast.show({
							type:'success',
							title:res.message
						})
						setTimeout(()=>{
							uni.clearStorage();
							getApp().globalData.userInfo =  {
								xsid: 0,
								xsmc:'游客',
								xstx: require('@/static/login_img.png'),
								sfrb: 0,
								ygkc: JSON.stringify([])
							},
							this.$u.route('pages/center/login')
						},2000)
					} else {
						this.$u.toast(res.message)
					}
				}).catch(err=>this.$u.toast(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #F4F5F7;
		z-index: -1;
	}
	.submitMM{
		width: 688rpx;
		height: 77rpx;
		line-height: 77rpx;
		background: #61BEFF;
		font-size: 34rpx;
		font-weight: 400;
		color: #FFFEFE;
		text-align: center;
		margin: 212rpx auto 0;
		
	}
	.list{
		background: #FFFFFF;
		padding:0 20rpx;
		margin-top: 20rpx;
		.list-wrapper{
			padding: 45rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
