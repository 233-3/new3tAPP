<template>
	<view class="td-wrapper">
		<u-navbar :title="mc" :border-bottom="false" :background="background">
			<view class="slot-wrap" slot="right">
				<u-icon name="info-circle" size="38" @click="is_look = true"></u-icon>
			</view>
		</u-navbar>
		<view class="page-section-spacing">
			<swiper class="swiper" :indicator-dots="false" @change="resetData">
				<swiper-item v-for="(item, index) in lxList" :key="index" style="height: 100%;">
					<div class="lx1" v-if="item.lx == 1">
						<p class="word" :class="{'changeColor': showLB == 'lx1phonetic'}" @tap.stop="audiofayin(item.lxaybfy, 'lx1phonetic')">{{item.lxayb}}</p>
						<p class="phonetic" :class="{'changeColor': showLB == 'lx1word'}" @tap.stop="audiofayin(item.lxadcfy, 'lx1word')">{{item.lxadc}}</p>
						<img :src="item.lxatp" alt="" class="tp">
					</div>

					<div class="lx1 lx2" v-else-if="item.lx == 2">
						<p class="word" :class="{'changeColor': showLB == 'lx2phonetic'}" @tap.stop="audiofayin(item.lxbzmfy, 'lx2phonetic')">{{item.lxbzm}}</p>
						<p class="phonetic" :class="{'changeColor': showLB == 'lx2word'}" @tap.stop="audiofayin(item.lxbdcfy, 'lx2word')">{{item.lxbdc}}</p>
						<img :src="item.lxbtp" alt="" class="tp">
					</div>

					<div class="lx1 lx3" v-else-if="item.lx == 3">
						<p class="word" :class="{'changeColor': showLB == 'lx3phonetic'}" @tap.stop="audiofayin(item.lxcdcfy, 'lx3phonetic')">{{item.lxcdc}}</p>
						<p class="phonetic" :class="{'changeColor': showLB == 'lx3word'}" @tap.stop="audiofayin(item.lxcybfy, 'lx3word')">{{item.lxcyb}}</p>
						<img :src="item.lxctp" alt="" class="tp">
					</div>

					<div class="lx4" v-else-if="item.lx == 4">
						<p class="word" :class="{'changeColor': showLB == 'lx4word'}" @tap.stop="audiofayin(item.lxddcfy, 'lx4word')">{{item.lxddc}}</p>
						<p class="phonetic" :class="{'changeColor': showLB == 'lx4phonetic'}" @tap.stop="audiofayin(item.lxdybfy, 'lx4phonetic')">{{item.lxdyb}}</p>
						<p class="font">{{item.lxdzs}}</p>
					</div>

					<div class="lx5" v-else-if="item.lx == 5">
						<p class="word" :style="{'text-align': item.lxejz.length > 40? 'left': 'center'}" :class="{'changeColor': showLB == 'lx5phonetic'}"
						 @tap.stop="audiofayin(item.lxejzfy, 'lx5phonetic')">{{item.lxejz}}</p>
						<p class="phonetic" :style="{'text-align': item.lxejzzs.length > 20? 'left': 'center'}">{{item.lxejzzs}}</p>
					</div>

					<div class="lx6" v-else-if="item.lx == 6">
						<div class="sentence" @tap.stop="audiofayin(item.lxfjzfya, 'lx61')">
							<div class="tupi">
								<img :src="item.txa" alt="" class="touxiang">
							</div>
							<p :class="{'changeColor': showLB == 'lx61'}">{{item.lxfjza}}</p>
						</div>
						<div class="sentence" @tap.stop="audiofayin(item.lxfjzfyb,  'lx62')" v-if="item.lxfjzb">
							<div class="tupi">
								<img :src="item.txb" alt="" class="touxiang">
							</div>
							<p :class="{'changeColor': showLB == 'lx62'}">{{item.lxfjzb}}</p>
						</div>
						<div class="sentence" @tap.stop="audiofayin(item.lxfjzfyc, 'lx63')" v-if="item.lxfjzc">
							<div class="tupi">
								<img :src="item.txc" alt="" class="touxiang">
							</div>
							<p :class="{'changeColor': showLB == 'lx63'}">{{item.lxfjzc}}</p>
						</div>
						<div class="sentence" @tap.stop="audiofayin(item.lxfjzfyd,  'lx64')" v-if="item.lxfjzd">
							<div class="tupi">
								<img :src="item.txd" alt="" class="touxiang">
							</div>
							<p :class="{'changeColor': showLB == 'lx64'}">{{item.lxfjzd}}</p>
						</div>
					</div>
				</swiper-item>
			</swiper>
		</view>
		<view class="audios">
			<view class="auDio">
				<image src="../../static/images/fast.png" alt="" @tap="playVideoVoice" class="fast">
				<image src="../../static/images/recording.png"  @tap="startRecord" v-if="recordSwitch" alt="" class="recording">
				<view class="recordingEnd" @tap="endRecord"  v-else>
					<image src="../../static/images/zt.png" alt="" class="zanting">
					<view class="rschedule"></view>
				</view>
				<image src="../../static/images/slow.png" @tap="playVoice" class="bfly" alt="">
			</view>
		</view>
		<video id="myVideo" :src="videoPath" class="hidden" ref="video"></video>
		<div class="tips" v-if="is_look">
			<text></text>
			<image src="../../static/images/tips.png" mode="widthFix">
			<image src="../../static/images/iKnow.png" @tap="iknow">
		</div>
	</view>
</template>

<script>
	import permision from "@/common/permission.js"
	const recorderManager = uni.getRecorderManager()
	const innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.autoplay = true
	export default {
		data() {
			return {
				mc: '',
				id: '',
				background: {
					backgroundColor: 'transparent',
				},
				lxList: '',
				showLB: '',
				videoPath: '',
				voicePath:'',
				recordSwitch: true,
				is_look:true
			};
		},
		onLoad(obj) {
			this.mc = obj.mc
			this.id = obj.id
			this.getInfo()
			this.getStorage()
			//录音结束
			recorderManager.onStop((res) => {
				console.log('recorder stop' + JSON.stringify(res));
				this.voicePath = res.tempFilePath;
			});
		},
		methods: {
			//获取缓存数据
			getStorage(){
				try {
				    const value = uni.getStorageSync('is_look');
				    if (value) {
				        this.is_look = false
				    }
				} catch (e) {
				    console.log(e)
				}
			},
			//关闭提示层
			iknow(){ 
				try {
				    uni.setStorageSync('is_look', true);
					this.is_look = false
				} catch (e) {
				    console.log(e)
				}
			},
			//重置数据
			resetData(){
				this.showLB = ''
				this.videoPath = ''
				this.voicePath = ''
				innerAudioContext.src = ''
			},
			//获取音频
			getInfo() {
				this.$u.post('api/ATDYLController/queryNR', {
					jcid: this.id
				}).then(res => {
					this.lxList = res
				})
			},
			// 开始录音
			async startRecord() {
				this.recordSwitch = false
				let status = await this.checkPermission();
				if (status !== 1) {
					return;
				}
				recorderManager.start({
					format: 'mp3'
				})
			},
			//录音结束
			endRecord() {
				this.recordSwitch = true
				recorderManager.stop()
			},
			//播放录音
			playVoice() {
				if (this.voicePath) {
					innerAudioContext.src = this.voicePath
					innerAudioContext.play()
				} else {
					uni.showToast({
					    title: '请先录音',
					    position:'center',
						icon:'none'
					});
					return false
				}
			},
			//读音频
			audiofayin(val, lx) {
				this.videoPath = encodeURI(val)
				this.showLB = lx
				this.$nextTick(function() {
					this.videoContext = uni.createVideoContext('myVideo')
					this.videoContext.playbackRate(1)
					this.videoContext.play()
				})
			},
			// 慢速播放音频
			playVideoVoice() {
				if(!this.videoPath){
					uni.showToast({
					    title: '请先选中音频',
					    position:'center',
						icon:'none'
					});
					return false
				}
				this.videoContext = uni.createVideoContext('myVideo')
				this.videoContext.playbackRate(.8)
				this.videoContext.play()
			},
			//权限相关
			async checkPermission() {
				let status = permision.isIOS ? await permision.requestIOS('record') :
					await permision.requestAndroid('android.permission.RECORD_AUDIO');
				if (status === null || status === 1) {
					status = 1;
				} else if (status === 2) {
					uni.showModal({
						content: "系统麦克风已关闭",
						confirmText: "确定",
						showCancel: false,
						success: function(res) {}
					})
				} else {
					uni.showModal({
						content: "需要麦克风权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tips{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background: rgba(0, 0, 0, .5);
	}
	.tips text{
		height: 30px;
	}
	.tips image{
		width: 100%;
		margin-top: 75rpx;
	}
	.tips image:last-child{
		position: absolute;
		width: 117px;
		height: 50px;
		bottom: 50px;
		z-index: 999;
		left: 0;
		right: 0;
		margin: auto;
	}
	.audios {
		width: 100%;
		height: 170px;
	}

	.progress {
		width: 90%;
		margin: 0 auto;
		display: flex;
		height: 30px;
		align-items: center;
		justify-content: space-between;
		opacity: 0;
	}

	.progress>p {
		width: 15%;
	}

	.progress>div {
		width: 75%;
		height: 16px;
		display: flex;
		align-items: center;
		position: relative;
	}

	.progress>div>.all {
		width: 100%;
		height: 6px;
		border-radius: 50px;
		background: #ececee;
	}

	.progress>div>.now {
		width: 0;
		height: 6px;
		border-radius: 50px;
		background: #4468f4;
		position: absolute;
		left: 0;
		top: 50%;
		margin-top: -3px;
		/* transition: all 1s linear; */
	}

	.progress>div>.btn {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #fff;
		position: absolute;
		left: 0;
		/* transition: all 1s linear; */
	}

	.auDio {
		width: 90%;
		margin: 25px auto 0 auto;
		display: flex;
		justify-content: space-between;
	}

	.auDio image {
		display: block;
		width: 54px;
		height: 54px;
	}

	.recordingEnd {
		position: relative;
		width: 54px;
		height: 54px;
	}

	.rschedule {
		background-color: rgba(0, 0, 0, 0);
		border: 5px solid rgba(0, 183, 229, 0.9);
		opacity: .9;
		border-left: 5px solid rgba(0, 0, 0, 0);
		border-right: 5px solid rgba(0, 0, 0, 0);
		border-radius: 50px;
		width: 54px;
		height: 54px;
		margin: 0 auto;
		-webkit-animation: spin 1s infinite linear;
		animation: spin 1s infinite linear;
		position: absolute;
		left: 0;
		top: 0;
	}

	@-webkit-keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.changeColor {
		color: red !important;
	}

	.hidden {
		position: fixed;
		z-index: -1;
		width: 1upx;
		height: 1upx;
	}

	uni-swiper {
		display: block;
		height: 100%;
	}

	.td-wrapper {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: url(../../static/tdyl-bg3.png) no-repeat center center;
		background-size: 100% 100%;
		padding: 30rpx;
	}

	.slot-wrap {
		padding-right: 30rpx;
	}

	.page-section-spacing {
		height: 660rpx;
		overflow: auto;
	}

	.lx1 .word {
		margin-top: 60rpx;
		font-size: 44rpx;
		text-align: center;
		color: #111;
		font-family: "times new roman";
		/* color: #5e2507; */
		/* font-weight: bold; */
	}

	.lx1 .phonetic {
		font-size: 32rpx;
		text-align: center;
		color: #111;
		margin-top: 80rpx;
		/* font-weight: bold; */
	}

	.listenLB {
		display: block;
		width: 19px;
		height: 19px;
		margin: 5px auto;
	}

	.lx1 .tp {
		display: block;
		width: 170px;
		height: 170px;
		margin: 25px auto 0 auto;
	}

	.lx4 .word {
		margin-top: 70px;
		font-size: 21px;
		text-align: center;
		color: #111;
		font-family: "times new roman";
	}

	.lx4 .phonetic {
		font-size: 16px;
		text-align: center;
		margin-top: 30px;
		color: #111;
	}

	.lx4 .font {
		font-size: 22px;
		text-align: center;
		margin-top: 70px;
		color: #111;
	}

	.lx5 .word {
		display: block;
		width: 90%;
		height: auto;
		margin: 90px auto 0 auto;
		font-size: 20px;
		text-align: center;
		line-height: 30px;
		color: #111;
		word-wrap: break-word;
		font-family: "times new roman";
	}

	.lx5 .phonetic {
		display: block;
		width: 90%;
		height: auto;
		margin: 40px auto 0 auto;
		font-size: 18px;
		text-align: center;
		color: #111;
		word-wrap: break-word;
		line-height: 30px;
	}

	.lx6 {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.lx6 .sentence {
		width: 90%;
		margin: 15px auto 15px auto;
		height: auto;
		display: flex;
		align-items: center;
		position: relative;
		border: 10rpx solid #164DD8;
		border-radius: 34rpx;
	}

	.lx6 .tupi {
		width: 60px;
		height: 60px;
		position: absolute;
		z-index: 5;
		top: 32%;
		margin-top: -30px;
		padding: 10px;
		overflow: hidden;
	}

	.lx6 p {
		background: linear-gradient(0deg, #FE7D27, #FFDC43);
		border-radius: 24rpx;
		width: 100%;
		line-height: 20px;
		font-size: 32rpx;
		color: #FFFFFF;
		border: 8rpx solid #1278C6;
		word-wrap: break-word;
		box-shadow: 0px 3rpx 30rpx 0px rgba(174, 212, 253, 0.4);
	}

	.sentence:nth-child(odd) .tupi {
		left: -5px;
		background: url(../../static/t-left.png) no-repeat;
		background-size: cover;
	}

	.sentence:nth-child(even) .tupi {
		right: -5px;
		background: url(../../static/t-right.png) no-repeat;
		background-size: cover;
	}

	.sentence:nth-child(odd) p {
		padding: 13px 50px 13px 82px;
	}

	.sentence:nth-child(even) p {
		padding: 13px 82px 13px 50px;
	}

	.sentence .touxiang {
		display: block;
		width: 60px;
		height: 60px;
		border-radius: 50%;

	}

	.laba {
		display: block;
		width: 19px;
		height: 19px;
		position: absolute;
		bottom: 0;
	}

	.sentence:nth-child(even) .laba {
		left: 0;
	}

	.sentence:nth-child(odd) .laba {
		transform: rotate(180deg);
		right: 0;
	}

	.audios {
		width: 100%;
		height: 170px;
	}

	.progress {
		width: 90%;
		margin: 0 auto;
		display: flex;
		height: 30px;
		align-items: center;
		justify-content: space-between;
		opacity: 0;
	}

	.progress>p {
		width: 15%;
	}

	.progress>div {
		width: 75%;
		height: 16px;
		display: flex;
		align-items: center;
		position: relative;
	}

	.progress>div>.all {
		width: 100%;
		height: 6px;
		border-radius: 50px;
		background: #ececee;
	}

	.progress>div>.now {
		width: 0;
		height: 6px;
		border-radius: 50px;
		background: #4468f4;
		position: absolute;
		left: 0;
		top: 50%;
		margin-top: -3px;
		/* transition: all 1s linear; */
	}

	.progress>div>.btn {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #fff;
		position: absolute;
		left: 0;
		/* transition: all 1s linear; */
	}
</style>
