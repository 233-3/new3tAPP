<template>
	<view class="jxhd">
		<u-navbar title="家校互动" back-icon-color="#000" :is-back="false"  title-color="#000" :border-bottom="false"></u-navbar>
		<view class="z-list-box">
			<view @click="inde = 0">
				<image src="../../static/icon-czjl.png" mode="heightFix"></image>
				<text>成长记录</text>
			</view>
			<view @click="inde = 1">
				<image src="../../static/icon-ktbx.png" mode="heightFix"></image>
				<text>课程表现</text>
			</view>
			<view @click="inde = 2">
				<image src="../../static/icon-wdxx.png" mode="heightFix"></image>
				<text>我的信息</text>
			</view>
		</view>
		<view class="line"></view>
		<view v-if="inde == 0">
			<view style="padding: 30rpx;">
				<view class="dj-box">
					<image :src="myPM.fdtp" mode="heightFix"></image>
					<view class="right">
						<view class="title">成长记录</view>
						<text class="dj">你现在是{{myPM.jfch}},</text>
						<text class="jf">学习积分共<text>{{myPM.xszjf}}</text>分，排名第<text>{{myPM.xspm}}</text>名！</text>
						<view class="btn" @click="$u.route('pages/jxhd/xxjl/xxjl')">学习记录</view>
					</view>
				</view>
			</view>
			<view class="phb">
				<scroll-view scroll-y="true" class="phb-wrapper">
					<view class="hader">
						<view>姓名</view>
						<view>称号</view>
						<view>积分</view>
						<view>排名</view>
					</view>
					<view class="content" v-if="phbList" v-for="(item, index) in phbList" :key="index">
						<view>
							<!-- <image class="tx" :src='item.fdtp'></image> -->
							<!-- <view style="flex: 1;"></view> -->
							{{item.xsmc.length == 11 ? $telXX(item.xsmc) : $nameXX(item.xsmc)}}
						</view>
						<view>{{item.jfch}}</view>
						<view>{{item.xszjf}}</view>
						<view>
							<image class="jp" v-if="item.xspm == 1" src="../../static/icon-one.png" mode=""></image>
							<image class="jp" v-if="item.xspm == 2" src="../../static/icon-two.png" mode=""></image>
							<image class="jp" v-if="item.xspm == 3" src="../../static/icon-three.png" mode=""></image>
							<text  v-if="item.xspm > 3">{{item.xspm}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<view v-if="inde == 1">
			<ktbx></ktbx>
		</view>
		<view v-if="inde == 2">
			<myMsg></myMsg>
		</view>
		
	</view>
</template>

<script>
	import myMsg from './myMsg.vue'
	import ktbx from './ktbx.vue'
	export default {
		data() {
			return {
				myPM:'',
				phbList:'',
				inde:0
			};
		},
		onShow(){
			if(!this.$isLogin()){
				this.$goLogin()
			}
			uni.getStorage({
			    key: 'inde',
			    success: (res)=>{
			        console.log(res.data);
					this.inde = 2
			    },
				fail:()=>{
					this.inde = 0
				}
			});
			
			
			this.getWDPM()
			this.getPHB()
		},
		onHide(){
			uni.removeStorage({
			    key: 'inde',
			    success: function (res) {
			        console.log('success');
			    }
			});
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
			getPHB(){
				this.$u.post('jiaoxiao/selectQBPM',{
					curr:1,
					limit:100
				}).then(res=>{
					this.phbList = res.rows
					// console.log(res)
				}).catch(err=>console.log(err))
			}
		},
		components:{
			myMsg,
			ktbx
		}
	}
</script>

<style lang="scss" scoped>
	.jxhd{
		.phb{
			width: 100%;
			height: 873rpx;
			background: url(../../static/phb.png) no-repeat top center;
			background-size: 100% 100%;
			padding: 200rpx 50rpx 50rpx;
			.phb-wrapper{
				height: 100%;
				width: 100%;
				.hader{
					display: flex;	
					font-size: 28rpx;
					font-weight: 400;
					color: #000000;
					opacity: 0.6;
					view{
						width: 25%;
						text-align: center;
						padding: 40rpx;
					}
				}
				.content{
					display: flex;
					view{
						width: 25%;
						text-align: center;
						overflow: hidden;
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 20rpx 0;
						&:first-child{
							padding: 20rpx;
							// justify-content: center;
							// overflow: auto;s
							// white-space: nowrap;
							// text-overflow: ellipsis;
							// overflow: hidden;
						}
						.jp{
							width: 32rpx;
							height: 40rpx;
						}
						.tx{
							width: 50rpx;
							height: 50rpx;
							background: #FFFFFF;
							border: 1px solid #EEEEEE;
							border-radius: 50%;
						}
					}
				}
			}
		}
		.dj-box{
			width: 100%;
			background: url(../../static/cz-bg.png) no-repeat top center;
			background-size: 100% 100%;
			display: flex;
			padding: 35rpx;
			image{
				height: 300rpx;
				margin-top: -100rpx;
			}
			.right{
				display: flex;
				flex-direction: column;
				.btn{
					align-self: flex-end;
					width: 173rpx;
					height: 45rpx;
					line-height: 45rpx;
					text-align: center;
					background: #86ECF8;
					border-radius: 23rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #5755EC;
				}
				.title{
					font-size: 48rpx;
					font-weight: bold;
					color: #FFFFFF;
					margin-bottom: 30rpx;
					&::after{
						content: ' ';
						display: block;
						width: 197rpx;
						height: 24rpx;
						background: #4341CA;
						border-radius: 3rpx;
						margin-top: -20rpx;
					}
				}
				text{
					font-size: 29rpx;
					font-weight: 400;
					color: #FFFFFF;
					text{
						color: #FFEC51;
						font-size: 35rpx;
					}
				}
			}
		}
		.line{
			width: 100%;
			height: 20rpx;
			background: #F4F5F7;
		}
		.z-list-box{
			display: flex;
			background: #FFFFFF;
			padding: 37rpx 0;
			view{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image{
					height: 108rpx;
				}
				text{
					font-size: 28rpx;
					font-weight: 400;	
					color: #2D2D2D;
					margin-top: 22rpx;
				}
			}
		}
	}
</style>
