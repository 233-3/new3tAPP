<template>
	<view class="ddinfo">
		<u-navbar title="订单详情" back-icon-color="#000"  title-color="#000" :border-bottom="false"></u-navbar>
		<view class="fixed"></view>
		<view class="box">
			<image v-if="info.spmc == 'VIP-月卡'" mode="heightFix" class="left-img-xxk" src="../../../static/ddyueka.png" ></image>
			<image v-if="info.spmc == 'VIP-季卡'" mode="heightFix" class="left-img-xxk" src="../../../static/ddjika.png" ></image>
			<image v-if="info.spmc == 'VIP-半年卡'" mode="heightFix" class="left-img-xxk" src="../../../static/ddbnk.png" ></image>
			<image v-if="info.spfm" :src="info.spfm" mode="heightFix"></image>
			<view>
				<view class="title">{{info.spmc}}</view>
				<view class="jg">￥<text>{{info.gmje}}</text></view>
			</view>
		</view>
		<view class="list">
			<view class="list-wrapper title">
				<text>支付信息</text>
			</view>
			<u-line></u-line>
			<view class="list-wrapper">
				<text>优惠：</text>
				<text>-￥{{info.yhje}}</text>
			</view>
			<view class="list-wrapper">
				<text>实际支付：</text>
				<text style="color: #FD4141;">￥{{info.gmje}}</text>
			</view>
		</view>
		<view class="list">
			<view class="list-wrapper title">
				<text>订单信息</text>
			</view>
			<u-line></u-line>
			<view class="list-wrapper">
				<text>订单号：</text>
				<text>{{info.dddh}}</text>
			</view>
			<view class="list-wrapper">
				<text>付款时间：</text>
				<text>{{info.fksj}}</text>
			</view>
			<view class="list-wrapper">
				<text>付款类型：</text>
				<text>{{info.fkfs}}</text>
			</view>
			<view class="list-wrapper">
				<text>订单状态：</text>
				<text>{{info.ddzt}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:''
			};
		},
		onLoad(obj) {
			this.info = JSON.parse(obj.item)
			console.log(this.info)
		}
	}
</script>

<style lang="scss" scoped>
	.ddinfo{
		.box{
			padding: 33rpx 23rpx;
			background: #FFFFFF;
			border-radius: 15rpx;
			display: flex;
			align-items: center;
			image{
				// width: 324rpx;
				height: 191rpx;
				border-radius: 15rpx;
				margin-right: 25rpx;
			}
			view{
				.title{
					font-size: 30rpx;
					font-weight: 500;
					color: #333333;
					margin-bottom: 40rpx;
				}
				.jg{
					font-size: 22rpx;
					font-weight: 400;
					color: #FD4141;
					text{		
						font-size: 30rpx;
					}
				}
			}
		}
		.fixed{
			width: 100%;
			height:100%;
			position: fixed;
			top: 0;
			left: 0;
			background: #F4F5F7;
			z-index: -1;
		}
		.list{
			background: #FFFFFF;
			margin-top: 20rpx;
			.title{
				padding: 30rpx 20rpx !important;
				font-size: 28rpx!important;
				font-weight: bold!important;
				color: #333333!important;
				
			}
			.list-wrapper{
				padding: 20rpx;
				font-size: 26rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #868686;
				text{
					&:first-child{
						color: #333333;
					}
				}
				
			}
		}
	}
</style>
