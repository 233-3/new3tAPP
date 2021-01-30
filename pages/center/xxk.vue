<template>
	<view class="xxk">
		<u-navbar title="我的VIP学习卡" back-icon-color="#000"  title-color="#000" :border-bottom="false"></u-navbar>
		<view class="userbox">
			<image class="tx" :src="userInfo.xstx ? userInfo.xstx : require('@/static/login_img.png')"  mode=""></image>
			<view>
				<text>{{userInfo.xsmc}}</text>
				<text v-if="userInfo.xssfvip">
					<image src="../../static/xxk-VIP.png" ></image>
					{{userInfo.xsvipsj}}到期，购买后有效期将延长
				</text>
			</view>
		</view>
		
		<view class="card-list">
			<view :class="{card:true,acActice:inde == index}" v-for="(item, index) in xxkList" :key="index" @click="handelXXk(item,index)">
				<!-- <image class="t" src="../../static/VIPyueka.png" mode="heightFix"></image> -->
				<text style="margin-bottom: 15rpx;">{{item.xxkmc}}</text>
				<text>￥{{item.xxkxj}}</text>
				<view>￥{{item.xxkyj}}</view>
				<image class="rb" src="../../static/xxkbg.png" mode=""></image>
			</view>
		</view>
		<view style="color: #999999;font-size: 12rpx;text-align: center;margin-bottom: 31rpx;">会员期间，可以重复学习和测试</view>
		
		<u-line></u-line>
		<view class="yhj">
			<view class="yhj-title">优惠券（{{yhjList.length}}）</view>
			<view class="yhj-lsit" >
				<view :class="{'list':true,'list-ac':index == indes}" v-for="(item, index) in yhjList" :key="index" @click="handelyhj(item,index)">
					<view class="list-left">
						<text>{{item.yhqmc}}</text>
						<text>{{item.dqsj}}到期</text>
					</view>
					<view class="list-right">
						<text>{{item.yhqje}}</text>
						<text>元</text>
					</view>
				</view>
				<view v-if="yhjList.length == 0" style=";margin: 20rpx auto;display: flex;justify-content: center;">
					<image src="../../static/noyhj.png" style="width: 226rpx;" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<u-line></u-line>
		
		<view class="paybox">
			<view class="pay-wrapper" @click="pay = 0">
				<view class="desc">
					<image src="../../static/weixin.png" mode=""></image>
					微信支付
				</view>
				<view :class="{isac:true,acpay:pay == 0}">
					<u-icon name="checkbox-mark" color="#ffffff" size="16"></u-icon>
				</view>
			</view>
			<view class="pay-wrapper" @click="pay = 1">
				<view class="desc">
					<image src="../../static/zhifupingtai-zhifubao.png" mode=""></image>
					支付宝支付
				</view>
				<view :class="{isac:true,acpay:pay == 1}">
					<u-icon name="checkbox-mark" color="#ffffff" size="16"></u-icon>
				</view>
			</view>
		</view>
		<view class="pay-btn" @click="send" v-if="xxkList[inde]">
			立即支付{{je}}元
			<view v-if="yhjList.length > 0">
				（节省{{xxkList[inde].xxkyj - je}}元）
			</view>
		</view>
		<u-popup v-model="fsShow" mode="center" width="200px" border-radius="14" @close="resetInfo()">
			<view class="paybox" style="display: flex;justify-content: center;flex-direction: column;align-items: center;">
				<u-icon name="checkmark" size="50" color="#3AA8FF"></u-icon>
				<text style="text-align: center;margin: 10px;">支付完成</text>
				<view class="payBtn" @click="resetInfo()">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pay:0, //1支付宝 0微信
				xxkList:[],
				inde:0,
				indes:0,
				yhjList:[],
				userInfo:'',
				isQ:'',
				fsShow:false,
			};
		},
		created() {
			this.userInfo = getApp().globalData.userInfo
			this.getXXKList()
			this.getYHJ()
		},
		computed:{
			je(){
				let vip = Number(this.xxkList[this.inde].xxkxj)
				if(this.yhjList.length > 0){
					if(this.yhjList[this.indes] && this.xxkList[this.inde]){
						let yhj = Number(this.yhjList[this.indes].yhqje)
						let a = vip - yhj
						return (vip - yhj).toFixed(2)
					}
				}else {
					return vip.toFixed(2)
				}
			}
		},
		methods:{
			resetInfo(){
				this.$u.post('app/appLoginController/updateXueShengRedis',{
					xsid:this.userInfo.xsid
				}).then(res=>{
					console.log('前',getApp().globalData.userInfo)
					console.log('返回的数据',res.data)
					getApp().globalData.userInfo = res.data
					uni.setStorage({
					    key: 'userInfo',
					    data: res.data,
					})
					uni.navigateBack()
					console.log('后',getApp().globalData.userInfo)
				}).catch(err=>{
					console.log(this.$u.toast(err))
				})
			},
			//微信支付
			wxPay(){
				let yhje,yhid
				if(this.yhjList.length > 0 ){
					yhje = this.yhjList[this.indes].yhqje
					yhid = this.yhjList[this.indes].yhid
				} else {
					yhje = 0
					yhid = 0
				}
				this.$u.post('/wxpay/WXPay',{
					spmc:this.xxkList[this.inde].xxkmc,
					gmje:this.je,
					ddlx:0  ,//1课程 0x学习卡
					spxj:this.xxkList[this.inde].xxkxj,
					yhlx:this.isQ ,  // 0无 1 卷 2 码
					yhje:yhje,
					xsid:getApp().globalData.userInfo.xsid,
					fkfs:0,      //1zfb 0 wx
					spid:this.xxkList[this.inde].xxkid,
					yhid:yhid
				}).then(res=>{
					console.log(res)
					uni.requestPayment({
					    provider: 'wxpay',
					    orderInfo: res.map, //微信、支付宝订单数据
					    success: (res)=> {
					        console.log('success:' + JSON.stringify(res));
							this.getXXKList()
							this.getYHJ()
							this.resetInfo()
					    },
					    fail:(err)=>{
					        console.log('fail:' + JSON.stringify(err));
					    }
					});
				}).catch(err=>console.log(err))
			},
			//支付宝支付
			aliPay(){
				let yhje,yhid
				if(this.yhjList.length > 0 ){
					yhje = this.yhjList[this.indes].yhqje
					yhid = this.yhjList[this.indes].yhid
				} else {
					yhje = 0
					yhid = 0
				}
				this.$u.post('/zfbpay/ZFBPay',{
					spmc:this.xxkList[this.inde].xxkmc,
					gmje:this.je,
					ddlx:0  ,//1课程 0x学习卡
					spxj:this.xxkList[this.inde].xxkxj,
					yhlx:this.isQ ,  // 0无 1 卷 2 码
					yhje:yhje,
					xsid:getApp().globalData.userInfo.xsid,
					fkfs:1,      //1zfb 0 wx
					spid:this.xxkList[this.inde].xxkid,
					yhid:yhid
				}).then(res=>{
					console.log(res)
					uni.requestPayment({
					    provider: 'alipay',
					    orderInfo: res, //微信、支付宝订单数据
					    success:(res)=>{
					        console.log('success:' + JSON.stringify(res));
							this.getXXKList()
							this.getYHJ()
							this.resetInfo()
					    },
					    fail:(err)=> {
					        console.log('fail:' + JSON.stringify(err));
							this.$u.toast('失败，请重试')
					    }
					});
				}).catch(err=>console.log(err))
			},
			iosPay(){
				setTimeout(()=>{
					this.fsShow = true
				},2000)
				let yhje,yhid
				if(this.yhjList.length > 0 ){
					yhje = this.yhjList[this.indes].yhqje
					yhid = this.yhjList[this.indes].yhid
				} else {
					yhje = 0
					yhid = 0
				}
				let obj = {
					spmc:this.xxkList[this.inde].xxkmc,
					gmje:this.je,
					ddlx:0  ,//1课程 0x学习卡
					spxj:this.xxkList[this.inde].xxkxj,
					yhlx: this.isQ,  // 0无 1 卷 2 码
					yhje:yhje,
					xsid:getApp().globalData.userInfo.xsid,
					fkfs:0,      //1zfb 0 wx
					spid:this.xxkList[this.inde].xxkid,
					kcfm:this.xxkList[this.inde].kc_fm,
					spyj:this.xxkList[this.inde].xxkyj,
					yhid:yhid
				}
				this.$u.route('pages/test/iosPay',{
					obj:JSON.stringify(obj)
				})
			},
			send(){
				if(this.yhjList.length > 0){
					//有优惠券
					this.isQ = 1
				} else {
					this.isQ = 0
				}
				this.iosPay()
				// this.pay == 1 ? this.aliPay() : this.wxPay()
				// console.log(this.pay == 1 ? '支付宝' : '微信')
			},
			//点击学习卡
			handelXXk(item,index){
				// console.log(this.yhjList[this.indes])
				if(this.yhjList[this.indes]){
					if(item.xxkxj < this.yhjList[this.indes].yhqje){
						this.$u.toast('不可用')
						return
					}
				}
				this.inde = index
			},
			//点击优惠卷
			handelyhj(item,index){
				console.log(item,index)
				if(this.xxkList[this.inde].xxkxj < item.yhqje){
					this.$u.toast('不可用')
					return
				}
				this.indes = index
			},
			//查询学习卡
			getXXKList(){
				this.$u.get('api/AXXKController/queryXXK').then(res=>{
					// console.log(res)
					this.xxkList = res
				}).catch(err=>console.log(err))
			},
			//获取优惠券
			getYHJ(){
				this.$u.post('api/AXXKController/queryYXYHQ',{
					xssjh:getApp().globalData.userInfo.xsdh
				}).then(res=>{
					this.yhjList = res
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.paybox{
		padding-top: 20rpx;
		.payBtn{
			margin-top: 20rpx;
			width: 100%;
			padding: 20rpx 60rpx;
			background: #3AA8FF;
			font-size: 15px;
			color: #FFFFFF;
			text-align: center;
		}
		.pay-wrapper{
			display: flex;
			justify-content: space-between;
			padding: 30rpx 50rpx;
			.descs{
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				vertical-align: middle;
				margin-right: 20rpx;
				image{
					width: 45rpx;
					height: 45rpx;
					margin-right: 18rpx;
					vertical-align: middle;
				}
			}
			.acpay{
				background: #61BEFF !important;
				border-color: #61BEFF !important;
			}
			.isac{
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				width: 38rpx;
				height: 38rpx;
				background: #ffffff;	
				border: 2px solid #BDBDBD;
			}
		}
	}
	.xxk{
		padding: 30rpx;
		.userbox{
			padding: 30rpx;
			display: flex;
			align-items: center;
			background: #FFFFFF;
			box-shadow: 1px 8rpx 32rpx 0px rgba(92, 92, 92, 0.15);
			.tx{
				width: 117rpx;
				height: 117rpx;
				background: #FFEEED;
				border-radius: 50%;
				border: 6px solid #FFFFFF;
				box-shadow: 0px 8rpx 10rpx 0px rgba(151, 151, 151, 0.7);
				margin-right: 20rpx;
			}
			view{
				display: flex;
				flex-direction: column;
				text{	
					font-size: 32rpx;
					font-weight: 400;
					color: #3A3A3A;
					margin-bottom: 22rpx;
					image{
						width: 32rpx;
						height: 27rpx;
						margin-right: 9rpx;
					}
					&:last-child{
						font-size: 22rpx;
						font-weight: 400;
						color: #999999;
					}
				}
			}
		}
		.card-list{
			display: flex;
			justify-content: space-between;
			margin-top: 35rpx;
			margin-bottom: 37rpx;
			.acActice{
				border: 1px solid #F29100 !important;
			}
			.card{
				padding: 23rpx 33rpx;
				position: relative;
				border: 1px solid transparent;
				.rb{
					position: absolute;
					bottom: 6px;
					right: 4px;
					width: 87rpx;
					height: 65rpx;
				}
				&:nth-child(1){
					width: 220rpx;
					height: 170rpx;
					background: linear-gradient(236deg, #EC5F4A 0%, #F7BB97 100%);
					border-radius: 30rpx;
				}
				&:nth-child(2){
					width: 229rpx;
					height: 170rpx;
					border-radius: 30rpx;
					background: linear-gradient(-48deg, #F3B123, #FFE38C);
				}
				&:nth-child(3){
					width: 229rpx;
					height: 170rpx;
					border-radius: 30rpx;		
					background: linear-gradient(-48deg, #5384F7, #40C2E9);
				}
				.t{
					height: 33rpx;
					margin-bottom: 28rpx;
				}
				text{
					color: #FFFFFF;
					font-size: 30rpx;
				}
				view{
					color: #FFFFFF;
					font-size: 26rpx;
					text-decoration:line-through;
				}
			}
		}
		.yhj{
			padding: 30rpx;
			.yhj-title{
				font-size: 30rpx;
				font-family: SourceHanSansCN;
				font-weight: 400;
				color: #333333;
				margin-bottom: 30rpx;
			}
			.list-ac{
				border: 2rpx solid #FC7F2D !important;
				background-color: #FFF6F1 !important;
			}
			.list{
				display: flex;
				padding: 31rpx;
				padding-left: 100rpx;
				background-image: url(../../static/xxk-yhj.png);
				background-repeat: no-repeat;
				background-position:50rpx center;
				background-size: 33rpx 28rpx;
				background-color: #FFFFFF;
				display: flex;
				justify-content: space-between;
				border: 2rpx solid #E6E6E6;
				border-radius: 10px;
				margin-bottom: 21rpx;
				.list-left{
					text{
						&:first-child{
							font-size: 30rpx;
							font-weight: 400;
							color: #1E1E1E;
							margin-right: 19rpx;
						}
						&:last-child{
							font-size: 18rpx;
							font-weight: 400;
							color: #999999;
						}
					}
				}
				.list-right{
					text{
						&:first-child{
							font-size: 32rpx;
							font-weight: 400;
							color: #FB7F2D;
							margin-right: 19rpx;
						}
						&:last-child{
							font-size: 18rpx;
							font-weight: 400;
							color: #242323;
						}
					}
				}
			}
		}
		.paybox{
			.pay-wrapper{
				display: flex;
				justify-content: space-between;
				padding: 30rpx 20rpx;
				.desc{
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
					vertical-align: middle;
					image{
						width: 45rpx;
						height: 45rpx;
						margin-right: 18rpx;
						vertical-align: middle;
					}
				}
				.acpay{
					background: #61BEFF !important;
					border-color: #61BEFF !important;
				}
				.isac{
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					width: 38rpx;
					height: 38rpx;
					background: #ffffff;	
					border: 2px solid #BDBDBD;
				}
			}
		}
		.pay-btn{
			margin: 50rpx auto 0;
			width: 560rpx;
			height: 68rpx;
			text-align: center;
			background: #61BEFF;
			border-radius: 32px;
			font-size: 30rpx;
			font-weight: 400;
			color: #FEFEFE;
			line-height: 68rpx;
		}
	}
</style>
