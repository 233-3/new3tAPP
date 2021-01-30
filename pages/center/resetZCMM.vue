<template>
	<view>
		<view class="fixed"></view>
		<view class="status_bar">
			<!-- 状态栏占位 -->
		</view>
		<view class="back" @click="goBack"><image src="../../static/back.png" mode=""></image></view>
		<view class="center-box">
			<image src="../../static/xgmm.png" class="title" mode="widthFix"></image>
			<u-input  :custom-style="inputbg"  placeholderStyle="color:#ffffff" :clearable="false" v-model="form.tel"  placeholder="请输入手机号" type="number"/>
			<view style="position: relative;">
				<u-input  :custom-style="inputbg"  placeholderStyle="color:#ffffff" :clearable="false" v-model="form.yzm"  placeholder="请输入验证码" type="number"/>
				<view @click="senYZM" v-if="time == 0" style="position: absolute;right: 24rpx;top:24rpx;color:#FFFFFF">发送验证码</view>
				<view v-else style="position: absolute;right: 24rpx;top:24rpx;color:#FFFFFF">{{time}}秒后重新发送</view>
			</view>
			<u-input  :custom-style="inputbg"  placeholderStyle="color:#ffffff" :clearable="false" v-model="form.password"  :password-icon="false" type="password" placeholder="请输入密码" />
			<u-button @click="submit" :ripple="true" ripple-bg-color="#ffffff" shape="circle" class="submit">确定</u-button>
		</view>
		<u-toast ref="uToast" />

	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				form: {
					tel: '',
					password: '',
					yzm:'',
				},
				flag:getApp().globalData.systemInfo.platform,
				inputbg:{
					color: '#FFFFFF ',
					background: 'url(../../static/input-bg.png) no-repeat top center',
					backgroundSize:' 100% 100%',
					height: '88rpx',
					textIndent: '26rpx',
					marginBottom:'28rpx'
				},
				time:0,
			};
		},
		methods:{
			goBack(){
				uni.navigateBack()
			},
			senYZM(){
				if(this.form.tel == '' || this.form.tel.length != 11){
					this.$refs.uToast.show({
						title:'请输入正确的手机号码',
						type: 'error',
					})
					return false
				}
				this.$u.post('PhoneLoginController/getSMSCode',{
					sjh:this.form.tel,
					lx:2
				}).then(res=>{
					this.$refs.uToast.show({title:res.msg})
					console.log('发送成功')
					this.time = 60
					setInterval(()=>{
						if(this.time != 0){
							this.time--
						}
					},1000)
					return false
				}).catch(err=>{
					this.$refs.uToast.show({title:err})
				})
			},
			submit() {
				if(this.form.tel == '' || this.form.password == '' || this.form.yzm == ''){
					this.$refs.uToast.show({
						title:'请补全信息',
						type: 'error',
					})
					return false
				}
				if(this.form.tel.length != 11){
					this.$refs.uToast.show({
						title:'请输入正确的手机号码',
						type: 'error',
					})
					return false
				}
				if(this.form.password.length < 6){
					this.$refs.uToast.show({
						title:'密码至少输入六位',
						type: 'error',
					})
					return false
				}
				this.handleData()
			},
			handleData(){
				this.$u.post('app/appLoginController/bs_upMM',{
					xsdh:this.form.tel,
					xsmm:this.form.password,
					code:this.form.yzm,
					codelx:2,
				}).then(res=>{
					if(res.success){
						getApp().globalData.userInfo = res.data
						this.$refs.uToast.show({
							title: res.message,
							type: 'success',
						})
						//把用户信息存到缓存中
						uni.setStorage({
						    key: 'userInfo',
						    data: res.data,
						    success:  () => {
								setTimeout(()=>{
									this.$u.route('pages/center/login')
								},800)
						    }
						})
						
					} else {
						uni.showToast({
						    title: res.message,
						    position:'center',
							icon:'none'
						});
					}
				}).catch(err=>console.log(err))
			},
		},
	}
</script>

<style lang="scss" scoped>
	.tkCenter{
		padding: 60rpx;
		h2{
			font-size: 36rpx;
			font-weight: 400;
			color: #61BEFF;
			text-align: center;
			margin-bottom: 58rpx;
		}
		.desc{
			width: 500rpx;
			margin: 0 auto;
			font-size: 24rpx;
			font-family: SourceHanSansCN;
			font-weight: 400;
			color: #666666;
			line-height: 48rpx;
			text-indent:48rpx;
		}
		.tx-btn{
			display: flex;
			justify-content: space-between;
			margin-top: 85rpx;
			view{
				width: 206rpx;
				height: 68rpx;
				border-radius: 34rpx;
				font-size: 28rpx;
				text-align: center;
				line-height: 68rpx;
				&:first-child{
					border: 1px solid #BFBFBF;
					background: #FFFFFF;
					color: #666666;
				}
				&:last-child{	
					color: #FFFFFF;
					border: 1px solid #61BEFF;
					background: #61BEFF;
				}
			}
		}
	}
	.tkbox{
		position: fixed;
		bottom: 160rpx;
		left: 50%;
		transform: translateX(-50%);
		view{
			display: flex;
			flex-wrap: nowrap;
			text{
				font-size: 24rpx;
				color: #747474;
				white-space: nowrap;
				margin-left: 5rpx;
				text{
					white-space: nowrap;
					color: #16A6FF;
				}
			}
		}
	}
	.title{
		display: flex;
		justify-content: center;
		width: 229rpx;
		margin: 56rpx auto 40rpx;
	}
	.about{
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		margin-top: 28rpx;
		color: #FFFFFF;
		view {
			&:first-child{
				color: #747474;
			}	
		}
	}
	.back{
		position: fixed;
		top: 50rpx;
		left: 30rpx;
		image{
			width: 88rpx;
			height: 91rpx;
		}
	}
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background:  url(../../static/login-bg2.png) no-repeat top center;
		background-size:cover;
		z-index: -1;
	}
	.center-box{
		width: 582rpx;
		height: 740rpx;
		background: url(../../static/icon-kuang.png) no-repeat top center;
		background-size: 100% 100%;
		position: fixed;
		top: 268rpx;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 30rpx;
		padding: 50rpx;
	}
	.submit{
		background: url(../../static/submit-bg.png) no-repeat top center;
		background-size: 100%;
		color: #FFFFFF;
		font-size: 36rpx;
		color: #FFFFFF;
		border: none;
		outline: none;
		&:active{
			background: transparent;
		}
	}
	.u-hairline-border{
		&:after {
		    content: ' ';
		    position: absolute;
		    pointer-events: none;
		    box-sizing: border-box;
		    -webkit-transform-origin: 0 0;
		    transform-origin: 0 0;
		    left: 0;
		    top: 0;
		    width: 199.8%;
		    height: 199.7%;
		    -webkit-transform: scale(0.5, 0.5);
		    transform: scale(0.5, 0.5);
		    border: none;
		    z-index: 1;
		}
	}
</style>
