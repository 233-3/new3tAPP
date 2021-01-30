<template>
	<view class="xxjl">
		<u-navbar title="学习记录" back-icon-color="#ffffff"  title-color="#ffffff" :border-bottom="false" :background="background">
			<view class="slot-wrap" slot="right">
				<view>分享</view>
			</view>
		</u-navbar>
		<view class="bg-box">
			<view class="title">我的排名</view>
			<view class="top">
				<text>{{myPM.xspm}}</text>
			</view>
			<view class="nav-box">
				<view class="nav-wrapper" @click="inde = 0">
					<view>
						<text>{{topInfo.wkxx ? topInfo.wkxx : 0}}</text> 节
					</view>
					<text>微课学习</text>
				</view>
				<view class="nav-wrapper" @click="inde = 1">
					<view>
						<text>{{topInfo.csjl ? topInfo.csjl : 0}}</text>套
					</view>
					<text>测试记录</text>
				</view>
				<view class="nav-wrapper"  @click="inde = 2">
					<view>
						<text>{{topInfo.mryl ? topInfo.mryl : 0}}</text>道
					</view>
					<text>每日一练</text>
				</view>
				<view class="nav-wrapper"  @click="inde = 3">
					<view>
						<text>{{topInfo.dkzy ? topInfo.dkzy : 0}}</text>天
					</view>
					<text>打卡作业</text>
				</view>
			</view>
		</view>
		<view style="padding: 30rpx;padding-top: 0;">
			<view v-if="inde == 0">
				<wkxx></wkxx>
			</view>
			<view v-if="inde == 1">
				<csjl></csjl>
			</view>
			<view  v-if="inde == 2">
				<mryl></mryl>
			</view>
			<view  v-if="inde == 3">
				<dkzy></dkzy>
			</view>
		</view>
		
		<view class="fixed"></view>
	</view>
</template>

<script>
	import wkxx from './wkxx.vue'
	import csjl from './csjl.vue'
	import mryl from './mryl.vue'
	import dkzy from './dkzy.vue'
	export default {
		data() {
			return {
				background:{
					background:'rgb(105 72 215)',
				},
				topInfo:'',
				myPM:'',
				inde:0
			};
		},
		onLoad() {
			this.getTOPInfo()
			this.getWDPM()
		},
		methods:{
			getWDPM(){
				this.$u.post('jiaoxiao/selectWDCZ',{
					xsId:getApp().globalData.userInfo.xsid
				}).then(res=>{
					this.myPM = res
					console.log(this.myPM)
				}).catch(err=>console.log(err))
			},
			getTOPInfo(){
				this.$u.post('jiaoxiao/selectXXJLFX',{
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					this.topInfo = res
				}).catch(err=>console.log(err))
			}
		},
		components:{
			wkxx,
			csjl,
			mryl,
			dkzy
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
		background:#FFFFFF;
		background-size: contain;
		z-index: -1;
	}
	.bg-box{
		padding: 30rpx;
		background:#FFFFFF url(../../../static/xxjl-bg.png) no-repeat top center;
		background-size: contain;
		padding-bottom: 0;
	}
	.xxjl{
		// padding: 30rpx;
		.slot-wrap{
			padding-right: 30rpx;
			view{
				width: 120rpx;
				height: 43rpx;
				line-height: 43rpx;
				text-align: center;
				background: linear-gradient(0deg, #8257FC, #B374F9);
				box-shadow: 0px 5rpx 9rpx 0px rgba(102, 48, 208, 0.29);
				border-radius: 22rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #FFFEFF;
			}
		}
		.title{
			font-size: 32rpx;
			font-weight: 400;
			color: #FFFFFF;
		}
		.nav-box{
			display: flex;
			box-shadow: 0px 3rpx 32rpx 0px rgba(0, 0, 0, 0.19);
			border-radius: 20rpx;
			background: #FFFFFF;
			padding: 60rpx 50rpx;
			margin-bottom: 56rpx;
			margin-top: 112rpx;
			.nav-wrapper{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				view{
					font-size: 24rpx;
					color: #999999;
					text{
						font-size: 36rpx;
						color: #F2514F;
						margin-right: 10rpx;
					}
				}
				text{
					font-size: 30rpx;
					font-weight: 400;
					color: #272A29;
					margin-top: 24rpx;
				}
			}
		}
		.top{
			display: flex;
			align-items: center;
			flex-direction: column;
			width: 276rpx;
			height: 276rpx;
			line-height: 300rpx;
			margin:24rpx auto;
			background: url(../../../static/paiming.png) no-repeat top center;
			background-size: 100% 100%;
			text{
				font-size: 64rpx;
				color: #ee911d;
			}
		}
	}
</style>
