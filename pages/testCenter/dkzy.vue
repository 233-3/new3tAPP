<template>
	<view class="dkzy-box">
		<u-navbar back-icon-color="#fff" :border-bottom="false" :background="background">
			<view class="slot-wrap" slot="right" @click="show = !show">
				<image src="../../static/dkzy-sj2.png" mode=""></image>
				<text>{{month}}月</text>
			</view>
		</u-navbar>
		<u-picker mode="time" v-model="show"  :params="params" @confirm="timeConfirm"></u-picker>
		<view class="fixed"></view>
		<image src="../../static/dkzy-bg-top.jpg" class="dkzy-img" ></image>
		<view class="xk-box">
			<view v-for="(item, index) in xkList" :class="{'acxk':item.xkid == xkid}" :key="index" @click="xkid = item.xkid;page = 1;getListInfo()">{{item.xkmc}}</view>
		</view>
		<view class="list-box"  v-for="(item, index) in listInfo" :key="index">
			<view>
				<view class="title">{{item.dkmc}}</view>
				<view class="desc">
					<view>
						<image src="../../static/dkzy-sj.png"></image>
						<text>时间：{{item.dkkssj}} {{item.dkjssj}}</text>
					</view>
					<view>
						<image src="../../static/dkzy-ren.png"></image>
						<text>发布人：{{item.fbr}}</text>
					</view>
				</view>
				<view class="btn-box">
					<view class="btn-wrapper">
						<view class="zccs" v-if="$u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd') > item.dkjssj">
							<text>共打卡{{item.total}}天</text>
						</view>
						<button type="default"
						 v-if="$u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd') > item.dkjssj"
						 style="background: #FF8400;"
						 @click="goInfo(item)">已结束</button>
						<button type="default"
						 v-if="$u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd') < item.dkjssj && item.total <= 0"
						 style="background: #F5CB47;"
						  @click="goInfo(item)">开始打卡</button>
						  <button type="default"
						   v-if="$u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd') <= item.dkjssj && item.total >= 0"
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
				background: {
					background: "transpant"
				},
				xkList: '', //学科列表
				xkmc: '',
				xkid: '',
				page: 1,
				listInfo: '',
				show:false,
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				year:'',
				month:''
			};
		},
		onLoad() {
			this.getDate()
			this.getXKList()
		},
		onReachBottom() {
			this.getListInfo()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getListInfo()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 300)
		},
		methods: {
			goInfo(item){
				console.log(item)
				this.$u.route('pages/testCenter/dkzyInfo',{
					item:JSON.stringify(item)
				})
			},
			getDate(){
				let year = new Date().getFullYear()
				let month = new Date().getMonth() + 1
				month < 10 ? this.month = `0${month}` : this.month = month
				this.year = year
				console.log(this.year,this.month)
			},
			timeConfirm(val){
				console.log(val)
				this.page = 1
				this.year = val.year
				this.month = val.month
				this.getListInfo()
			},
			getXKList() {
				this.$u.post('api/ADKZYController/queryDKZYXKList', {
					param3: getApp().globalData.userInfo.xsid
				}).then(res => {
					if (res) {
						this.xkList = res
						this.xkList.unshift({
							xkmc: '全部',
							xkid: -1
						})
						this.xkmc = this.xkList[0].xkmc
						this.xkid = this.xkList[0].xkid
						this.getListInfo()
					}
				}).catch(err => console.log(err))
			},
			getListInfo() {
				this.$u.post('api/ADKZYController/queryDKZYList', {
					param1: this.page,
					param2: 5,
					param3: getApp().globalData.userInfo.xsid,
					xkid: this.xkid,
					param4:`${this.year}-${this.month}`
				}).then(res => {
					if (this.page == 1) {
						this.listInfo = res.rows
					} else {
						res.rows.forEach(val => {
							this.listInfo.push(val)
						})
					}
					this.page++
				}).catch(err => console.log(err))
			},
		}
	}
</script>

<style lang="scss" scoped>
	.dkzy-img{
		width: 100%;
		height: 344rpx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.dkzy-box {
		padding: 30rpx;

		.xk-box {
			width: 100%;
			height: 115rpx;
			background: url(../../static/dkzy-navbar.png) no-repeat top center;
			background-size: 100% 100%;
			margin-top: 100px;
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 0 20rpx;
			z-index: 99;
			view {
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}

		.list-box {
			padding: 41rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			margin-top: 31rpx;
			position: relative;
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

	.acxk {
		&::after {
			content: '';
			display: block;
			width: 65rpx;
			height: 11rpx;
			background: #F5CB47;
			margin-top: -10rpx;
			transition: all .5s ease;
		}

	}

	.slot-wrap {
		padding-right: 27rpx;
		image {
			width: 35rpx;
			height: 35rpx;
			vertical-align: middle;
			margin-right: 10rpx;
		}
		
		text {
			vertical-align: middle;
			font-size: 28rpx;
			color: #FFFFFF;
		}
	}

	.fixed {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #77d3f8;
		 // url(../../static/dkzy-bg.jpg) no-repeat top center
		background-size: 100% 100%;
		z-index: -1;
	}
</style>
