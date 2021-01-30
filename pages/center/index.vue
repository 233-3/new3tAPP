<template>
	<view class="content">
		<u-navbar title="个人中心" back-icon-color="#ffffff" :is-back="false" title-color="#ffffff" :border-bottom="false" :background="background">
			<view class="slot-wrap" slot="right">
				<view @click="qiandao">
					<image src="../../static/grzx-qd.png" mode=""></image>
					<text>{{jf.sfqd == 0 ? '签到' : '已签到'}}</text>
				</view>
			</view>
		</u-navbar>
		<view class="bottom-box">
			<view class="info-box">
				<view class="info-left">
					<image :src="userInfo.xstx ? userInfo.xstx : '../../static/login_img.png'" @click="$u.route('pages/center/setUser')"></image>
					<text>{{userInfo.xsmc}}</text>
					<view class="btn-qhzh" @click="setZH">切换账号</view>
				</view>
				<view class="info-right">
					<view class="tel-box">
						<view class="tel" v-if="userInfo.xsdh">{{$telXX(userInfo.xsdh)}}</view>
						<view class="jf" >
							<image src="../../static/grzx-hyjf.png"></image>
							<text>{{jf.xszjf}}</text>
							积分
						</view>
					</view>
					<view class="grade" >
						<image src="../../static/grzx-vip.png" mode=""></image>
						<text>等级：{{jf.jfch}} ></text>
					</view>
					<view class="vipyxq" v-if="userInfo.xssfvip == 1">
						VIP有限期： <text>{{userInfo.xsvipsj}}</text>
					</view>
				</view>
			</view>
			<view class="xxcard" @click="$u.route('pages/center/xxk')" v-if="shzt == 0">
				<view>
					<image src="../../static/grzx-xxk.png" mode=""></image>
					VIP学习卡
				</view>
				<u-icon name="arrow-right" label-color="#7B5533" label-size="28rpx" label="学习卡详情" label-pos="left" color="#7B5533" size="28"></u-icon>
			</view>
			<view class="z-list-box" style="margin-top: 30rpx;">
				<view @click="$u.route('pages/center/dingdan/dingdan',{index:1})">
					<image src="../../static/grzx-wddd.png" mode="heightFix"></image>
					<text>我的订单</text>
				</view>
				<view @click="$u.route('pages/center/dingdan/dingdan',{index:0})">
					<image src="../../static/grzx-ygcc.png" mode="heightFix"></image>
					<text>已购课程</text>
				</view>
				<view @click="$u.route('pages/center/jf/jf')">
					<image src="../../static/grzx-wdjf.png" mode="heightFix"></image>
					<text>我的积分</text>
				</view>
				<view>
					<image src="../../static/grzx-jfly.png" mode="heightFix"></image>
					<text>积分乐园</text>
				</view>
			</view>
			<view class="q-list-box">
				<view class="list-wrapper">
					<view>
						<image src="../../static/grzx-wdxq.png" mode="heightFix"></image>
						<text>我的校区</text>
					</view>
					<u-icon name="arrow-right" label-color="#666666" label-size="28rpx" :label="jf.jgmc ? jf.jgmc : '暂无校区'" label-pos="left" color="#D0D0D0" size="28"></u-icon>
				</view>
				<view class="list-wrapper">
					<view>
						<image src="../../static/grzx-wdbj.png" mode="heightFix"></image>
						<text>我的班级</text>
					</view>
					<view></view>
					<view @click="showBJNUM" v-if="jf.bjsl > 0" style="background: #608dfd;padding: 5rpx 10rpx; color:#FFFFFF;border-radius: 5rpx;">{{jf.bjsl}}</view>
					<u-icon name="scan" @click="saoma" label-pos="left" color="#D0D0D0" size="38"></u-icon>
				</view>
				<view class="list-wrapper" @click="removeShow = !removeShow">
					<view> 
						<image src="../../static/grzx-zhzx.png" mode="heightFix"></image>
						<text>账号注销</text>
					</view>
					<u-icon name="arrow-right" label-color="#666666" label-size="28rpx" label="" label-pos="left" color="#D0D0D0" size="28"></u-icon>
				</view>
				<view class="list-wrapper"  @click="$u.route('pages/center/resetMM')">
					<view> 
						<image src="../../static/xiugaimima.png" mode="heightFix"></image>
						<text>修改密码</text>
					</view>
					<u-icon name="arrow-right" label-color="#666666" label-size="28rpx" label="" label-pos="left" color="#D0D0D0" size="28"></u-icon>
				</view>
				<view class="list-wrapper" @click="$u.route('pages/center/about')">
					<view>
						<image src="../../static/grzx-gyyy.png" mode="heightFix"></image>
						<text>关于云优</text>
					</view>
					<u-icon name="arrow-right" label-color="#666666" label-size="28rpx" label="" label-pos="left" color="#D0D0D0" size="28"></u-icon>
				</view>
			</view>
		</view>
		<u-popup v-model="show" mode="center">
			<view class="bjnum" >
				<view v-for="(item, index) in bjList" :key="index">
					{{item.bjmc}}
				</view>
			</view>
		</u-popup>
		<view class="jf-box animate__animated animate__fadeIn" v-if="jfshow">
			<view class="jf animate__animated animate__bounce">
				<view class="btn">+5积分</view>
			</view>
		</view>
		<u-action-sheet @click="selectZH" :list="zhlist" v-model="zhshow"></u-action-sheet>
		<view class="fixed"></view>
		<u-toast ref="uToast" />
		<u-modal v-model="removeShow" @confirm="removerConfirm" cancel-text="暂不注销" :show-cancel-button="true" title="注销账号" content="注销账号后，个人学情将全部清除，已 购买的课程无法继续学习，确定注销账 号吗？"></u-modal>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				background:{
					background:'transparent',
				},
				userInfo:'',
				jf:{
					sfqd:0,
					xszjf:0,
					jfch:'小童生'
				},
				show:false,
				jfshow:false,
				bjList:'',
				zhlist:[],
				zhshow:false,
				shzt:'',
				removeShow:false,
			}
		},
		onShow() {
			if(!this.$isLogin()){
				this.$goLogin()
			}
			this.userInfo = getApp().globalData.userInfo
			this.shzt = getApp().globalData.shzt
			this.getJfInfo()
		},
		methods: {
			//注销账号
			removerConfirm(){
				this.$u.post('grzx/delXSInfo',{
					xsid:getApp().globalData.userInfo.xsid
				}).thne(res=>{
					if(res){
						uni.clearStorage();
						getApp().globalData.userInfo =  {
							xsid: 0,
							xsmc:'游客',
							xstx: require('@/static/login_img.png'),
							sfrb: 0,
							ygkc: JSON.stringify([])
						},
						this.$u.route('pages/center/login')
					}else{
						this.$u.toast('失败，请重试')
					}
				}).catch(err=>console.log(err))
			},
			setZH(){
				this.zhshow = true
				let arr = []
				this.userInfo.xsIdList.forEach(val=>{
					let obj = {
						text:val.split('===')[1],
						xsid:val.split('===')[0],
					}
					arr.push(obj)
				})
				this.zhlist = arr
			},
			selectZH(index){

				this.$u.post('app/appLoginController/getAppLoginByXsid',{
					xsid:this.zhlist[0].xsid
				}).then(res=>{
					if(res.success){
						this.userInfo = res.data
						getApp().globalData.userInfo = res.data
						uni.setStorage({
						    key: 'userInfo',
						    data: res.data,
						    success:  () => {
								setTimeout(()=>{
									this.$u.route({
										type:'switchTab',
										url:'pages/index/index'
									})
								},800)
						    }
						})
					} else {
						if(this.userInfo.xsid == this.zhlist[0].xsid){
							this.$u.toast('您已是当前账号')
							return
						}else {
							this.$u.toast('失败，请重试')
							return
						}
					}
					console.log(res)
				}).catch(err=>console.log(err))
			},
			//签到
			qiandao(){
				if(this.jf.sfqd > 0){
					this.$u.toast('请勿重复签到')
					return false
				}
				this.$u.post('grzx/updateXueShengByXsId',{
					xsId:this.userInfo.xsid
				}).then(res=>{
					if(res){
						this.jfshow = true
						const innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.autoplay = true;
						innerAudioContext.src = '../../static/ding.wav';
						innerAudioContext.onPlay(() => {
						  console.log('开始播放');
						});
						this.getJfInfo()
						setTimeout(()=>{
							this.jfshow = false
						},3000)
					}else {
						this.$u.toast('失败,请重试')
					}
				}).catch(err=>console.log(err))
			},
			//查询班级名称
			showBJNUM(){
				this.show = true
				this.$u.post('grzx/selectBJMC',{
					xsid:this.userInfo.xsid
				}).then(res=>{
					if(res){
						this.bjList = res
					}else{
						this.$u.toast('失败，请重试')
					}
				}).catch(err=>console.log(err))
			},
			//扫码入班
			saoma(){
				if(getApp().globalData.userInfo.xsid == 0 || getApp().globalData.userInfo.xsid == ""){
					this.$u.toast('请登录后重试')
					this.$u.route('pages/center/login')
					return
				}
				uni.scanCode({
				    success:(res)=>{
				        console.log('班级id：' + res.result);
						this.$u.post('grzx/selectBanJiById',{
							bjId:res.result
						}).then(res=>{
							if(res.success){
								console.log(JSON.stringify(res.data))
								this.$u.route('pages/center/classInfo', {
									classInfo:JSON.stringify(res.data)
								})
							}else {
								this.$u.toast(res.message)
							}
						}).catch(err=>console.log(err))
				    }
				});
			},
			//获取积分信息
			getJfInfo(){
				this.$u.post('grzx/selectGRZXJF',{
					xsid:this.userInfo.xsid
				}).then(res=>{
					if(res){
						this.jf = res
						console.log(this.jf)
					}
				}).catch(err=>console.log(err))
			},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-mode-center-box{
		background-color: transparent;
	}
	.jf-box{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba($color: #000000, $alpha: .4);
		z-index: 99999999;
		.jf{
			width: 540rpx;
			height: 540rpx;
			background: url(../../static/jf-q.png) no-repeat center center;
			background-size: 100% 100%;
			margin: 481rpx auto 0;
			transform: translateX(-50%);
			.btn{
				width: 410rpx;
				height: 84rpx;
				line-height: 84rpx;
				background: url(../../static/jf-btn.png) no-repeat center center;
				background-size: 100% 100%;
				text-align: center;
				font-size: 48rpx;
				font-weight: 500;
				color: #C23E00;
				position: absolute;
				bottom: 20rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background: linear-gradient(130deg, #628DFD 1%, #5B8DFC 100%);
		z-index: -1;
	}
	.bjnum{
		width: 500rpx;
		padding: 20px;
		border-radius: 20rpx;
		background: #FFFFFF;
		text-align: center;
		font-size: 16px;
		view{
			margin: 15rpx;
		}
	}
	.content {
		.bottom-box{
			// position: fixed;
			// top: 230rpx;
			// left: 0;
			margin-top: 230rpx;
			width: 100%;
			height: 100%;
			border-radius: 50rpx;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			background: #FFFFFF;
			padding: 30rpx;
			.info-box{
				display: flex;
				flex: 1;
				.info-left{
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-right: 50rpx;
					margin-top: -100rpx;
					image{
						width: 171rpx;
						height: 171rpx;
						border-radius: 50%;
						overflow: hidden;
						background: #FFFFFF;
					}
					text{
						font-size: 32rpx;
						font-weight: 400;
						color: #333333;
						margin: 10rpx 0rpx 20rpx;
					}
					.btn-qhzh{
						width: 125rpx;
						height: 39rpx;
						line-height: 39rpx;
						text-align: center;
						background: #EDF5FF;
						border-radius: 10rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #1E78FA;
					}
				}
				.info-right{
					.tel-box{
						display: flex;
						align-items: center;
						.tel{
							font-size: 26rpx;
							font-weight: 400;
							color: #847676;
							margin-right: 70rpx;
						}
						.jf{
							display: flex;
							align-items: center;
							font-size: 30rpx;
							color: #847676;
							image{
								width: 38rpx;
								height: 30rpx;
							}
							text{
								font-weight: 500;
								color: #FF9022;
								margin: 0 15rpx;
							}
						}
					}
					.vipyxq{
						font-size: 24rpx;
						font-weight: 400;
						color: #666666;
						text{
							color: #FF8400;
							margin-left: 10rpx;
						}
					}
					.grade{
						width: 241rpx;
						height: 38rpx;
						line-height: 38rpx;
						background: rgba(255, 133, 13, 0.51);
						border-radius: 19rpx;
						font-size: 22rpx;
						font-weight: 500;
						color: #F28316;
						vertical-align: middle;
						margin: 30rpx 0;
						image{
							width: 36rpx;
							height: 43rpx;
							vertical-align: middle;
							margin-right: 17rpx;
						}
					}
				}
			}
			.xxcard{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 27rpx 36rpx;
				background: linear-gradient(90deg, #FEBF55 0%, #FFD76E 100%);
				border-radius: 10rpx;
				margin: 30rpx 0;
				view{
					font-size: 28rpx;
					font-weight: 400;
					color: #7B5533;
					vertical-align: middle;
					image{
						width: 41rpx;
						height: 41rpx;
						vertical-align: middle;
						margin-right: 16rpx;
					}
				}
			}
			.z-list-box{
				display: flex;
				box-shadow: 0px 3rpx 32rpx 0px rgba(0, 0, 0, 0.19);
				border-radius: 20rpx;
				background: #FFFFFF;
				padding: 37rpx 0;
				margin-bottom: 56rpx;
				view{
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					image{
						height: 61rpx;
					}
					text{
						font-size: 30rpx;
						font-weight: 400;
						color: #272A29;
						margin-top: 22rpx;
					}
				}
			}
			.q-list-box{
				.list-wrapper{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 50rpx;
					view{
						display: flex;
						align-items: center;
						image{
							height: 36rpx;
						}
						text{
							font-size: 30rpx;
							font-weight: 400;
							color: #000000;
							margin-left: 40rpx;
						}
					}
				}
			}
		}
		.slot-wrap{
			display: flex;
			align-items: center;
			view{
				border: 1px solid #FFFFFF;
				padding: 5px 10px;
				border-radius: 27rpx;
				margin-right: 32rpx;
				display: flex;
				align-items: center;
				image{
					width: 38rpx;
					height: 38rpx;
				}
				text{
					font-size: 24rpx;
					font-weight: 500;
					color: #FFFFFF;
					margin-left: 9rpx;
				}
			}
		}
	}
</style>
