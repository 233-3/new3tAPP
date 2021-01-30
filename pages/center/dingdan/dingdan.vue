<template>
	<view class="dingdan">
		<u-navbar title="我的订单" back-icon-color="#ffffff"  title-color="#ffffff" :border-bottom="false" :background="background">
		</u-navbar>
		
		<view class="top">
			<text>总金额</text>
			<text>{{total ? total : 0}}</text>
			<!-- <text>24小时的自主消费订单可申请退款</text> -->
		</view>
		
		<view class="nav-box">
			<view @click="index = 0">
				<image src="../../../static/gmkc.png" mode="heightFix"></image>
				<text :class="{ac:index == 0}">购买的课程</text>
			</view>
			<view @click="index = 1">
				<image src="../../../static/xxk.png" mode="heightFix"></image>
				<text :class="{ac:index == 1}">购买的学习卡</text>
			</view>
		</view>
		
		<view class="kclist-box" v-if="index == 0">
			<view class="box" v-for="(item, index) in listInfo" :key="index" @click="$u.route('pages/center/dingdan/dingdanInfo',{item:JSON.stringify(item)})">
				<image class="left-img" :src="item.spfm" ></image>
				<view class="kclist-wrapper">
					<text class="title">{{item.spmc}}</text>
					<view class="gmsj">
						<image src="../../../static/icon-jc.png" mode=""></image>
						购买时间：
						<text>{{item.fksj}}</text>
					</view>
					<view class="jgbox">
						<text>
							￥
							<text>{{item.gmje}}</text>
						</text>
						<view>
							订单详情
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="xxk-box" v-if="index == 1">
			<view class="box" v-for="(item, index) in listInfo" :key="index" @click="$u.route('pages/center/dingdan/dingdanInfo',{item:JSON.stringify(item)})">
				<image v-if="item.spmc == 'VIP-月卡'" class="left-img-xxk" src="../../../static/ddyueka.png" ></image>
				<image v-if="item.spmc == 'VIP-季卡'" class="left-img-xxk" src="../../../static/ddjika.png" ></image>
				<image v-if="item.spmc == 'VIP-半年卡'" class="left-img-xxk" src="../../../static/ddbnk.png" ></image>
				<view class="kclist-wrapper-two">
					<text class="title">{{item.spmc}}</text>
					<view class="gmsj">
						<image src="../../../static/icon-jc.png" mode=""></image>
						购买时间：
						<text>{{item.fksj}}</text>
					</view>
					<view class="jgbox">
						<text>
							￥
							<text>{{item.gmje}}</text>
						</text>
						<view>
							订单详情
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-empty v-if="listInfo.length <= 0" text="暂无内容" color="#333333" iconColor="#333333" mode="list" margin-top="300"></u-empty>
		
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
				index:'',
				page:1,
				listInfo:'',
				total:''
			};
		},
		onLoad(obj) {
			this.index = obj.index
			// this.getDDList(this.index)
			this.getZJE()
		},
		onReachBottom() {
			console.log('~~')
			this.getDDList()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getDDList()
			setTimeout(()=>{
				uni.stopPullDownRefresh()
			},300)
		},
		watch:{
			index(){
				this.page = 1
				this.listInfo = []
				this.getDDList(this.index)
			}
		},
		methods:{
			getDDList(lx){
				this.$u.post('api/OrderController/queryList',{
					param1:this.page,
					param2:10,
					param3:getApp().globalData.userInfo.xsid,
					param12:lx
				}).then(res=>{
					if(this.page == 1) {
						this.listInfo = res.rows
					} else {
						res.rows.forEach(val=>{
							this.listInfo.push(val)
						})
					}
					this.page++
					console.log(this.listInfo)
				}).catch(err=>console.log(err))
			},
			getZJE(){
				this.$u.post('api/OrderController/queryDDTotal',{
					param3:getApp().globalData.userInfo.xsid,
				}).then(res=>{
					console.log(res)
					this.total = res.total
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dingdan{
		padding: 30rpx;
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
					height: 46rpx;
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
		.top{
			width: 222rpx;
			height: 222rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			border: 10rpx solid #FFFFFF;
			margin: 0 auto;
			border-radius: 50%;
			padding: 20rpx;
			text{
				&:nth-child(1){
					font-size: 30rpx;
					// margin-top: 88rpx;
					font-weight: 400;
					color: #FFFFFF;
				}
				&:nth-child(2){
					font-size: 57rpx;
					margin-top: 17rpx;
					font-weight: 400;
					color: #FFFFFF;
				}
				&:nth-child(3){		
					font-size: 24rpx;
					margin-top: 71rpx;
					font-weight: 400;
					color: #FFFFFF;
				}
			}
		}
		.xxk-box,
		.kclist-box{
			.box{
				box-sizing: border-box;
				padding: 48rpx 35rpx;
				margin-bottom: 30rpx;
				background: #FFFFFF;
				border-radius: 25rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left-img{
					width: 168rpx;
					height: 210rpx;
					border-radius: 6rpx;
				}
				.left-img-xxk{
					width: 285rpx;
					height: 212rpx;
					border-radius: 30rpx;
					margin-right: 20rpx;
				}
				.kclist-wrapper-two{
					width: 200rpx;
				}
				.kclist-wrapper-two,
				.kclist-wrapper{
					width: 420rpx;
					.title{
						margin-top: 19rpx;
						font-size: 30rpx;
						font-weight: 500;
						color: #333333;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.jgbox{
						margin-top: 51rpx;
						display: flex;
						justify-content: space-between;
						text{
							font-size: 22rpx;
							color: #FD4141;
							text{
								font-size: 30rpx;
							}
						}
						view{
							width: 185rpx;
							height: 51rpx;
							background: #FF8400;
							border-radius: 26rpx;
							text-align: center;
							line-height: 51rpx;
							font-size: 28rpx;
							font-weight: 500;
							color: #FFFFFF;
						}
					}
					.gmsj{
						margin-top: 35rpx;
						color: #666666;					
						font-size: 24rpx;
						image{
							width: 40rpx;
							height: 40rpx;
							margin-bottom: -8rpx;
						}
						text{
							color: #FF8400;
						}
					}
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
		background:#F4F5F7 url(../../../static/dd-bg.png) no-repeat top center;
		background-size: contain;
		z-index: -1;
	}
</style>
