<template>
	<view class="Two">
		<u-navbar title="拓展课程" back-icon-color="#333" :border-bottom="false" ></u-navbar>
		<view class="zsjj-wrapper">
			<view class="zsjj-img">
				<image :src="topInfo.kcfm || topInfo.kc_fm" ></image>
			</view>
			<view class="zsjj-desc">
				<view class="zsjj-bt">{{topInfo.kcmc || topInfo.kc_mc}}</view>
				<view class="zsjj-qt">
					<view v-if="topInfo.xxrc || topInfo.kc_xxrc">
						<image src="../../static/icon-zy.png"></image>
						<text>{{topInfo.xxrc || topInfo.kc_xxrc}}人正在学习</text>
					</view>
					<!-- <view>
						<image src="../../static/icon-sc.png" ></image>
						<text>收藏</text>
					</view> -->
				</view>
				<view class="star-xx" @click="topInfo.kc_ts ? kcjsShow = true : $u.toast('暂无内容')">课程介绍</view>
				<u-popup v-model="kcjsShow" mode="center"  width="100%" >
					<scroll-view  scroll-y="true" style="height: 100%;">
						<u-icon name="close" color="#000" size="48" @click="kcjsShow = false" style="position: fixed;top: 80rpx; right: 50rpx;z-index: 99;"></u-icon>
						<image v-if="topInfo.kc_ts" :src="topInfo.kc_ts" mode="widthFix" style="width: 100%	;"></image>
					</scroll-view>
				</u-popup>
			</view>
		</view>
		<view style="overflow: hidden;">
			<view class="change-box" @tap="jcShow = !jcShow">
				<view>{{jcmc}}</view>
				<u-icon name="arrow-down" color="##B5B5B5" size="20" style="width: 50rpx;"></u-icon>
			</view>
		</view>
		<u-select v-if="jcList" v-model="jcShow" :list="jcList" value-name="jcid" label-name="jcmc"  @confirm="jcConfirm"></u-select>
		<view class="ins-wrapper" v-for="(items, i) in kcInfo" :key="i">
			<view class="jc-title">
				<image src="../../static/lk-zy.png" mode=""></image>{{items.tit}}
			</view>
			<view class="ins-list" v-for="(item, index) in items.lc" :key="index">
				 <!-- item.sfmf == 1 && topInfo.sfmf == 1 && shzt == 0 && is == false && userInfo.xssfvip == 0 -->
				<view v-if="item.fl == 0"><image src="../../static/suo.png" v-if="shzt == 0 ?
																				 userInfo.xssfvip == 0 ?
																				 is == false ?
																				 topInfo.sfsf == 1 ?
																				 item.sfmf == 1 ? true
																				 :false
																				 :false
																				 :false
																				 :false
																				 :false"></image>{{item.lcmc}}</view>
				<view v-if="item.fl == 1">{{item.lcmc}}</view>
				<view class="zyz btn" @tap="goZY(item)" v-if="item.sfwc == -1 && item.fl == 1">做一做</view>
				<view class="wwc btn" @tap="goZY(item)" v-if="item.sfwc == 0 && item.fl == 1">已学习</view>
				<view class="ywc btn" @tap="goZY(item)" v-if="item.sfwc == 1 && item.fl == 1">作业报告</view>
				<view class="xyx btn" v-if="item.fl == 0 && item.sfwc == 0" @click="handelSP(item)">学一学</view>
				<view class="ywc btn" v-if="item.fl == 0 && item.sfwc != 0" @click="handelSP(item)">已学习</view>
			</view>
		</view>
		<!-- topInfo.sfsf == 1 && shzt == 0 && userInfo.xssfvip == 0 && is == false && topInfo.xj != 0 -->
		<view class="pay-box" v-if="shzt == 0 ?
									 userInfo.xssfvip == 0 ?
									 is == false ?
									 topInfo.sfsf == 1 ? true 
									 :false
									 :false
									 :false
									 :false">
			<view class="je">￥<text>{{topInfo.kcxj}}</text></view>
			<view class="btn" @click="iosPay">支付学习</view>
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
				kcid:'',
				topInfo:'',
				jcList:'',
				jcid:'',
				jcmc:'',
				jcShow:false,
				kcInfo:'',
				shzt:'',
				userInfo:'',
				ddList:[] ,
				is:'', //当前课程是否购买过
				pay:0,
				fsShow:false,
				flag:false,
				kcjsShow:false,
			};
		},
		onLoad(obj) {
			this.shzt = getApp().globalData.shzt
			this.kcid = obj.kcid
			this.topInfo = JSON.parse(obj.item)
			this.userInfo = getApp().globalData.userInfo
			this.ddList = getApp().globalData.userInfo.dingdan
			this.isDD()
			this.isFlag()
			this.getJCList()
		},
		onShow() {
			this.getJCList()
			this.isFlag()
		},
		methods:{
			iosPay(){
				setTimeout(()=>{
					this.fsShow = true
				},2000)
				let obj = {
					spmc:this.topInfo.kcmc,
					gmje:this.topInfo.kcxj,
					ddlx:1  ,//1课程 0x学习卡
					spxj:this.topInfo.kcxj,
					yhlx: 0 ,  // 0无 1 卷 2 码
					yhje:0,
					xsid:getApp().globalData.userInfo.xsid,
					fkfs:0,      //1zfb 0 wx
					spid:this.kcid,
					kcfm:this.topInfo.kcfm,
					spyj:this.topInfo.kcyj
				}
				this.$u.route('pages/test/iosPay',{
					obj:JSON.stringify(obj)
				})
			},
			//判断当前课程是否购买过
			isDD(){
				for(let i=0; i<=this.ddList.length - 1;i++){
					console.log(this.ddList[i].spid,this.kcid)
					if(this.ddList[i].spid == this.kcid){
						this.is = true
						return false
					}else{
						this.is = false
					}
				}
				console.log(this.is)
			},
			//选择付款方式
			selectFS(){
				this.fsShow = true
			},
			wxPay(){
				this.$u.post('/wxpay/WXPay',{
					spmc:this.topInfo.kcmc,
					gmje:this.topInfo.kcxj,
					ddlx:1  ,//1课程 0x学习卡
					spxj:this.topInfo.kcxj,
					yhlx: 0 ,  // 0无 1 卷 2 码
					yhje:0,
					xsid:this.userInfo.xsid,
					fkfs:0,      //1zfb 0 wx
					spid:this.kcid
				}).then(res=>{
					console.log(res)
					uni.requestPayment({
					    provider: 'wxpay',
					    orderInfo: res.map, //微信、支付宝订单数据
					    success: (res) => {
							this.resetInfo()
					    },
					    fail: (err) => {
							this.$u.toast('失败，请重试')
					    }
					});
				}).catch(err=>console.log(err))
			},
			//支付宝支付
			aliPay(){
				this.$u.post('/zfbpay/ZFBPay',{
					spmc:this.topInfo.kcmc,
					gmje:this.topInfo.kcxj,
					ddlx:1  ,//1课程 0x学习卡
					spxj:this.topInfo.kcxj,
					yhlx: 0 ,  // 0无 1 卷 2 码
					yhje:0,
					xsid:this.userInfo.xsid,
					fkfs:1,      //1zfb 0 wx
					spid:this.kcid
				}).then(res=>{
					console.log(res)
					uni.requestPayment({
					    provider: 'alipay',
					    orderInfo: res, //微信、支付宝订单数据
					    success: (res)=>{
					       this.resetInfo()
					    },
					    fail: (err)=>{
					        this.$u.toast('失败，请重试')
					    }
					});
				}).catch(err=>console.log(err))
			},
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
					this.userInfo =  res.data
					this.ddList = getApp().globalData.userInfo.dingdan
					this.isDD()
					this.fsShow = false
					console.log('后',getApp().globalData.userInfo)
				}).catch(err=>{
					console.log(this.$u.toast(err))
				})
			},
			//作业相关
			goZY(item){
				console.log('作业相关',item)
				let kcid = this.kcid
				let lcid = item.id
				let xsid = getApp().globalData.userInfo.xsid
				let sjid = item.sjid
				let zylx = 0 //课后作业
				let xkid = this.topInfo.xkid
				console.log(kcid,lcid,xsid,sjid,zylx,xkid)
				if(item.sfwc == -1){
					this.$u.post('api/ASJZYController/addSJZYInfo',{
						xsid,
						xkid,
						sjid,
						zylx,
						lcid,
						kcid
					}).then(res=>{
						if(res){
							this.$u.route('pages/test/testBox',{
								xsid,
								xkid,
								sjid,
								lx:1,
								xszyid:res,
								sjmc:item.lcmc,
							})
							return false
						}
					})
					return false
				} if (item.sfwc == 1) {
					this.$u.route('pages/test/testBox',{
						xszyid:item.myid,
						lx:6,
						sjmc:item.lcmc,
					})
					return
				}else {
					this.$u.route('pages/test/testBox',{
						xsid,
						xkid,
						sjid,
						lx:1,
						xszyid:item.myid,
						sjmc:item.lcmc,
					})
					return
				}
			},
			goSPXQ(sfwc,lcid,item){
				if(sfwc == 0){
					console.log('未完成')
					this.$u.post('api/AXXJDController/addInfo',{
						xxjdxsid:getApp().globalData.userInfo.xsid,
						xxjdkcid:this.kcid,
						xxjdlcid:lcid,
						xxjdlx:0 ,//0视频 1作业
						xxjdkclx:0
					}).then(res=>{
						if(!res){
							this.$u.toast('请重试')
							return false
						} else {
							this.$u.route('pages/index/videoInfo',{
								item:JSON.stringify(item)
							})
						}
					})
				} else {
					console.log('已完成')
					this.$u.post('api/AXXJDController/upInfo',{
						xxjdid:item.myid
					}).then(res=>{
						if(res){
							this.$u.route('pages/index/videoInfo',{
								item:JSON.stringify(item)
							})
						}
					})
				}
			},
			isFlag(){
				let isVip = getApp().globalData.userInfo.xssfvip
				let kcsfsf = this.topInfo.sfsf
				if(this.shzt == 0){
					//不在审核中
					if(kcsfsf == 1){
						//收费
						if(isVip == 1){
							//是vip
							this.flag = true
							return false
						} else {
							//不是vip
							if(this.is){
								this.flag = true
								return false
							} else {
								this.flag = false
								return false
							}
						}
					}else {
						//不收费
						this.flag = true
						return false
					}
				} else {
					//在审核中直接进
					this.flag = true
					return false
				}
			},
			//视频相关
			handelSP(item){
				console.log('视频相关',item)
				console.log(this.topInfo.sfsf)
				let sfsf = item.sfmf  //0 免费 1收费
				let sfwc = item.sfwc
				let lcid = item.lcid
				let isVip = getApp().globalData.userInfo.xssfvip
				let ddList = getApp().globalData.userInfo.dingdan
				if(this.flag || sfsf != 1){
					this.goSPXQ(sfwc,lcid,item)
					return false
				}else {
					this.$u.toast('请先购买该课程')
					return false
				}
				// if(this.shzt == 0){
				// 	//不在审核中
				// 	if(sfsf == 1){
				// 		//收费
				// 		if(isVip == 1){
				// 			//是vip
				// 			this.goSPXQ(sfwc,lcid,item)
				// 		} else {
				// 			//不是vip
				// 			if(this.is){
				// 				//订单大于0且包含当前课程例次id可以进
				// 				this.goSPXQ(sfwc,lcid,item)
				// 			} else {
				// 				this.$u.toast('请先购买该课程')
				// 				return false
				// 			}
				// 		}
				// 	}else {
				// 		//不收费
				// 		this.goSPXQ(sfwc,lcid,item)
				// 	}
				// } else {
				// 	//在审核中直接进
				// 	this.goSPXQ(sfwc,lcid,item)
				// }
			},
			//切换讲次
			jcConfirm(val){
				this.jcmc = val[0].label
				this.jcid = val[0].value
				this.getKCInfo()
			},
			//获取讲次
			getJCList(){
				this.$u.post('api/ATZKCController/queryKCJCList',{
					param3:this.kcid,
					param4:-1
				}).then(res=>{
					if(res){
						this.jcList = res
						this.jcList.unshift({
							jcid:-1,
							jcmc:'全部'
						})
						this.jcid = this.jcList[0].jcid
						this.jcmc = this.jcList[0].jcmc
						this.getKCInfo()
					}
				}).catch(err=>console.log(err))
			},
			//获取课程
			getKCInfo(){
				this.$u.post('api/ATZKCController/queryKCJCLC',{
					param3:this.kcid,
					param4:this.jcid,
					param5:getApp().globalData.userInfo.xsid
				}).then(res=>{
					if(res){
						this.kcInfo = res.key
						var arr = this.kcInfo.split("yang");
						var arrList = [];
						for (var i = 0; i < arr.length; i++) {
							var obj = eval('(' + arr[i] + ')');
							arrList.push(obj);
						}
						this.kcInfo = arrList;
						console.log(this.kcInfo)
					}
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss">
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
	.pay-box{
		width: 100%;
		height: 98rpx;
		line-height: 98rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #FFFFFF;
		display: flex;
		z-index: 99;
		view{
			flex: 1;
			text-align: center;
			color: #FF8400;
			font-size: 24rpx;
		}
		.je{
			text{
				font-size: 32rpx;
			}
		}
		.btn{
			width: 291rpx;
			line-height: 98rpx;
			background: #3AA8FF;
			font-size: 30rpx;
			color: #FFFFFF;
			text-align: center;
		}
	}
	.ins-wrapper{
		background: rgba($color: #FED97E, $alpha: .3);
		border-radius: 25rpx;
		padding:33rpx 28rpx;
		margin-top: 30rpx;
		.ins-list{
			display: flex;
			justify-content: space-between;
			margin-top: 24rpx;
			view{
				&:first-child{
					padding-left:66rpx;
					image{
						width: 21rpx;
						height: 27rpx;
						margin-right: 12rpx;
					}
				}
			}
			.btn{
				width: 147rpx;
				height: 44rpx;
				line-height: 44rpx;
				border-radius: 10rpx;
				border: none;
				font-size: 28rpx;
				color: #FFFFFF;
				text-align: center;
			}
			.ywc{
				background: #FFB400;
			}
			.wwc{
				background: #A8C62B;
			}
			.xyx{
				background: #FF8400;
			}
			.zyz{
				background: #61BEFF;
			}
		}
	}
	.jc-title{
		font-size: 28rpx;
		font-weight: bold;
		color: #393939;
		vertical-align: middle;
		image{
			width: 52rpx;
			height: 57rpx;
			margin-right: 14rpx;
		}
	}
	.jc-list{
		white-space: nowrap;
		overflow: hidden;
		view{
			display: inline-block;
			margin-right: 23rpx;
			padding: 0 30rpx;
			height: 55rpx;
			line-height: 55rpx;
			background: rgba($color: #FED97E, $alpha: .3);
			border-radius: 28rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #393939;
			text-align: center;
		}
		.jcActive{
			font-weight: 600;
			background: #FED97E;
		}
		
	}
	.change-box{
		display: flex;
		width: 274rpx;
		height: 46rpx;
		line-height: 46rpx;
		text-align: center;
		border: 1px solid #B5B5B5;
		border-radius: 8rpx;
		padding-left: 10rpx;
		float: right;
		margin-bottom: 41rpx;
		view{
			width: 200rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
	.Two{
		padding: 30rpx;
	}
	.zsjj-wrapper{
		display: flex;
		margin-bottom: 35rpx;
		.zsjj-bt{
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
			margin-bottom: 49rpx;
		}
		.je{
			font-size: 30rpx;
			color: #FF8400;
			text{		
				font-size: 24rpx;
			}
		}
		.star-xx{
			width: 192rpx;
			height: 48rpx;
			line-height: 48rpx;
			text-align: center;
			background: #FF8400;
			border-radius: 21rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFEFE;
			margin-top: 80rpx;
		}
		.zsjj-qt{
			display: flex;
			justify-content: space-between;
			align-items: center;
			image{
				width: 27rpx;
				height: 27rpx;
				margin-right: 14rpx;
				vertical-align: middle;
			}
			text{
				vertical-align: middle;
				font-size: 24rpx;
				color: #393939;
			}
		}
		.zsjj-img{
			width: 212rpx;
			height: 265rpx;
			border-radius: 6rpx;
			overflow: hidden;
			margin-right: 30rpx;
			image{
				width: 212rpx;
				height: 265rpx;
			}
		}
	}
</style>
