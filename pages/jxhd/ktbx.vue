<template>
	<view class="ktbx">
		<view class="ktbx-wrapper">
			<view class="title">
				<image src="../../static/lk-zy.png" mode=""></image>
				<view>成长记录</view>
			</view>
			<view class="ri-box">
				<view class="title" style="margin-bottom: 45rpx;">
					<image src="../../static/yytime.png" mode="heightFix" style="margin-right: 5px;"></image>
					<view>{{thisTime}}</view>
				</view>
				<ren-calendar ref='ren' :markDays='markDays' :headerBar='false' :open="false" :disabledAfter="true" @onDayClick='onDayClick'></ren-calendar>
				<u-line margin="20px 0"></u-line>
				<view class="bzxx" v-for="(item, index) in bzxxList" :key="index" v-if="item.bzxx">
					· {{item.bzxx}}
				</view>
			</view>
		</view>
		<view class="line" v-if="bjqList.length > 0"></view>
		<view class="ktbx-wrapper" v-if="bjqList.length > 0">
			<view class="title">
				<image src="../../static/lk-zy.png" mode=""></image>
				<view>班级圈</view>
			</view>
			<view class="bjq-box">
				<view class="bjq-wrapper" v-for="(item, index) in bjqList" :key="index">
					<view class="bjq-top">
						<image src="../../static/bjq.png"></image>
						<view class="desc">{{item.ktbxnr}}</view>
					</view>
					<view class="bjq-bottom">{{item.ktbxsj}}</view>
				</view>
			</view>
		</view>
		<view class="noInfo" v-if="bjqList.length <= 0">
			<image src="../../static/xx-zwnr.png" mode="widthFix"></image>
			<view>暂无内容</view>
		</view>
	</view>
</template>

<script>
	import RenCalendar from '@/components/ren-calendar/ren-calendar.vue'
	export default {
		data() {
			return {
				bjqList:[],
				kqList:[],
				markDays:[],
				bzxxList:[],
			};
		},
		created() {
			this.getKQList()
			this.getBJQ()
			this.getKQBZ()
		},
		activated() {
			this.getBJQ()
			this.getKQBZ()
		},
		computed:{
			thisTime(){
				let date = new Date().valueOf()
				return this.$u.timeFormat(date,'yyyy-mm')
			},
		},
		methods:{
			onDayClick(data){
				// console.log(data.date);
			},
			//获取考勤备注
			getKQBZ(){
				this.$u.post('ktbx/selectQQXX',{
					xsid:getApp().globalData.userInfo.xsid,
					rq:this.thisTime,
				}).then(res=>{
					console.log(res)
					this.bzxxList = res
				}).catch(err=>console.log(err))
			},
			//获取考勤列表
			getKQList(){
				this.$u.post('ktbx/selectWDKQ',{
					xsid:getApp().globalData.userInfo.xsid,
					rq:this.thisTime,
				}).then(res=>{
					this.kqList = res
					for(var i=0; i<=this.kqList.length-1;i++){
						this.markDays.push(this.kqList[i])
					}
					console.log(this.markDays)
				}).catch(err=>console.log(err))
			},
			//班级圈信息
			getBJQ(){
				this.$u.post('ktbx/seletKTBX',{
					xsid:getApp().globalData.userInfo.xsid,
				}).then(res=>{
					this.bjqList = res
				}).catch(err=>console.log(err))
			}
		},
		components:{
			RenCalendar
		},
	}
</script>

<style lang="scss" scoped>
	.ktbx{
		.bjq-wrapper{
			margin: 25px 0;
			padding: 48rpx 28rpx;
			background: #FFFFFF;
			box-shadow: 0px 5rpx 27rpx 0px rgba(4, 0, 0, 0.09);
			border-radius: 10rpx;
			.bjq-bottom{
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
			.bjq-top{
				display: flex;
				margin-bottom: 36rpx;
				align-items: center;
				image{
					width: 28rpx;
					height: 28rpx;
					margin-right: 5px;
				}
				.desc{
					line-height: 52rpx;
					flex:1;
					font-size: 30rpx !important;
					font-weight: 400 !important;
					color: #2D2D2D !important;
				}
			}
		}
		.noInfo{
			margin: 100rpx 0 50rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			image{
				width: 272rpx;
			}
			view{
				margin-top: 37rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #CFCFCF;
			}
		}
		.ktbx-wrapper{
			padding: 30rpx;
		}
		.line{
			width: 100%;
			height: 20rpx;
			background: #F4F5F7;
		}
		.ri-box{
			background: #F9F8FD;
			border-radius: 10px;
			padding: 26rpx 26rpx 40rpx;
			margin: 26rpx 0;
			.bzxx{
				font-size: 24rpx;
				font-weight: 400;
				color: #383A49;
				line-height: 36rpx;
				margin: 17rpx 0;
			}
		}
		.title{
			display: flex;
			align-items: center;
			image{
				width: 54rpx;
				height: 59rpx;
				margin-right: 5rpx;
			}
			view{
				font-size: 30rpx;
				font-weight: 500;
				color: #2D2D2D;
			}
		}
	}
</style>
