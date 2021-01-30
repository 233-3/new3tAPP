<template>
	<view class="jf">
		<u-navbar title="我的积分" back-icon-color="#ffffff"  title-color="#ffffff" :border-bottom="false" :background="background">
		</u-navbar>
		
		<view class="top">
			<text>{{topInfo.mc}}</text>
			<text>{{topInfo.xszjf}}积分</text>
		</view>
		
		<view class="nav-box">
			<view @click="index = 0">
				<image src="../../../static/jfgz.png" mode="heightFix"></image>
				<text>积分细则</text>
			</view>
			<view @click="index = 1">
				<image src="../../../static/jfxz.png" mode="heightFix"></image>
				<text>积分规则</text>
			</view>
		</view>
		
		<view v-if="index == 0" class="jfxz" style="background: #fff;border-radius: 10px;">
			<view class="jfxz-wrapper" v-for="(item, index) in listInfo" :key="index">
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>{{item.jfmc}}</text>
						<text>{{item.jfrq}}</text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					{{item.jflx == 1 ? '+' : '-'}}{{item.jfs}}积分
				</view>
			</view>
		</view>
		
		<view v-if="index == 1" class="jfxz" style="background: #fff;border-radius: 10px;">
			<view class="jfxz-wrapper" >
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>每日签到</text>
						<text></text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					＋5积分
				</view>
			</view>
			<view class="jfxz-wrapper" >
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>修改头像</text>
						<text></text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					＋5积分
				</view>
			</view>
			<view class="jfxz-wrapper" >
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>完善个人信息</text>
						<text></text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					＋10积分
				</view>
			</view>
			<view class="jfxz-wrapper" >
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>正常出勤</text>
						<text></text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					＋10积分
				</view>
			</view>
			<view class="jfxz-wrapper" >
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>看完一个视频</text>
						<text></text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					＋15积分
				</view>
			</view>
			<view class="jfxz-wrapper" >
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>作业和同步试卷</text>
						<text></text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					＋15积分
				</view>
			</view>
			<view class="jfxz-wrapper" >
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>每日一练</text>
						<text></text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					＋5积分/＋15积分/(提交/全对)
				</view>
			</view>
			<view class="jfxz-wrapper" >
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>打卡作业</text>
						<text></text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					＋5积分/＋15积分/(提交/全对)
				</view>
			</view>
			<view class="jfxz-wrapper" >
				<view class="left">
					<image src="../../../static/kcbxx.png" mode=""></image>
					<view>
						<text>好友分享</text>
						<text></text>
					</view>
				</view>
				<view class="right">
					<image src="../../../static/yyxx-jf.png" mode=""></image>
					＋15积分
				</view>
			</view>
		</view>
	

		
		<view class="fixed"></view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background:{
					background:'transparent',
				},
				index:0,
				topInfo:'',
				page:1,
				listInfo:''
			};
		},
		created() {
			this.getJFInfo()
			this.getJFList()
		},
		onReachBottom() {
			this.getJFList()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getJFList()
			setTimeout(()=>{
				uni.stopPullDownRefresh()
			},300)
		},
		methods:{
			getJFInfo(){	
				this.$u.post('api/FJFController/queryInfo',{
					param3:getApp().globalData.userInfo.xsid
				}).then(res=>{
					this.topInfo = res
				}).catch(err=>console.log(err))
			},
			getJFList(){
				this.$u.post('api/FJFController/queryList',{
					param1:this.page,
					param2:10,
					param3:getApp().globalData.userInfo.xsid
				}).then(res=>{
					if(this.page == 1) {
						this.listInfo = res.rows
					} else {
						res.rows.forEach(val=>{
							this.listInfo.push(val)
						})
					}
					this.page++
				}).catch(err=>console.log(err))
			},
		}
	}
</script>

<style lang="scss" scoped>
	.jf{
		padding: 30rpx;
		.top{
			width: 241rpx;
			height: 228rpx;
			margin: 45rpx auto 19rpx;
			display: flex;
			flex-direction: column;
			background: url(../../../static/jf-top.png) no-repeat top center;
			background-size: cover;
			align-items: center;
			text{
				&:first-child{
					margin-top: 75rpx;
					margin-bottom: 40rpx;
					font-size: 50rpx;
					font-weight: 800;
					color: #FFFFFF;
					text-shadow: 0px 7rpx 0px rgba(255, 133, 76, 0.53);
				}
				&:last-child{
					font-size: 28rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
		}
		.nav-box{
			display: flex;
			box-shadow: 0px 3rpx 32rpx 0px rgba(0, 0, 0, 0.19);
			border-radius: 20rpx;
			background: #FFFFFF;
			padding: 37rpx 0;
			margin-bottom: 56rpx;
			margin-top: 28rpx;
			view{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image{
					height: 78rpx;
				}
				text{
					font-size: 30rpx;
					font-weight: 400;
					color: #272A29;
					margin-top: 22rpx;
				}
				.ac{
					color: #FF8400;
				}
			}
		}
		.jfxz-wrapper{
			padding:33rpx 15rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F2F6FF;
			.left{
				display: flex;
				align-items: center;
				image{
					width: 61rpx;
					height: 61rpx;
					margin-right: 20rpx;
				}
				view{
					display: flex;
					flex-direction: column;
					justify-content: center;
					text{
						&:first-child{
							font-size: 28rpx;
							font-weight: 400;
							color: #333333;
							margin-bottom: 17rpx;
						}
						&:last-child{
							font-size: 20rpx;
							font-weight: 400;
							color: #999999;
						}
					}
				}
			}
			.right{
				image{
					width: 24rpx;
					height: 24rpx;
					margin-right: 5px;
				}
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				opacity: 0.7;
			}
		}
		.lr{
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			border-bottom: 1px solid #F2F6FF;
			    color: #333333;
		}
	}
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background:#FFFFFF url(../../../static/dd-bg.png) no-repeat top center;
		background-size: contain;
		z-index: -1;
	}
</style>
