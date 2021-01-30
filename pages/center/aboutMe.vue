<template>
	<view class="about-me">
		<u-navbar title="关于我们" back-icon-color="#000"  title-color="#000" :border-bottom="false"></u-navbar>
		<view class="fixed"></view>
		<view class="top">
			<image class="logo" src="../../static/touxiang.png" mode=""></image>
			<h2 class="title">云效优学</h2>
			<view class="desc">大山云效科技在完善线下教学产品的同时，全面升级效能教学云平台校长端、教师端以及学生端“云效优学”APP等线上平台，进一步提升服务，为各合作校快速实现转型提供全方位产品支持，实现线上线下管理、教学、学习相结合，进入高效经营时代！</view>
		</view>
		<view class="aboutMe-list">
			<view class="about-me-warpper">
				<text>公司名称</text>
				<text style="color: #407CF3;">大山云效科技</text>
			</view>
			<u-line></u-line>
			<view class="about-me-warpper">
				<text>公司地址</text>
				<text>河南省郑州市金水区中州大道</text>
			</view>
			<u-line></u-line>
			<view class="about-me-warpper">
				<text>联系电话</text>
				<text>400-717-5859</text>
			</view>
			<u-line></u-line>
			<view class="about-me-warpper">
				<text>官网网址</text>
				<text>http://yunxiaoedu.com</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
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
	.about-me{
		padding: 50rpx;
		.aboutMe-list{
			.about-me-warpper{
				display: flex;
				justify-content: space-between;
				font-size: 30rpx;
				font-weight: 400;
				color: #4D4D4D;
				padding: 32rpx 0;
			}
		}
		.top{
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin-bottom: 80rpx;
			.logo{
				width: 151rpx;
				height: 151rpx;
				border-radius: 30rpx;
				margin: 80rpx auto 32rpx;
				text-align: center;
			}
			.title{
				font-size: 45rpx;
				font-weight: 400;
				color: #000000;
				margin-bottom: 65rpx;
				text-align: center;
			}
			.desc{
				text-indent: 50rpx;
				font-size: 30rpx;
				font-family: SourceHanSansCN;
				font-weight: 400;
				color: #4C4C4C;
				line-height: 44rpx;
			}
		}
		
	}
</style>
