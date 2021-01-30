<template>
	<view>
		<u-navbar title="修改手机号" back-icon-color="#000"  title-color="#000" :border-bottom="false"></u-navbar>
		<view class="fixed"></view>
		<view class="list">
			<view class="list-wrapper">
				<text>输入新手机号</text>
				<u-input v-model="xTel" placeholder="输入新手机号" :custom-style="{textAlign: 'right',color: '#999999'}"  />
			</view>
			<u-line></u-line>
			<view class="list-wrapper">
				<text>输入验证码</text>
				<view style="position: relative;">
					<u-input v-model="yzm"placeholder="" :custom-style="{textAlign: 'left',color: '#999999'}"  />
					<view @click="senYZM" v-if="time == 0" style="position: absolute;right: 24rpx;top:16rpx;color:#61BEFF;">发送验证码</view>
					<view v-else style="position: absolute;right: 24rpx;top:24rpx;color:#61BEFF">{{time}}秒后重新发送</view>
				</view>
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
				userInfo:'',
				yzm:'',
				xTel:'',
				time:0,
			};
		},
		onLoad() {
			this.userInfo = getApp().globalData.userInfo
		},
		methods:{
			senYZM(){
				if(this.xTel == '' || this.xTel.length != 11){
					this.$refs.uToast.show({
						title:'请输入正确的手机号码',
						type: 'error',
					})
					return false
				}
				this.$u.post('PhoneLoginController/getSMSCode',{
					sjh:this.xTel,
					lx:3
				}).then(res=>{
					if(!res.state){
						this.$refs.uToast.show({title:res.msg})
						return false
					}
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
