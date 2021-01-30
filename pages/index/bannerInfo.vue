<template>
	<view>
		<u-navbar :border-bottom="false">
			<view slot="right" class="slot-wrap" @tap="shareShow = true" >
				分享
			</view>
		</u-navbar>
		<u-action-sheet :list="shareList" @click="shareClick" v-model="shareShow"></u-action-sheet>
		<view class="content">
			<text class="news_bt">{{title}}</text>
			<view class="news_con" v-html="desc">
				
			</view>
			<view class="zan" v-if="zan" @click="up">
				<image src="../../static/images/zan.jpg" alt=""></image>
				<text>{{zan}}人已赞</text>
			</view>
			<text class="list_tit" v-if="kcList.length>0">推荐课程</text>
			<view class="listBox">
				<view class="list" v-for="(item, index) in kcList" :key="index">
					<view class="left">
						<image :src="item.kc_fm" alt=""></image>
						<view class="kc_lx" v-if="item.kc_sfsf == 1">
							<image src="../../static/images/class_Vip.png" ></image>
							<text>VIP</text>
						</view>
						<view class="kc_lx"  v-if="item.kc_sfsf == 0">
							<image src="../../static/images/class_mf.png" ></image>
							<text class="fm_active">{{item.kc_sfsf == 0? '免费': '限免'}}</text>
						</view>
					</view>
					<view class="right">
						<text class="title">{{item.kc_mc}}</text>
						<view class="jj">
							<image src="../../static/images/class_bf.png" alt="" class="bf"></image>
							<text class="weike" v-if="!item.kc_wksl" >微课：{{item.kc_wksl}}节</text>
							<text class="weike" v-if="item.kc_wksl" >讲师：{{item.kc_wksl}}</text>
							<image src="../../static/images/class_shu.png" alt="" class="shu" v-if="item.kc_wksl"> </image>
							<text class="lianxi"  v-if="item.kc_wksl" >练习：{{item.kc_lxsl}}套</text>
						</view>
						<view class="xx">
							<text class="xuexi">{{item.kc_xxrc}}人已学习</text>
							<text>进入学习</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xsid:'',
				wzid:'',
				wzInfo:'',
				bannerId:'',
				kcList:'',
				title: '',
				desc: '',
				sfdz: 0,
				zan:'',
				shareShow: false,
				shareList: [{
					text: '发送给微信好友',
					color: '#3d92fc',
				}, {
					text: '分享到微信朋友圈',
					color: '#3d92fc',
				}],
			};
		},
		onLoad(obj) {
			console.log(obj)
			this.xsid = obj.xsid
			this.wzid = obj.wzid
			this.bannerId = obj.bannerId
			this.getInfo()
			this.getKCList()
		},
		methods:{
			//获取详情
			getInfo(){
				this.$u.post('api/AppBannerController/queryWZInfo',{
					param3:this.wzid,
					param4:this.xsid
				}).then(res=>{
					this.title = res.lxwzbt
					res.lxwznr = res.lxwznr.replace(/<img/g, '<img style="width: 100%; display:block;"')
					res.lxwznr = res.lxwznr.replace(/<p/g, '<p style="font-size: 15px; color: #777;line-height: 23px;"')
					res.lxwznr = res.lxwznr.replace(/<video/g, '<video style="width: 100%;"')
					this.desc = res.lxwznr
					this.zan = res.lxwzdzsl
				}).catch(err=>console.log(err))
			},
			//获取关联课程
			getKCList(){
				this.$u.post('api/AppBannerController/queryBannerKC',{
					param3:this.bannerId
				}).then(res=>{
					this.kcList = res
				}).catch(err=>console.log(err))
			},
			//点赞
			up(){
				this.$u.post('/api/AppBannerController/addDZInfo',{
					dzwzid:this.wzid,
					dzxsid:this.xsid
				}).then(res=>{
					console.log(res)
					if(res){
						this.$u.toast('点赞成功')
					}
				})
			},
			shareClick(val){
				console.log(val)
				let baseUrl = 'http://192.168.2.101'
				if(val == 0){
					uni.share({
					    provider: "weixin",
					    scene: "WXSceneSession",
					    type: 0,
					    href: `${baseUrl}shareclass.html?id=${this.kcid}`,
					    title: this.kcmc,
					    summary: "做了解你的学习时光机",
					    imageUrl: "../../static/images/touxiang.png",
					    success: function (res) {
					        console.log("success:" + JSON.stringify(res));
					    },
					    fail: function (err) {
					        console.log("fail:" + JSON.stringify(err));
					    }
					})
					
				} else {
					uni.share({
						provider: "weixin",
						scene: "WXSenceTimeline",
						type: 1,
						summary: "做了解你的学习时光机",
						success: function (res) {
							console.log("success:" + JSON.stringify(res));
						},
						fail: function (err) {
							console.log("fail:" + JSON.stringify(err));
						}
					})
				}
				
			}
		}
	}
</script>


<style lang="scss">
	.slot-wrap{
		padding: 0 15rpx;
		margin-right: 30rpx;
		border: 1px solid #424242;
		border-radius: 15rpx;
	}
	.content{
		padding: 15rpx 30rpx;
		.news_bt{
			width: 90%;
			margin: 0 auto;
			font-size: 36rpx;
			color: #303030;
			line-height: 50rpx;
		}
		.news_con{
			width: 100%;
			margin: 0 auto;
			padding: 50rpx 0;
			p{
				font-size: 30rpx;
				line-height: 46rpx;
				color: #323232;
			}
			img{
				display: block;
				width: 100%;
				margin: 30rpx 0;
			}
		}
		.zan{
			margin-top: 30rpx;
			display: flex;
			flex-direction: column;
			image{
				display: block;
				width: 50rpx;
				height: 58rpx;
				margin: 0 auto;
			}
			text{
				text-align: center;
				font-size: 30rpx;
				color: #444;
				margin-top: 20rpx;
			}
		}
		.list_tit{
			display: block;
			font-size: 32rpx;
			color: #353535;
			width: 90%;
			margin: 70rpx auto 40rpx auto;
			font-weight: bold;
		}
		.listBox{
			.list{
				width: 90%;
				margin: 0 auto 30rpx auto;
				padding: 34rpx 20rpx;
				display: flex;
				box-shadow: 0 0 30rpx #eee;
				.left{
					width: 96px;
					height: 96px;
					position: relative;
					image {
						display: block;
						width: 100%;
						height: 100%;
					}
					.kc_lx{
						position: absolute;
						right: 0;
						top: 0;
						width: 60rpx;
						height: 60rpx;
						image {
							display: block;
							width: 60rpx;
							height: 60rpx;
						}
						text {
							position: absolute;
							top: 0;
							right: -6rpx;
							width: 60rpx;
							line-height: 44rpx;
							transform: rotate(45deg);
							color: #fff;
							font-size: 20rpx;
							text-align: center;
						}
						.fm_active{
							color: #333;
						}
					}
				}
				.right{
					margin-left: 30rpx;
					flex: .96;
					display: flex;
					flex-direction: column;
					height: 192rpx;
					position: relative;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					.title{
						height: 46rpx;
						line-height: 36rpx;
						display: inline-block;
						width: 100%;
						font-size: 32rpx;
						color: #222;
						margin-top: 6rpx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						font-weight: bold;
					}
					.jj{
						display: flex;
						align-items: center;
						margin-top: 22rpx;
						text {
							font-size: 26rpx;
							color: #969696;
							margin-left: 10rpx;
						}
						.bf{
							display: block;
							width: 24rpx;
							height: 24rpx;
						}
						.shu{
							display: block;
							width: 24rpx;
							height: 30rpx;
							margin-left: 64rpx;
						}
					}
					.xx{
						display: flex;
						align-items: center;
						justify-content: space-between;
						position: absolute;
						bottom: 0;
						left: 0;
						width: 100%;
						text{
							&:first-child{
								font-size: 28rpx;
								color: #999;
							}
							&:last-child{
								font-size: 32rpx;
								color: #1587ff;
							}
						}
					}
				}
			}
		}
	}
</style>

