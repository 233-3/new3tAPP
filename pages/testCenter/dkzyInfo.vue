<template>
	<view class="dkzyinfo">
		<u-navbar title="打卡详情" back-icon-color="#333333" :border-bottom="false">
		</u-navbar>
		<view class="warpper-top-box">
			<image src="../../static/dkzy-top-img.png" class="left-img" mode="widthFix"></image>
			<view class="right-box">
				<view class="title">{{info.dkmc}}</view>
				<view class="desc">
					<view>
						<image src="../../static/dkzy-sj.png"></image>
						<text>时间：{{info.dkkssj}} {{info.dkjssj}}</text>
					</view>
					<view>
						<image src="../../static/dkzy-ren.png"></image>
						<text>发布人：{{info.fbr}}</text>
					</view>
				</view>
			</view>
		</view>
		<view style="display: flex;
				justify-content: space-between;
				align-items: center;">
			<view class="btn-title">作业打卡</view>
			<view style="font-size: 24rpx;display: flex;align-items: center;"><image src="../../static/dkzy-rili.png" style="height: 35rpx;margin-right: 4px;" mode="heightFix"></image>{{dknum}}人参与</view>
		</view>
		<scroll-view class="day-list" scroll-x="true" enable-flex="true">
			<view :class="{'day-wrapper':item.dkrq <= thisTime && item.dksfwc == 1,
						   'day-wrapper-no':item.dkrq > thisTime || item.dksfwc == 0,
						   'day-ac':inde == index}" 
				v-for="(item, index) in dklist" 
				:key="index"
				@click="goDay(index,item.dkrq)">
				<view>{{(item.dkrq).split('-')[2]}}</view>
				<view>第{{index+1}}天</view>
			</view>
		</scroll-view>
		<view class="dkdesc-box">
			<view class="title" style="margin-top: 0;">
				<image src="../../static/icon-zhibian.png" mode="heightFix"></image>
				老师发布的内容
			</view>
			<view class="crad" v-if="dklist[inde]" style="height: auto;">
				<image :src="dklist[inde].dknr" v-if="dklist[inde].dklx == 0" mode="widthFix"></image>
				<video :src="dklist[inde].dknr" v-if="dklist[inde].dklx == 1" style="width: 100%;" controls></video>
				<luch-audio :src="dklist[inde].dknr" v-if="dklist[inde].dklx == 2" poster="../../static/sz.png" :play.sync="autoPlay"></luch-audio>
				<!-- dklx 0图片 1视频 2音频 -->
			</view>
			<view class="title" style="margin-top: 30rpx;">
				<image src="../../static/lk-zy.png" mode="heightFix"></image>
				我今天的打卡内容
			</view>
			<view class="crad" style="position: relative;height: auto;" v-if="dklist[inde]">
				<view class="x" >
					<image :src="url" v-if="lx == 0" mode="widthFix"></image>
					<video :src="url" v-if="lx == 1" style="width: 100%;" controls></video>
					<audio :src="url" v-if="lx == 3"  controls></audio>
				</view>
				<view class="toolbar" v-if="tjdk && dklist[inde].dkrq == thisTime">
					<image @click="openImg()" src="../../static/dkzy-img.png" mode="heightFix"></image>
					<image @click="openVideo()" src="../../static/dkzy-video.png" mode="heightFix"></image>
					<image @click="lyshow = true" src="../../static/dkzy-audio.png" mode="heightFix"></image>
				</view>
			</view>
			<block v-if="dklist[inde]">
				<view class="daan-box" v-if="dklist[inde].dkrq < thisTime">
					<view class="daan-nav"  v-if="dklist[inde].dkda || dklist[inde].dkdp">
						<image src="../../static/dkzy-ls.png" mode="heightFix"></image>
						<view :class="{ac:navIndex == 0}" v-if="dklist[inde].dkda" @click="navIndex = 0">查看答案</view>
						<view :class="{ac:navIndex == 1}" v-if="dklist[inde].dkdp" @click="navIndex = 1">老师反馈</view>
					</view>
					<view class="crad daan-desc"  v-if="dklist[inde].dkda || dklist[inde].dkdp">
						<view v-if="navIndex == 0 && dklist[inde].dkda">
							<image :src="dklist[inde].dkda" v-if="isFileType(dklist[inde].dkda) == 0" mode="widthFix"></image>
							<video :src="dklist[inde].dkda" v-if="isFileType(dklist[inde].dkda) == 1" style="width: 100%;" controls></video>
							<audio :src="dklist[inde].dkda" v-if="isFileType(dklist[inde].dkda) == 3"  controls></audio>
						</view>
						<view v-if="navIndex == 1 && dklist[inde].dkdp">
							dklist[inde].dkdp
						</view>
					</view>
				</view>
			</block>
			<l-file
			    ref="lFile" 
			    @up-success="upSuccess"
			></l-file>
			<u-popup v-model="lyshow"  mode="bottom">
				<view style="padding: 20rpx;">
					<sound-recording @confirm="lyconfirm" @cancel="closely"></sound-recording>
				</view>
			</u-popup>
			<view class="right-btn" v-if="dklist[inde]">
				<button type="default" v-if="tjdk && dklist[inde].dkrq == thisTime" @click="sendInfo">提交打卡</button>
			</view>
			
			<view class="jf-box animate__animated animate__fadeIn" v-if="jfshow">
				<view class="jf animate__animated animate__bounce">
					<view class="btn">+10积分</view>
				</view>
			</view>
			<view class="jf-box animate__animated animate__fadeIn" v-if="jfshowTwo">
				<view class="jftwo animate__animated animate__bounce">
					<image src="../../static/dkzy-addjf.png" mode="widthFix"></image>
					<view class="text">太棒了，每天都坚持打卡了！奖励<text>50</text>积分!</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import luchAudio from '../../components/luch-audio/luch-audio.vue'
	import lFile  from "@/components/l-file/l-file.vue"
	import soundRecording from '@/components/sound-recording/sound-recording.vue'
	export default {
		data() {
			return {
				info:'',
				dkid:'',
				dklist:'',
				inde:1,
				autoPlay:true,
				action:'http://192.168.2.101/upload',
				url:'',
				lx:'', //教师内容类型
				lyshow:false,
				tjdk:true,
				nrlx:'', //上传内容类型
				SFWC:true,
				navIndex:0,
				jfshow:false,
				jfshowTwo:false,
				dknum:'32',
			};
		},
		onLoad(obj) {
			this.info = JSON.parse(obj.item)
			this.dkid = this.info.dkid
			this.getDKInfo()
			this.getNum()
		},
		computed:{
			thisTime(){
				let date = new Date().valueOf()
				return this.$u.timeFormat(date,'yyyy-mm-dd')
			},
		},
		watch:{
			inde(){
				console.log(this.inde)
				console.log(this.dklist[this.inde])
				if(!this.dklist[this.inde].dkxsnr){
					this.SFWC = true
				}
			}
		},
		methods:{
			getNum(){
				this.$u.get('api/ADKZYController/queryDKZYTotal').then(res=>{
					this.dknum = res
				}).catch(err=>console.log(err))
			},
			isFileType(filePath){
				if(this.isAssetTypeAnImage(filePath)){
					return 0
				}
				if(this.isAssetTypeAnVideo(filePath)){
					return 1
				}
				if(this.isAssetTypeAnAudio(filePath)){
					return 2
				}
			},
			isAssetTypeAnVideo(filePath) {
				var index= filePath.lastIndexOf(".");
				var ext = filePath.substr(index+1);
				 return [
				 'mp4', 'rmvb', 'avi', 'mov', 'm4v', '3gp', 'rmvb', 'MPEG',].
				 indexOf(ext.toLowerCase()) !== -1;
			},
			isAssetTypeAnAudio(filePath) {
				var index= filePath.lastIndexOf(".");
				var ext = filePath.substr(index+1);
				 return [
				 'MP3', 'MPEG', 'WMA', 'AAC', 'FLAC', 'APE',].
				 indexOf(ext.toLowerCase()) !== -1;
			},
			isAssetTypeAnImage(filePath) {
				var index= filePath.lastIndexOf(".");
				var ext = filePath.substr(index+1);
				 return [
				 'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].
				 indexOf(ext.toLowerCase()) !== -1;
			},
			//提交打卡
			sendInfo(){
				let isLast = 0
				console.log(this.url)
				if(this.thisTime == this.info.dkjssj){
					isLast = 1
					for(let i=0; i<=this.dklist.length-1;i++){
						console.log(this.dklist[i].dksfwc)
						if(this.dklist[i].dksfwc == 0){
							isLast = 0
						}
					}
				} else {
					console.log('不是')
				}
				if(this.url == '' || this.url == '../../static/dkzy-nodk.png'){
					this.$u.toast('请上传完成后提交')
					return false
				}
				this.$u.post('api/ADKZYController/upXSDKZY',{
					param3:this.dklist[this.inde].dkfkid,
					param4:this.url,
					param1:isLast,
					param5:getApp().globalData.userInfo.xsid,
					param2:this.nrlx
				}).then(res=>{
					if(res){
						this.$u.toast('提交成功')
						if(isLast == 0){
							this.jfshow = true
						} else {
							this.jfshowTwo = true
						}
						setTimeout(()=>{
							this.jfshow = false
							this.jfshowTwo = false
						},2000)
						this.tjdk = false
						this.getDKInfo()
					}
				}).catch(err=>console.log(err))
			},
			lyconfirm(val){
				this.lyshow = false
				this.testUpFile(val,3)
			},
			//点击取消
			closely(){
				this.lyshow = false
			},
			testUpFile(tempFilePaths,lx){
				let url 
				this.nrlx  = lx
				if(lx == 0){
					url = tempFilePaths[0]
				}
				if(lx == 1){
					url = tempFilePaths
				}
				if(lx == 3){
					url = tempFilePaths
				}
				uni.uploadFile({
					url: this.$action, //仅为示例，非真实的接口地址
					filePath: url,
					name: 'file',
					success: (uploadFileRes) => {
						let str = JSON.parse(uploadFileRes.data)
						if(uploadFileRes.statusCode == 200){
							this.lx = lx
							this.url = str.url
							this.SFWC = false
							console.log(this.url,this.lx)
							uni.hideLoading()
						}else {
							uni.hideLoading()
							this.$u.toast('上传失败，请重试')
						}
					},
					fail: () => {
						uni.hideLoading()
						this.$u.toast('上传失败')
					}
				});
			},
			//上传视频
			openVideo(){
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success:  (res) => {
						console.log(JSON.stringify(res.tempFilePaths))
						const tempFilePaths = res.tempFilePath;
						console.log(tempFilePaths)
						uni.showLoading({
						    title: '上传中'
						});
						this.testUpFile(tempFilePaths,1)
					},
					fail: (err) => {
						uni.hideLoading()
						this.$u.toast(err)
						console.log(err)
					},
					complete: (info) => {
						console.log(info)
					}
				});
			},
			//上传图片
			openImg(){
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album','camera'], //从相册选择
				    success:  (res) => {
				        console.log(JSON.stringify(res.tempFilePaths));
						const tempFilePaths = res.tempFilePaths;
						uni.showLoading({
						    title: '上传中'
						});
						this.testUpFile(tempFilePaths,0)
				    }
				});
			},
			//上传成功回调
			upSuccess(res){
				this.url =JSON.parse(res.data.id).url
			},
			//上传文件
			upFile(){
				console.log(this.$mp.page.$getAppWebview())
				this.$refs.lFile.upload({
				    // #ifdef APP-PLUS
				    currentWebview: this.$mp.page.$getAppWebview(),
				    // #endif
				    url: this.action, //测试地址，记得更换
				    name: 'file',
				});
			},
			//预览文件
			openFile(){
				let url = this.url
				/* 下载返回临时路径（退出应用失效） */
				this.$refs.lFile.download(url)
				.then(path=>{
					/* 预览 */
					this.$refs.lFile.open(path)
				});
			},
			//切换日期
			goDay(index,dkrq){
				if(dkrq > this.thisTime){
					this.$u.toast('未到打卡日期')
					return false
				}
				this.$nextTick(function(){
					this.inde = index
					this.lx = this.dklist[this.inde].dkzynrlx
					this.url = this.dklist[this.inde].dkxsnr ? this.dklist[this.inde].dkxsnr : '../../static/dkzy-nodk.png'
				})
			},
			//获取打卡详情
			getDKInfo(){
				this.$u.post('api/ADKZYController/queryDKZYNRList',{
					param3:getApp().globalData.userInfo.xsid,
					param4:this.dkid
				}).then(res=>{
					this.$nextTick(()=>{
						this.url = ''
						this.dklist = res
						for(let i=0; i<= this.dklist.length-1; i++){
							if(this.dklist[i].dkrq == this.thisTime){
								this.inde = i
								if(this.dklist[this.inde].dksfwc == 1){
									this.tjdk = false
								}
							}
						}
						console.log(this.inde)
						console.log('url',this.url)
						console.log('sfwc',this.dklist[this.inde])
						console.log('tjdk',this.tjdk)
						this.lx = this.dklist[this.inde].dkzynrlx
						this.url = this.dklist[this.inde].dkxsnr ? this.dklist[this.inde].dkxsnr : '../../static/dkzy-nodk.png'
					})

				}).catch(err=>console.log(err))
			},
		},
		components:{
			luchAudio,
			lFile,
			soundRecording
		},
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
		.jftwo{
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			margin: 0 auto;
			margin-top: 30%;
			width: 500rpx;
			image{
				width: 450rpx;
			}
			.text{
				margin: 10rpx;
				color: #FFFFFF;
				font-size: 40rpx;
				text{
					font-size: 88rpx;
					color: #F29100;
				}
			}
		}
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
	.daan-box{
		margin-top:20rpx;
		.daan-nav{
			display: flex;
			.ac{
				color: #FFFFFF !important;			
				background: #61BEFF !important;
			}
			image{
				height: 85rpx;
				align-self: flex-end;
			}
			view{
				align-self: flex-end;
				height: 60rpx;
				line-height: 60rpx;
				padding:0 10rpx;
				color: #000000;
				background: rgba(97, 190, 255, 0.33);
				border-radius: 15rpx 15rpx 0 0;
			}
		}
		.daan-desc{
			margin-top: 0 !important;
			height: auto !important;
		}
	}
	.day-ac{
		border: 1px solid #fe976f !important;
	}
	.dkdesc-box{
		padding: 30rpx;
		background: #F4F4F4;
		border-radius: 45rpx;
		margin: 30rpx 0;
		.title{
			font-size: 30rpx;
			font-weight: 500;
			color: #000000;
			vertical-align: middle;
			margin-top: 30rpx;
			image{
				height: 61rpx;
				margin-right: 10rpx;
				vertical-align: middle;
			}
		}
		.crad{
			background: #FFFFFF;
			border-radius: 45rpx;
			padding: 10rpx;
			height: 335rpx;
			margin-top: 30rpx;
			overflow: auto;
			image{
				width: 100%;
			}
			.toolbar{
				position: absolute;
				right: 10rpx;
				bottom: 10rpx;
				image{
					height: 39rpx;
					margin-right: 30rpx;
				}
			}
		}
		.right-btn{
			overflow: hidden;
			margin: 30rpx 0;
			button{
				float: right;
				width: 215rpx;
				height: 56rpx;
				line-height: 56rpx;
				background: #FF8400;
				border-radius: 28rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
	}
	.day-list{
		display: flex;
		flex-wrap: nowrap;
		overflow: hidden;
		white-space: nowrap;
		.day-wrapper-no{
			display: inline-block;
			margin-right: 30rpx;
			width: 71rpx;
			height: 97rpx;
			background: #F5F5F5;
			border-radius: 8rpx;
			text-align: center;
			view{
				&:first-child{
					text-align: center;
					width: 45rpx;
					height: 46rpx;
					line-height: 46rpx;
					background: #E6E6E6;
					border-radius: 50%;
					font-size: 28rpx;
					color: #666666;
					margin: 8rpx auto 5rpx;
				}
				&:last-child{
					font-size: 20rpx;
					font-weight: 400;
					color: #666666;
				}
			}
		}
		.day-wrapper{
			display: inline-block;
			margin-right: 30rpx;
			width: 71rpx;
			height: 97rpx;
			background: #79D485;
			border-radius: 8rpx;
			text-align: center;
			view{
				&:first-child{
					text-align: center;
					width: 45rpx;
					height: 46rpx;
					line-height: 46rpx;
					background: #56B978;
					border-radius: 50%;
					font-size: 28rpx;
					color: #FFFFFF;
					margin: 8rpx auto 5rpx;
				}
				&:last-child{
					font-size: 20rpx;
					font-weight: 400;
					color: #FFFFFF;
				}
			}
		}
	}
	.btn-title{
		width: 240rpx;
		height: 80rpx;
		background: url(../../static/dkzy-btn.png) no-repeat top center;
		background-size: 100% 100%;
		font-size: 36rpx;
		font-weight: 500;
		line-height: 80rpx;
		color: #5E272E;
		text-align: center;
		margin: 30rpx 0;
	}
	.dkzyinfo{
		padding: 30rpx;
		.warpper-top-box{
			padding: 25rpx 20rpx;
			background: #F4F4F4;
			border-radius: 45rpx;
			display: flex;
			.left-img{
				width: 150rpx;
				margin: -50rpx 30rpx 0 0;
			}
			.right-box{
				.title{
					font-size: 34rpx;
					font-weight: 500;
					color: #000000;
					margin-bottom: 22rpx;
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
			}
		}
	}
</style>
