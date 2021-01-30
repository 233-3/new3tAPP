<template>
	<view class="about-box">
		<u-navbar title="关于云优" back-icon-color="#000"  title-color="#000" :border-bottom="false">
		</u-navbar>
		<view class="fixed"></view>
		<view class="list">
			<view class="list-wrapper" @click="$u.route('pages/center/aboutMe')">
				<text>关于我们</text>
				<u-icon name="arrow-right"label-size="28rpx" color="#666666" size="28"></u-icon>
			</view>
			<u-line></u-line>
			<view class="list-wrapper">
				<text>清除缓存</text>
				<u-icon name="arrow-right"label-size="28rpx" color="#666666" size="28"></u-icon>
			</view>
		</view>
		<view class="list">
			<view class="list-wrapper">
				<text>版本更新</text>
				<u-icon name="arrow-right" label-size="28rpx" label="版本V1.0" label-pos="left" color="#666666" size="28"></u-icon>
			</view>
			<u-line></u-line>
			<view class="list-wrapper" @click="$u.route('pages/center/tiaokuan')">
				<text>服务条款</text>
				<u-icon name="arrow-right"label-size="28rpx" color="#666666" size="28"></u-icon>
			</view>
		</view>
		
		<view class="out" @click="out">退出账号</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			out(){
				uni.clearStorage();
				getApp().globalData.userInfo =  {
					xsid: 0,
					xsmc:'游客',
					xstx: require('@/static/login_img.png'),
					sfrb: 0,
					ygkc: JSON.stringify([])
				},
				this.$u.route('pages/center/login')
				console.log('out')
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
	.about-box{
		.list{
			background: #FFFFFF;
			padding:0 30rpx;
			margin-top: 20rpx;
			.list-wrapper{
				padding: 45rpx 0;
				display: flex;
				justify-content: space-between;
			}
		}
		.out{
			width: 610rpx;
			height: 74rpx;
			background: #61BEFF;
			border-radius: 37rpx;
			text-align: center;
			font-size: 38rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 74rpx;
			margin: 250rpx auto 0;
		}
	}
</style>
