<template>
	<view class="dkzy">
		<view class="dkzy-title">打卡最多的作业</view>
		<view class="list-box"  v-for="(item, index) in listInfo" :key="index">
			<view>
				<view class="title">{{item.dkmc}}({{item.dknrts}})</view>
				<view class="desc">
					<view>
						<image src="../../../static/dkzy-sj.png"></image>
						<text>时间：{{item.dkkssj}} {{item.dkjssj}}</text>
					</view>
					<view>
						<image src="../../../static/dkzy-ren.png"></image>
						<text>发布人：{{item.fbr}}</text>
					</view>
				</view>
				<view class="btn-box">
					<view class="btn-wrapper">
						<view class="zccs" v-if="item.dknrts > 0 && $u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd') > item.dkjssj">
							<text>共打卡{{item.dknrts}}天</text>
						</view>
						<button type="default"
						 v-if="$u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd') > item.dkjssj"
						 style="background: #FF8400;">已结束</button>
						<button type="default"
						 v-if="$u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd') < item.dkjssj && item.total <= 0"
						 style="background: #F5CB47;"
						  @click="goInfo(item)">开始打卡</button>
						  <button type="default"
						   v-if="$u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd') < item.dkjssj && item.total > 0"
						   style="background: #61BEFF;"
						    @click="goInfo(item)">打卡{{item.total}}天</button>
					</view>
				</view>
			</view>
		</view>
		<u-empty v-if="listInfo.length <= 0" text="暂无打卡作业" mode="list" color="#ffffff" icon-color="#ffffff" margin-top="100"></u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listInfo:''
			};
		},
		created(){
			this.getdkList()
		},
		methods:{
			getdkList(){
				this.$u.post('daka/selectDKTSLB',{
					xsid:getApp().globalData.userInfo.xsid,
					curr:1,
					limit:99
				}).then(res=>{
					this.listInfo = res.rows
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dkzy{
		.dkzy-title{
			margin: 10rpx 0;
			background: url(../../../static/lk-dp.png) no-repeat;
			background-size: 55rpx 65rpx;
			padding: 20rpx 0 20rpx 60rpx;
			font-size: 30rpx;
			font-weight: 500;
			color: #424242;
			&::after{
				content: '';
				display: block;
				width: 210rpx;
				height: 17rpx;
				background: #FFD14A;
				opacity: 0.4;
				margin-top: -15rpx;
			}
		}
		.list-box {
			padding: 41rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			margin-top: 32rpx;
			position: relative;
			box-shadow: 0px 3rpx 32rpx 0px rgba(0, 0, 0, 0.19);
			.title {
				font-size: 32rpx;
				color: #333333;
				margin-bottom: 36rpx;
			}
		
			.desc {
				display: flex;
				justify-content: flex-start;
				flex-direction: column;
				margin-bottom: 32rpx;
				view {
					margin-bottom: 16rpx;
					image {
						width: 27rpx;
						height: 27rpx;
						vertical-align: middle;
						margin-right: 2rpx;
					}
		
					text {
						vertical-align: middle;
						font-size: 24rpx;
						color: #999999;
					}
				}
			}
			.btn-box{
				display: flex;
				justify-content: flex-end;
				position: absolute;
				bottom: 30rpx;
				right: 30rpx;
				.btn-wrapper{
					display: flex;
					align-items: center;
					button{
						width: 184rpx;
						height: 51rpx;
						line-height: 51rpx;
						border-radius: 26rpx;
						font-size: 26rpx;
						color: #FEFEFE;
						border: none;
					}
					.zccs{
						margin-right: 20rpx;
						text{
							font-size: 22rpx;
							font-weight: 400;
							color: #FF8400;
						}
					}
				}
			}
		
		}
	}
</style>
