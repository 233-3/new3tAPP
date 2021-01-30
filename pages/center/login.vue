<template>
	<view>
		<view class="fixed"></view>
		<view class="status_bar">
			<!-- 状态栏占位 -->
		</view>
		<view class="back" @click="goBack"><image src="../../static/back.png" mode=""></image></view>
		<view class="center-box">
			<image src="../../static/yxyx.png" class="title" mode="widthFix"></image>
			<u-input  :custom-style="inputbg"  placeholderStyle="color:#ffffff" :clearable="false" v-model="form.tel"  placeholder="请输入手机号" type="number"/>
			<u-input  :custom-style="inputbg"  placeholderStyle="color:#ffffff" :clearable="false" v-model="form.password"  :password-icon="false" type="password" placeholder="请输入密码" />
			<u-button @click="submit" :ripple="true" ripple-bg-color="#ffffff" shape="circle" class="submit">登录</u-button>
			<view class="about">
				<view @click="$u.route('pages/center/resetZCMM')">忘记密码</view>
				<view @click="$u.route('pages/center/register')">注册账号</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<view class="tkbox">
			<view>
				<u-icon @click="isC = !isC" v-if="isC" name="checkmark-circle-fill" color="#2979ff" size="28"></u-icon>
				<u-icon @click="isC = !isC" v-else name="checkmark-circle" color="#2979ff" size="28"></u-icon>
				<text>同意<text @click="show = !show">《大山云效服务条款及隐私协议》</text></text>
			</view>
		</view>
		<u-popup v-model="show"  mode="center">
			<view class="tkCenter">
				<h2>服务条款和隐私协议</h2>
				<view class="desc">
					在2020年度中工作突出，表现优异，特授予您本年度“优秀员工”称号，望继续努力，认真工作。在2020年度中工作突出，表现优异，特授予您本年度“优秀员工”称号，望继续努力，认真工作。在2020年度中工作突出，表现优异，特授予您本年度“优秀员工”称号，望继续努力，认真工作。在2020年度中工作突出，表现优异，特授予您本年度“优秀员工”称号，望继续努力，认真工作。
				</view>
				<view class="tx-btn">
					<view @click="isC = false;show = false">不同意</view>
					<view @click="isC = true;show = false">同意</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				isC:true,
				show:false,
				form: {
					tel: '15637850587',
					password: '123456'
				},
				inputbg:{
					color: '#FFFFFF ',
					background: 'url(../../static/input-bg.png) no-repeat top center',
					backgroundSize:' 100% 100%',
					height: '88rpx',
					textIndent: '26rpx',
					marginBottom:'28rpx'
				}
			};
		},
		onLoad() {
			// 单页面调用5+ Api
			// #ifdef APP-PLUS
			var page = this.$mp.page.$getAppWebview();
			page.setStyle({ popGesture: 'none' });
			// #endif
		},
		methods:{
			goBack(){
				this.$u.route({
					type:'tab',
					url:'pages/index/index'
				})
				// uni.navigateBack()
			},
			submit() {
				if(this.form.tel == '' || this.form.password == ''){
					this.$refs.uToast.show({
						title:'请输入用户名或密码',
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
				if(!this.isC){
					this.$refs.uToast.show({
						title:'请同意隐私协议后再提交',
						type: 'error',
					})
					return false
				}
				this.handleData()
			},
			handleData(){
				this.$u.post('/app/appLoginController/appLogin',{
					zh:this.form.tel,
					mm:this.form.password,
					flag:getApp().globalData.systemInfo.platform
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
									this.$u.route({
										type:'switchTab',
										url:'pages/index/index'
									})
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
		bottom: 60rpx;
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
		width: 229rpx;
		margin-top: 56rpx;
		margin-bottom: 40rpx;
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
		top: 70rpx;
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
		background:  url(../../static/login-bg.jpg) no-repeat top center;
		background-size: 100% ;
		z-index: -1;
	}
	.center-box{
		width: 582rpx;
		height: 732rpx;
		background: url(../../static/icon-kuang.png) no-repeat top center;
		background-size: 100% 100%;
		position: fixed;
		top: 390rpx;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 30rpx;
		padding: 50rpx;
	}
	.input-bg{
		
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
