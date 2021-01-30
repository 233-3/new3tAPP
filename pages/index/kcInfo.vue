<template>
	<view class="kc-warpper">
		<u-navbar title="" back-icon-color="#ffffff" :border-bottom="false" :background="background">
			<view class="slot-wrap" slot="right">
				<view @click="$u.route('pages/errbookList/errbookList')">
					<image src="../../static/icon-ctb.png" mode=""></image>
					<text>错题本</text>
				</view>
				<view @click="$u.route('pages/index/testRecord',{kcid:kcinfo.kc_id})">
					<image src="../../static/icon-csjl.png" mode=""></image>
					<text>测试记录</text>
				</view>
				<view>
					<image src="../../static/icon-scj.png" mode=""></image>
					<text>晒成绩</text>
				</view>	
			</view>
		</u-navbar>
		<view class="fixed"></view>
		<view style="width: 60%; margin: 35rpx auto;">
			<u-subsection :list="titleList" @change="changeTab" :current="index" font-size="30" height="70" active-color="#FED97E" mode="button" bg-color="#FED97E" inactive-color="#ffffff"></u-subsection>
		</view>
		<view class="kcinfo-wrapper">
			<view class="kc-img">
				<image :src="kcinfo.kc_fm ? kcinfo.kc_fm : $errImg" ></image>
			</view>
			<view class="kc-info">
				<text class="kc-title">
					<image src="../../static/icon-hy.png"  mode=""></image>
					{{kcinfo.kc_mc}}
				</text>
				<view class="jczy-box">
					<view>
						<image src="../../static/icon-jc.png" mode=""></image>
						<text>讲次:{{kcinfo.jcTotal}}讲</text>
					</view>
					<view>
						<image src="../../static/icon-zy.png" mode=""></image>
						<text>作业:{{kcinfo.zyTotal}}套</text>
					</view>
					<!-- <view>
						<image src="../../static/icon-sc.png" mode=""></image>
						<text>收藏</text>
					</view> -->
				</view>
				<view class="vip" v-if="userInfo.xssfvip">
					VIP有限期：<text>{{userInfo.xsvipsj}}</text>
				</view>
			</view>
		</view>
		<view v-if="index == 0" class="kclist">
			<view class="list-title">
				<view></view>
				课程目录
			</view>
			<scroll-view class="jc-list"  scroll-x="true" enable-flex="true" style="padding: 5px 0;">
				<view
					v-for="(item, index) in jcNumList" 
					@click="setJCId(item.jcid,item.jcmc,index)" 
					:class="{jcActive:jcid == item.jcid}"
					:key="index"
				>{{item.jcnum}}</view>
			</scroll-view>
			<view style="margin-top: 42rpx;">
				<view class="jc-title">
					{{jcmc}}
				</view>
				<view class="ins-wrapper" v-if="jcInfo.jcspList && jcInfo.jcspList.length > 0">
					<view class="jc-title">
						<image src="../../static/lk-zz.png" mode=""></image>专题精讲
					</view>
					<view class="ins-list" v-for="(item, index) in jcInfo.jcspList" :key="index">
						<!-- item.sfsf == 1 && kcinfo.kc_sfsf == 1 && shzt == 0 && is == false && userInfo.xssfvip == 0 -->
						<view><image src="../../static/suo.png" v-if="shzt == 0 ? 
																	 userInfo.xssfvip == 0 ? 
																	 is == false ?
																	 kcinfo.kc_sfsf == 1 ? 
																	 item.sfsf == 1 ? true
																	 :false
																	 :false
																	 :false
																	 :false
																	 :false"></image>{{item.lcmc}}</view>
						<view class="xyx btn" @click="handelSP(item)" v-if="!item.jdid">学一学</view>
						<view class="wwc btn" @click="handelSP(item)" v-if="item.jdid">已学习</view>
					</view>
				</view>
				<view class="ins-wrapper" v-if="jcInfo.jcsjList && jcInfo.jcsjList.length > 0">
					<view class="jc-title">
						<image src="../../static/lk-zy.png" mode=""></image>在线作业
					</view>
					<view class="ins-list" v-for="(item, index) in jcInfo.jcsjList" :key="index">
						<view>{{item.sjmc}}</view>
						<view class="zyz btn" @tap="goZY(item)" v-if="item.sfwc == -1">做一做</view>
						<view class="wwc btn" @tap="goZY(item)" v-if="item.sfwc == 0">已学习</view>
						<view class="ywc btn" @tap="goZY(item)" v-if="item.sfwc == 1">作业报告</view>
					</view>
				</view>
				
				<view class="ins-wrapper" v-if="jcInfo.daList && jcInfo.daList.length > 0">
					<view class="jc-title">
						<image src="../../static/lk-zz.png" mode=""></image>习题答案
					</view>
					<view class="ins-list" v-for="(item, index) in jcInfo.daList" :key="index">
						<view>{{item.damc}}</view>
						<view class="xyx btn" v-if="item.xxjdid == 0" @click="handelDA(item)">查看</view>
						<view class="ywc btn" v-if="item.xxjdid != 0" @click="handelDA(item)">已查看</view>
					</view>
				</view>
				
			</view>
		</view>
		
		<view v-if="index == 1">
			<view class="desc">
				<view class="desc-title">
					<text>课程介绍</text>
					<view></view>
				</view>
				<view>
					<rich-text :nodes="kcinfo.kc_sydx" v-if="kcinfo.kc_sydx"></rich-text>
					<u-empty text="暂无内容" mode="list" v-else></u-empty>
				</view>
			</view>
		</view>
		
		<!-- kcinfo.kc_sfsf == 1 &&shzt == 0 && userInfo.xssfvip == 0 && is == false && kcinfo.kc_xj != 0 -->
		<view class="pay-box" v-if="shzt == 0 ?
								 userInfo.xssfvip == 0 ? 
								 is == false ?
								 kcinfo.kc_sfsf == 1 ? true
								 :false
								 :false
								 :false
								 :false">
			<view class="je">￥<text>{{kcinfo.kc_xj}}</text></view>
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
				background:{
					background:'#61BEFF'
				},
				kcinfo:'',
				titleList:[
					{
						name:'课程目录'
					},
					{
						name:'课程介绍'
					}
				],
				index:0,
				jcNumList:'',
				jcid:'',
				jcmc:'',
				jcInfo:'',
				xkid:'',
				jceq:0, //讲次下标
				userInfo:'',
				shzt:'',
				ddList:[] ,
				is:'', //当前课程是否购买过
				pay:0,
				fsShow:false,
				flag:false,
			};
		},
		onLoad(obj) {
			this.shzt = getApp().globalData.shzt
			this.userInfo = getApp().globalData.userInfo
			this.kcinfo = JSON.parse(obj.item)
			console.log(this.kcinfo)
			this.xkid = obj.xkid
			this.ddList = getApp().globalData.userInfo.dingdan
			this.isDD()
			this.isFlag()
			console.log(this.flag)
		},
		onShow() {
			this.getJCList()
			this.isFlag()
		},
		computed:{
			desc(){
				this.kcinfo.kc_sydx = this.kcinfo.kc_sydx.replace(/<img/g, '<img style="width: 100%; display:block;"')
				this.kcinfo.kc_sydx = this.kcinfo.kc_sydx.replace(/<p/g, '<p style="font-size: 15px; color: #777;line-height: 23px;"')
				this.kcinfo.kc_sydx = this.kcinfo.kc_sydx.replace(/<video/g, '<video style="width: 100%;"')
			},
		},
		methods:{
			iosPay(){
				setTimeout(()=>{
					this.fsShow = true
				},2000)
				let obj = {
					spmc:this.kcinfo.kc_mc,
					gmje:this.kcinfo.kc_xj,
					ddlx:1  ,//1课程 0x学习卡
					spxj:this.kcinfo.kc_xj,
					yhlx: 0 ,  // 0无 1 卷 2 码
					yhje:0,
					xsid:getApp().globalData.userInfo.xsid,
					fkfs:0,      //1zfb 0 wx
					spid:this.kcinfo.kc_id,
					kcfm:this.kcinfo.kc_fm,
					spyj:this.kcinfo.kc_yj
				}
				this.$u.route('pages/test/iosPay',{
					obj:JSON.stringify(obj)
				})
			},
			//选择付款方式
			selectFS(){
				this.fsShow = true
			},
			//判断当前课程是否购买过
			isDD(){
				for(let i=0; i<=this.ddList.length - 1;i++){
					console.log(this.ddList[i].spid,this.kcinfo.kc_id)
					if(this.ddList[i].spid == this.kcinfo.kc_id){
						this.is = true
						return false
					}else{
						this.is = false
					}
				}
				console.log(this.is)
			},
			wxPay(){
				this.$u.post('/wxpay/WXPay',{
					spmc:this.kcinfo.kc_mc,
					gmje:this.kcinfo.kc_xj,
					ddlx:1  ,//1课程 0x学习卡
					spxj:this.kcinfo.kc_xj,
					yhlx: 0 ,  // 0无 1 卷 2 码
					yhje:0,
					xsid:getApp().globalData.userInfo.xsid,
					fkfs:0,      //1zfb 0 wx
					spid:this.kcinfo.kc_id
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
					spmc:this.kcinfo.kc_mc,
					gmje:this.kcinfo.kc_xj,
					ddlx:1  ,//1课程 0x学习卡
					spxj:this.kcinfo.kc_xj,
					yhlx: 0 ,  // 0无 1 卷 2 码
					yhje:0,
					xsid:getApp().globalData.userInfo.xsid,
					fkfs:1,      //1zfb 0 wx
					spid:this.kcinfo.kc_id
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
				console.log('xsid',this.userInfo.xsid)
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
				console.log(item)
				let kcid = this.jcNumList[this.jceq].kcid
				let lcid = this.jcNumList[this.jceq].jcid
				let xsid = getApp().globalData.userInfo.xsid
				let sjid = item.sjid
				let zylx = 0 //课后作业
				let xkid = this.xkid
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
								sjmc:item.sjmc,
								item:JSON.stringify(this.kcinfo)
							})
							return false
						}
					})
					return false
				} if (item.sfwc == 1) {
					this.$u.route('pages/test/testBox',{
						xszyid:item.zyid,
						lx:6,
						sjmc:item.sjmc,
					})
					return false
				}else {
					this.$u.route('pages/test/testBox',{
						xsid,
						xkid,
						sjid,
						lx:1,
						xszyid:item.zyid,
						sjmc:item.sjmc,
					})
					return false
				}
			},
			//答案相关
			handelDA(item){
				// console.log(item,getApp().globalData.userInfo)
				let daid = item.daid
				let xxjdid = item.xxjdid
				let url = item.dadz
				// console.log(xxjdid)
				if(xxjdid == 0){
					this.$u.post('api/AXXJDController/addInfo',{
						xxjdxsid:getApp().globalData.userInfo.xsid,
						xxjdkcid:this.kcinfo.kc_id,
						xxjdlcid:daid,
						xxjdlx:1 ,//0视频 1作业
						xxjdkclx:2
					}).then(res=>{
						if(res){
							this.showPDF(url)
							return false
						} else {
							this.$u.toast('失败请重试')
						}
					}).catch(res=>{console.log(res)})
				} else {
					this.$u.post('api/AXXJDController/upInfo',{
						xxjdid
					}).then(res=>{
						if(res){
							this.showPDF(url)
							return false
						}
					})
				}
			}, 
			showPDF(url){
				console.log(url)
				uni.downloadFile({
				  url: url,
				  success: function (res) {
				    var filePath = res.tempFilePath
				    uni.openDocument({
				      filePath: filePath,
				      success:function (res) {
				        console.log('打开文档成功')
				      },
					  complete:function (msg) {
						 console.log(msg)
					  }
				    })
				  },
				  fail:(err)=>{
				  	this.$u.toast('失败，请重试')
					return false
				  },
				})
			},
			goSPXQ(jdid,lcid,item){
				if(!jdid){
					this.$u.post('api/AXXJDController/addInfo',{
						xxjdxsid:getApp().globalData.userInfo.xsid,
						xxjdkcid:this.kcinfo.kc_id,
						xxjdlcid:lcid,
						xxjdlx:0, //0视频 1作业
						xxjdkclx:2
					}).then(res=>{
						if(!res){
							this.$u.toast('请重试')
							return false
						} else {
							this.$u.route('pages/index/videoInfo',{
								item:JSON.stringify(item)
							})
							return false
						}
					})
				} else {
					this.$u.post('api/AXXJDController/upInfo',{
						xxjdid:jdid
					}).then(res=>{
						if(res){
							this.$u.route('pages/index/videoInfo',{
								item:JSON.stringify(item)
							})
							return false
						}
					})
				}
			},
			isFlag(){
				let isVip = getApp().globalData.userInfo.xssfvip
				let kcsfsf = this.kcinfo.kc_sfsf
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
				let sfsf = item.sfsf
				let jdid = item.jdid
				let lcid = item.lcid
				let isVip = getApp().globalData.userInfo.xssfvip
				let kcsfsf = this.kcinfo.kc_sfsf
				if(this.flag || sfsf != 1){
					this.goSPXQ(jdid,lcid,item)
					return false
				}else {
					this.$u.toast('请先购买该课程')
					return false
				}
				// if(this.shzt == 0){
				// 	//不在审核中
				// 	if(sfsf == 1){
				// 		//收费
				// 		if(kcsfsf == 1){
				// 			//课程是否收费
				// 			if(isVip == 1){
				// 				//是vip
				// 				this.goSPXQ(jdid,lcid,item)
				// 				return false
				// 			} else {
				// 				//不是vip
				// 				if(this.is){
				// 					this.goSPXQ(jdid,lcid,item)
				// 					return false
				// 				} else {
				// 					this.$u.toast('请先购买该课程')
				// 					return false
				// 				}
				// 			}
				// 		} else {
				// 			this.goSPXQ(jdid,lcid,item)
				// 			return false
				// 		}
				// 	}else {
				// 		//不收费
				// 		this.goSPXQ(jdid,lcid,item)
				// 		return false
				// 	}
				// } else {
				// 	//在审核中直接进
				// 	this.goSPXQ(jdid,lcid,item)
				// 	return false
				// }
				
			},
			//tab切换
			changeTab(val){
				this.index = val
			},
			//切换讲次
			setJCId(val,mc,index){
				this.jcid = val
				this.jcmc = mc
				this.jceq = index
				this.getJCInfo()
			},
			//获取讲次详情
			getJCInfo(){
				this.$u.post('api/AJCKCController/queryJCInfo',{
					jcid:this.jcid,
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					if(res){
						this.jcInfo = res
					}
				})
			},
			//获取讲次列表
			getJCList(){
				this.$u.post('api/AJCKCController/queryJCList',{
					kcid:this.kcinfo.kc_id
				}).then(res=>{
					if(res){
						res.forEach((val, index)=>{
							val.jcnum = `第${this.NoToChinese(index+1)}讲`
						})
						this.jcNumList = res
						this.jcid = this.jcNumList[0].jcid
						this.jcmc = this.jcNumList[0].jcmc
						this.getJCInfo()
					}
				})
			},
			//数字转中文
			NoToChinese(num) {
			    if (!/^\d*(\.\d*)?$/.test(num)) {
			        alert("Number is wrong!");
			        return "Number is wrong!";
			    }
			    var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
			    var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
			    var a = ("" + num).replace(/(^0*)/g, "").split("."),
			        k = 0,
			        re = "";
			    for (var i = a[0].length - 1; i >= 0; i--) {
			        switch (k) {
			            case 0:
			                re = BB[7] + re;
			                break;
			            case 4:
			                if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
			                    re = BB[4] + re;
			                break;
			            case 8:
			                re = BB[5] + re;
			                BB[7] = BB[5];
			                k = 0;
			                break;
			        }
			        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
			        if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
			        k++;
			    }
			    if (a.length > 1) //加上小数部分(如果有小数部分) 
			    {
			        re += BB[6];
			        for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
			    }
			    return re;
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
	.pay-box{
		width: 100%;
		height: 98rpx;
		line-height: 98rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #FFFFFF;
		display: flex;
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
	.list-title{
		font-size: 32rpx;
		font-weight: 500;
		color: #393939;
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
		view{
			width: 10rpx;
			height: 38rpx;
			background: #61BEFF;
			border-radius: 5rpx;
			margin-right: 13rpx;
		}
	}
	.kclist{
		width: 100%;
		background: #FFFFFF;
		border-radius: 25rpx;
		padding: 45rpx 26rpx 26rpx;
		margin-bottom: 50px
	}
	.desc{
		width: 100%;
		background: #FFFFFF;
		border-radius: 25rpx;
		padding: 55rpx 33rpx 33rpx;
		.desc-title{
			display: flex;
			flex-flow: column;
			align-items: center;
			margin-bottom:50rpx;
			text{
				font-size: 32rpx;
				font-weight: 500;
				color: #393939;
				z-index: 2;
			}
			view{
				width: 154rpx;
				height: 16rpx;
				background: #FBE04E;
				border-radius: 8rpx;
				margin-top: -5px;
				z-index: 1;
			}
		}
	}
	.kcinfo-wrapper{
		display: flex;
		background: #FFFFFF;
		border-radius: 25rpx;
		padding: 38rpx;
		position: relative;
		margin-bottom: 45rpx;
		.kc-img{
			width: 168rpx;
			height: 210rpx;
			margin-right: 28rpx;
			position: relative;
			overflow: hidden;
			image{
				width: 168rpx;
				height: 210rpx;
			}
		}
		.bottom-btn{
			width: 203rpx;
			height: 48rpx;
			background: #FF8400;
			border-radius: 24rpx;
			font-size: 24rpx;
			font-weight: 500;
			color: #FFFEFE;
			text-align: center;
			line-height: 48rpx;
			position: absolute;
			bottom: 38rpx;
			right: 38rpx;
		}
		.kc-info{
			flex: 1;
			.jczy-box{
				display: flex;
				justify-content: space-between;
				margin-top: 26rpx;
			}
			.vip{
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				margin-top: 60rpx;
				text{
					color:#FF8400;
				}
			}
			.kc-title{
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				vertical-align: middle;
				image{
					width: 50rpx;
					height: 40rpx;
				}
			}
			image{
				width: 24rpx;
				height: 24rpx;
				margin-right: 12rpx;
			}
		}
	}
	.kc-warpper{
		background: #61BEFF;
		padding: 24rpx;
	}
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #61BEFF;
		z-index: -1;
	}
	.slot-wrap{
		display: flex;
		align-items: center;
		view{
			margin-right: 32rpx;
			display: flex;
			align-items: center;
			image{
				width: 38rpx;
				height: 38rpx;
			}
			text{
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
				margin-left: 9rpx;
			}
		}
	}
</style>
