<template>
	<view>
		<u-navbar :border-bottom="false" back-icon-color="#000" :immersive="true" :background="background">
			<view slot="right" class="slot-wrap" >
				<image src="../../static/icon-fx.png" mode=""></image>
			</view>
		</u-navbar>
		<view class="status_bar"></view>
		<view class="video-box"  v-if="spInfo">
			<video :src="spInfo.spdz" @ended="addjf" controls :autoplay="true">
			</video>
		</view>
		<view class="title-info">
			<view class="title">{{spInfo.lcmc}}</view>
			<view class="info-wrapper">
				<view class="info-left">{{spInfo.scsj}}</view>
				<view class="info-right">
					<!-- <view>
						<image src="../../static/icon-dj.png" mode=""></image>
						<text>点赞</text>
					</view> -->
					<view @tap="commentFocus = true">
						<image src="../../static/icon-pj.png" mode=""></image>
						<text>评价</text>
					</view>
				</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="comment-box">
			<view class="comment-wrapper" v-for="(item, index) in commentInfo" :key="index" v-if="item.data[0]">
				<view class="comment-top" >
					<view>{{item.data[0].xsmc}}</view>
					<view>{{item.data[0].pysj}}</view>
				</view>
				<view class="desc" v-if="item.data[0]">{{item.data[0].pynr}}</view>
				<view class="huifu" v-if="i != 0 && items.data != []"  v-for="(items, i) in item.data" :key="i">
					<view v-if="i != 0 && items.pylx == 1"><text>客服反馈：</text>{{items.pynr}}</view>
					<view v-if="i != 0 && items.pylx == 0"><text>{{items.xsmc}}：</text>{{items.pynr}}</view>
				</view>
				<!--  -->
				<view class="huifu-btn" @click="is = 0;commentFocus = true;pynum = item.pynum" 
				v-if="item.data[item.data.length-1].pysfjx == 1 && xsid == item.data[item.data.length-1].pyxsid && item.data[item.data.length-1].pylx == 1">
				回复</view>
				<view style="width: 100%;height: 1px;background: #F5F2ED;margin: 32rpx 0;"></view>
			</view>
		</view>
		<u-empty v-if="commentInfo.length <= 0" text="暂无评论" src="../../static/nopl.png" icon-size="250" mode="list" margin-top="100"></u-empty>
		<view class="input-box">
			<input type="text" v-model="comment" :focus="commentFocus" @blur="commentFocus=false;is = 1;" :auto-blur="true" placeholder="写评价…"/>
			<u-icon name="edit-pen" color="#8A857C" size="36" class="edit"></u-icon>
			<view class="send" @tap="isComment">发送</view>
		</view>
		
		<view class="jf-box animate__animated animate__fadeIn" v-if="jfshow">
			<view class="jf animate__animated animate__bounce">
				<view class="btn">+10积分</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				jfshow:false,
				spInfo:'',
				background:{
					background:'transparent'
				},
				commentInfo:'',
				comment:'',
				commentFocus:false,
				xsid:'',
				is:1, //1添加评论 0回复
				pynum:'',//评语num
			};
		},
		onLoad(obj) {
			this.spInfo = JSON.parse(obj.item)
			this.xsid = getApp().globalData.userInfo.xsid
			this.getComment()
			console.log(this.xsid)
			console.log(this.spInfo)
		},
		watch:{
			pynum(){
				console.log(this.pynum)
			}
		},
		methods:{
			//视频结束，增加积分
			addjf(){
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = '../../static/ding.wav';
				this.$u.post('grzx/updateXueShengJF',{
					xsid:getApp().globalData.userInfo.xsid,
					jifen:10
				}).then(res=>{
					if(res.success){
						this.jfshow = true
						innerAudioContext.onPlay(() => {
						  console.log('开始播放');
						});
						setTimeout(()=>{
							this.jfshow = false
						},3000)
					} else {
						this.$u.toast(res.message)
					}
				}).catch(err => console.log(err))
			},
			getComment(){
				this.$u.post('api/AXXJDController/queryLCPYList',{
					param1:1,
					param2:999999,
					param3:this.spInfo.lcid
				}).then(res=>{
					if(res){
						this.commentInfo = res.rows
					}
					console.log(this.commentInfo)
				}).catch(res=>console.log(res))
			},
			isComment(){
				if(this.comment == ''){
					this.$u.toast('补全内容后发送')
				}
				if(this.is == 1){
					this.sendComment()
				} else {
					this.sendHFComment()
				}
			},
			sendHFComment(){
				this.$u.post('api/AXXJDController/addHFPYInfo',{
					pyxsid:getApp().globalData.userInfo.xsid,
					pylcid:this.spInfo.lcid,
					pynr:this.comment,
					pynum:this.pynum
				}).then(res=>{
					if(res){
						this.$u.toast('回复成功')
						this.comment = ''
						this.is = 1
						this.pynum = ''
						this.getComment()
					} else {
						this.$u.toast('失败，请重试')
					}
				}).catch(err=>this.$u.toast('失败，请重试'))
			},
			sendComment(){
				this.$u.post('api/AXXJDController/addLCPYInfo',{
					pyxsid:getApp().globalData.userInfo.xsid,
					pylcid:this.spInfo.lcid,
					pynr:this.comment
				}).then(res=>{
					if(res){
						this.$u.toast('评论成功')
						this.comment = ''
						this.is = 1
						this.getComment()
					} else {
						this.$u.toast('失败，请重试')
					}
				}).catch(err=>this.$u.toast('失败，请重试'))
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	.input-box{
		position: fixed;
		width: 100%;
		bottom: 0;
		padding: 26rpx 30rpx;
		background: #FFFFFF;
		border: 1px solid #F5F2ED;
		z-index: 9;
		input{
			height: 70rpx;
			line-height: 70rpx;
			background: #EEEEEE;
			border-radius: 35rpx;
			text-indent: 65rpx;
		}
		.edit{
			position: absolute;
			top: 50%;
			left: 50rpx;
			transform: translateY(-50%);
		}
		.send{
			position: absolute;
			top: 50%;
			right: 50rpx;
			transform: translateY(-50%);
			width: 100rpx;
			height: 50rpx;
			background: #61BEFF;
			border-radius: 25rpx;
			font-size: 24rpx;
			color: #FFFFFF;
			line-height: 50rpx;
			text-align: center;
		}
	}
	.comment-box{
		padding: 44rpx 33rpx 100rpx;
		.comment-wrapper{
			.comment-top{
				display: flex;
				justify-content: space-between;
				view{
					font-size: 26rpx;
					color: #8A857C;
				}
			}
			.desc{
				margin: 33rpx 0;
				font-size: 28rpx;
				color: #292621;
			}
			.huifu-btn{
				color: #2B85E4;
				opacity: .6;
				text-align: right;
				font-size: 24rpx;
				z-index: 999;
				margin: 10rpx 0;
			}
			.huifu{
				background-color: rgba($color: #292621, $alpha: 0.05);
				padding: 22rpx;
				&:nth-child(1){
					border-top-left-radius:  15rpx;
					border-top-right-radius:  15rpx;
				}
				&:last-child{
					border-bottom-left-radius:  15rpx;
					border-bottom-right-radius:  15rpx;
				}
				text{
					font-size: 26rpx;
					color: #8A857C;
				}
			}
		}
	}
	.line{
		width: 100%;
		height: 16rpx;
		background: #F8F8F8;
	}
	.title-info{
		padding: 34rpx;
		.title{
			font-size: 36rpx;
			font-weight: bold;
			color: #333333;
			margin-bottom: 32rpx;
		}
		.info-wrapper{
			display: flex;
			justify-content: space-between;
			.info-left{
				font-size: 24rpx;
				color: #999999;
			}
			.info-right{
				display: flex;
				view{
					margin-left: 29rpx;
					image{
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
	.slot-wrap{
		image{
			width: 36rpx;
			height: 36rpx;
			margin-right: 30rpx;
		}
	}
	.video-box{
		margin-top:  var(--status-bar-height);
		video{
			width: 100%;
			height: 562rpx;
		}
	}
</style>
