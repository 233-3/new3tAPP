<template>
	<view class="find">
		<view class="status_bar">
			<!-- 状态栏占位 -->
		</view>
		<view class="title" style="margin-top: 20px;">
			<text>在线测试</text>
			<text></text>
		</view>
		<view class="top-list">
			<view @click="$isLogin() ? $u.route('pages/tongbusijuan/tongbusijuan') : $goLogin()">
				<image src="../../static/01301.png" mode=""></image>
				<view>精品试卷</view>
			</view>
			<view @click="$isLogin() ? $u.route('pages/testCenter/mrylList') : $goLogin()">
				<image src="../../static/01302.png" mode=""></image>
				<view>每日一练</view>
			</view>
			<view @click="$isLogin() ? $u.route('pages/errbookList/errbookList') : $goLogin()">
				<image src="../../static/01303.png" mode=""></image>
				<view>错题本</view>
			</view>
		</view>
		<!-- <view class="math">
			<view class="qt" @click="$isLogin() ? $u.route('pages/testCenter/dkzy') : $goLogin()">
				<image src="../../static/tzkc-dkzy.png" alt="" class="sxqt"></image>
			</view>
			<view class="gs">
				<view id="mjjs" @click="$isLogin() ? $u.route('pages/tongbusijuan/tongbusijuan') : $goLogin()">
					<image src="../../static/tzkc-jpsj.png" alt="" class="mjjs"></image>
				</view>
				<view id="qwgs" @click="$isLogin() ? $u.route('pages/testCenter/mrylList') : $goLogin()">
					<image src="../../static/tzkc-mryl.png" alt="" class="qwgs"></image>
				</view>
			</view>
		</view> -->
		
		<view class="title">
			<text>打卡作业</text>
			<text></text>
		</view>
		
		<view class="eng" id="yy" style="margin-bottom: 25px;"  @click="$isLogin() ? $u.route('pages/testCenter/dkzy') : $goLogin()">
			<image src="../../static/01304.png" mode="widthFix"></image>
		</view>
		
		<view class="title">
			<text>英语</text>
			<text>听、说、读、写，畅游英语世界！</text>
		</view>
		
		<view class="eng" id="yy" @click="$isLogin() ? $u.route('pages/testCenter/tingduList') : $goLogin()">
			<image src="../../static/tzkc-tdyl.png" mode="widthFix"></image>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onShow() {
		},
		methods:{
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.top-list{
		display: flex;
		margin: 43rpx 0 60rpx;
		view{
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			image{
				width: 130rpx;
				height: 130rpx;
			}
			view{
				margin-top: 20rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: #767674;
			}
		}
	}
	.find{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 20rpx;
		left: 0;
		background: #FFFFFF;
		.title{
			width: 90%;
			margin: 0 auto;
			display: flex;
			align-items: flex-end;
			text{
				&:first-child{
					font-size: 45rpx;
					font-weight: 500;
					color: #333333;
					margin-right: 20rpx;
				}
				&:last-child{
					font-size: 24rpx;
					font-weight: normal;
					color: #999999;
				}
			}
		}
		.math{
			width: 90%;
			margin: 22px auto 41px auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.qt{
				width: 327rpx;
				height: 334rpx;
				margin-right: 34rpx;
				position: relative;
				image {
					width: 100%;
					height: 100%;
					border-radius: 10px;
				}
				text {
					width: 100%;
					position: absolute;
					bottom: 23px;
					left: 0;
					text-align: center;
					font-size: 17px;
					color: #fff;
				}
			}
			.gs{
				width: 336rpx;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				view{
					height: 177rpx;
					position: relative;
					margin-bottom: 20rpx;
					&:last-child{
						height: 163rpx;
					}
					image{
						display: block;
						width: 100%;
						height: 100%;
						border-radius: 10px;
					}
					text{
						position: absolute;
						font-size: 17px;
						color: #fff;
						right: 12px;
						bottom: 18px;
					}
				}
			}
		}
		.eng{
			width: 90%;
			// height: auto;
			margin: 27px auto 0 auto;
			position: relative;
			image{
				display: block;
				width: 100%;
				height: 100%;
				border-radius: 10px;
			}
		}
	}
</style>
