<template>
	<view class="mryl">
		<view class="mryl-top" v-if="topInfo">
			<image src="../../../static/mryl-left-xxjl.png" mode=""></image>
			<view>
				坚持练习{{topInfo.jcdkts}}天，战胜了{{topInfo.dbl}}%的同学哦！
			</view>
		</view>
		
		<view v-for="(item, index) in mrylInfo" :key="index" class="mryl-table">
			<view class="title">{{item.xk_mc}}</view>
			<view class="mryl-h" :style="{background:item.xk_mc == '英语' ? '#61BEFF' : '#FFCC00'}">
				<view>总数量</view>
				<view>作对</view>
				<view>做错</view>
				<view>得分率</view>
			</view>
			<view class="mryl-c">
				<view>{{item.sjzts}}</view>
				<view>{{item.zdts}}</view>
				<view>{{item.zcts}}</view>
				<view>{{(item.dfl).toFixed(2)}}%</view>
			</view>
		</view>
		<u-empty v-if="mrylInfo.length == 0 && topInfo== ''" text="暂无数据" mode="list" color="#333" icon-color="#333" margin-top="100"></u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mrylInfo:'',
				topInfo:''
			};
		},
		created(){
			this.getmrylInfo()
			this.getTopInfo()
		},
		methods:{
			getmrylInfo(){
				this.$u.post('mryl/selectJXHDMRYL',{
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					this.mrylInfo = res
					console.log(this.mrylInfo)
				}).catch(err=>console.log(err))
			},
			getTopInfo(){
				this.$u.post('daka/selectDKZY',{
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					this.topInfo = res
					console.log(this.topInfo)
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mryl{
		.mryl-table{
			margin-bottom: 30rpx;
			.title{
				font-size: 32rpx;
				font-weight: 500;
				color: #424242;
				margin: 30rpx 0;
			}
			.mryl-h{
				display: flex;
				background: #FFCC00;
				color: #FFFFFF;
				view{
					text-align: center;
					flex: 1;
					padding: 25rpx 0;
				}
			}
			.mryl-c{
				display: flex;
				view{
					text-align: center;
					flex: 1;
					padding: 25rpx 0;				
					border: 1rpx solid #BFBFBF;
				}
			}
		}
		.mryl-top{
			margin: 120rpx 0 60rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			image{
				width: 155rpx;
				height: 150rpx;
				margin-top: -90rpx;
			}
			padding: 44rpx 10rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #272A29;
			background: #FFCC00;
			border-radius: 55rpx;
			view{
				&::after{
					content: '';
					display: block;
					width: 478rpx;
					height: 17rpx;
					background: #FDAA43;
					opacity: 0.4;
					margin-top: -15rpx;
				}	
			}
			
		}
	}
</style>
