<template>
	<view class="content">
		<view class="status_bar" style="background: #FFFFFF;">
		</view>
		<!-- <view class="test"></view> -->
		<view class="head_t">
			<view class="head_left" v-if="userInfo" @click="handelTX">
				<image :src="userInfo.xstx ? userInfo.xstx : require('@/static/login_img.png')" alt=""></image>
				<text>{{userInfo.xsmc}}</text>
			</view>
			<view class="head_right" >
				<image src="../../static/saoma.png" @click="saoma" mode="heightFix"></image>
				<image src="../../static/xiaoxi.png" @click="goMsg" :class="{msg:num}" mode="heightFix"></image>
			</view>
		</view>
		
		<view class="banner">
			<u-swiper @click="BannerInfo" height="287" :list="bannerList" name="tp"></u-swiper>
		</view>
		
		<view class="nav-list">
			<view @tap="$isLogin() ? $u.route('pages/index/hotKCList') : $goLogin()">
				<image src="../../static/index-top-01.png" mode=""></image>
				<text>教材课程</text>
			</view>
			<view @tap="$isLogin() ? $u.route('pages/index/tzkcList') : $goLogin()">
				<image src="../../static/index-top-02.png" mode=""></image>
				<text>拓展课程</text>
			</view>
			<view @tap="$isLogin() ? $u.route('pages/index/jtjyList') : $goLogin()">
				<image src="../../static/index-top-03.png" mode=""></image>
				<text>家庭教育</text>
			</view>
			<view @tap="$isLogin() ? $u.route('pages/index/myxx') : $goLogin()">
				<image src="../../static/index-top-04.png" mode=""></image>
				<text>我的学习</text>
			</view>
		</view>
		
		<view class="kc-nav">
			<view class="kc-left">
				<view class="line-left-blue"></view>
				<view 
					:class="{fontActive:xkid == item.xkid}"
					v-for="(item, index) in xkList"
					:key="index"
					@click="xkmc = item.xkmc;xkid=item.xkid;getNJ()"
					>{{item.xkmc}}</view>
			</view>
			<view class="lc-right" >
				<u-icon @tap="njShow = !njShow" :label="njmc" name="arrow-down-fill" label-size="30" label-pos="left" :margin-left="15" size="22" style="margin-right: 20rpx;"></u-icon>
				<u-icon @tap="qbShow = !qbShow" :label="qbmc" name="arrow-down-fill" label-size="30" label-pos="left" :margin-left="15" size="22"></u-icon>
			</view>
		</view>
		<u-select v-if="qbList" @confirm="qbConfirm" v-model="qbShow" :list="qbList" value-name="qbid" label-name="qbmc"></u-select>
		<u-select v-if="njList" @confirm="njConfirm" v-model="njShow" :list="njList" value-name="njid" label-name="njmc"></u-select>
		
		<view class="kc-list">
			<view class="kc-wrapper" v-for="(item, index) in listInfo" :key="index" @click="$isLogin() ? $u.route('pages/index/kcInfo',{item:JSON.stringify(item),xkid:xkid}) : $goLogin()">
				<view class="kc-img">
					<u-image width="168rpx" height="210rpx" :src="item.kc_fm ? item.kc_fm : $errImg"></u-image>
					<!-- <image :src="item.kc_fm ? item.kc_fm : $errImg" ></image> -->
					<text v-if="shzt == 0" :class="{'fm_active': item.kc_sfsf != 1}">{{item.kc_sfsf == 1? 'VIP': (item.kc_sfsf == 0? '免费': '限免')}}</text>
				</view>
				<view class="kc-info">
					<text class="kc-title">{{item.kc_mc}}</text>
					<view class="jczy-box">
						<view>
							<image src="../../static/icon-jc.png" mode=""></image>
							<text>讲次：{{item.jcTotal}}讲</text>
						</view>
						<view>
							<image src="../../static/icon-zy.png" mode=""></image>
							<text>作业：{{item.zyTotal}}套</text>
						</view>
					</view>
					<view class="bottom-btn">开始学习</view>
				</view>
			</view>
		</view>
		
		<!-- <view class="text-area">
			<button @tap="upFile">上传文件/图片/视频</button>
			<button @tap="openFile" v-if="url">预览</button>
			<button @tap="upVoiceFile">上传音频文件</button>
			<l-file 
			    ref="lFile" 
			    @up-success="upSuccess"
			></l-file>
		</view>
		<navigator url="/pages/tongbusijuan/tongbusijuan" hover-class="navigator-hover">
			<button type="default">同步试卷</button>
		</navigator> -->
	</view>
</template>

<script>
	import lFile  from "@/components/l-file/l-file.vue"
	export default {
		data() {
			return {
				title: 'Hello',
				action:'http://192.168.2.101/upload',
				url:'',
				bannerList:[],
				//学科相关
				xkList:[],
				xkmc:'',
				xkid:'',
				//年级相关
				njList:[],
				njmc:'',
				njid:'',
				njShow:false,
				//期别相关
				qbList:[],
				qbmc:'',
				qbid:'',
				qbShow:false,
				userInfo:'',
				listInfo:'',
				shzt:'',
				num:0, //信息条数
			}
		},
		onShow() {
			this.shzt = getApp().globalData.shzt
			this.getUserInfo()
			this.getNoLook()
		},
		created() {
			this.getBannerList()
			this.getXK()
			this.getNoLook()
		},
		onPullDownRefresh() {
			this.getBannerList()
			this.getXK()
			this.getNoLook()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 300);
		},
		methods: {
			//点击头像
			handelTX(){
				if(this.$isLogin()){
					this.$u.route({
						type:'tab',
						url:'pages/center/index'
					})
				}else {
					this.$goLogin()
				}
			},
			getNoLook(){
				this.$u.post('api/FXXController/queryWDList',{
					param3:getApp().globalData.userInfo.xsid,
				}).then(res=>{
					for(let i=0; i <= res.length-1;i++){
						this.num = res[i].total
						console.log('num',this.num)
					}
				}).catch(err=>console.log(err))
			},
			//去信息页
			goMsg(){
				console.log(this.$isLogin())
				if(this.$isLogin()){
					uni.setStorage({
					    key: 'inde',
					    data: 2,
					    success: function () {
					        console.log('success');
					    }
					});
					this.$u.route({
						type:'tab',
						url:'pages/jxhd/jxhd'
					})
				}else {
					this.$goLogin()
				}
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
			//获取用户信息
			getUserInfo(){
				this.userInfo = getApp().globalData.userInfo
			},
			//切换年级
			njConfirm(val){
				this.njid = val[0].value
				this.njmc = val[0].label
				this.getQBList()
			},
			//切换期别
			qbConfirm(val){
				this.qbid = val[0].value
				this.qbmc = val[0].label
				this.getListInfo()
			},
			//获取同步学科
			getXK(){
				this.$u.get('/api/ACommonController/queryTBJCXKList').then(res=>{
					if(res){
						this.xkList = res
						this.xkmc = res[0].xkmc
						this.xkid = res[0].xkid
						this.getNJ()
					}
				})
			},
			//获取同步年级
			getNJ(){
				this.$u.post('/api/ACommonController/queryTBJCNJList',{
					xkid:this.xkid
				}).then(res=>{
					if(res){
						let myNjId = getApp().globalData.userInfo.xsnj
						// console.log('我的年级id',myNjId)
						this.njList = res
						for(let i=0; i<= this.njList.length-1; i++){
							// console.log(this.njList[i].njid,myNjId)
							if(this.njList[i].njid == myNjId){
								// console.log(this.njList[i])
								this.njmc = this.njList[i].njmc
								this.njid = this.njList[i].njid
								this.getQBList()
								return false
							} else {
								this.njmc = '三年级'
								this.njid = 3
							}
						}
						this.getQBList()
						return false						
					}
				})
			},
			//获取同步期别
			getQBList(){
				this.$u.post('/api/ACommonController/queryTBJCQBList',{
					xkid:this.xkid,
					njid:this.njid
				}).then(res=>{
					if(res){
						this.qbList = res
						this.qbmc = res[0].qbmc
						this.qbid = res[0].qbid
						this.getListInfo()
					}
				})
			},
			//获取教材全部数据
			getListInfo(){
				this.$u.post('api/AJCKCController/queryList',{
					param1:1,
					param2:10,
					param3:getApp().globalData.userInfo.xsid,
					xkid:this.xkid,
					njid:this.njid,
					qbid:this.qbid
				}).then(res=>{
					console.log('教材数据',res.rows)
					this.$nextTick(function(){
						this.listInfo = res.rows
					})
				})
			},
			//获取banner数据
			getBannerList(){
				this.$u.get('api/AppBannerController/queryBanner').then(res=>{
					console.log('banner',res)
					this.bannerList = res
				})
			},
			//点击banner
			BannerInfo(index){
				let lx = this.bannerList[index].lx
				let wzid = this.bannerList[index].wzid
				let id = this.bannerList[index].id
				if(lx == 0){
					this.$u.route('pages/index/bannerInfo',{
						wzid,
						xsid:getApp().globalData.userInfo.xsid,
						bannerId:id
					})
				} else {
					return false
				}
			},
			//上传录音文件
			upVoiceFile(){
				if(!this.voicePath){
					uni.showModal({
						content: "文件为空",
						confirmText: "确定",
						showCancel: false,
						success: function(res) {}
					})
				}
				uni.uploadFile({
					url: this.action, //仅为示例，非真实的接口地址
					filePath: this.voicePath,
					name: 'file',
					success: (uploadFileRes) => {
						console.log('录音上传成功:',uploadFileRes.data)
						this.voicePathTwo = JSON.parse(uploadFileRes.data).url
						console.log('录音取值成功:',this.voicePathTwo)
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

		},
		components:{
			lFile
		}
	}
</script>

<style lang="scss" scoped>
	.fontActive{
		font-size: 36rpx;
		font-weight: 500;
		color: #393939;
	}
	.kc-list{
		.kc-wrapper{
			display: flex;
			background: #FFFFFF;
			box-shadow: 0px 5px 27px 0px rgba(4, 0, 0, 0.09);
			border-radius: 20px;
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
				text{
					position: absolute;
					top: 0;
					right: -40rpx;
					width: 120rpx;
					line-height: 40rpx;
					transform: rotate(45deg);
					color: #fff;
					font-size: 12px !important;
					text-align: center;
					background: #ff6f4c;
				}
				.fm_active{
					// color: #333;
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
				.kc-title{
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
					font-size: 30rpx;
					font-weight: 500;
					color: #333333;
				}
				image{
					width: 24rpx;
					height: 24rpx;
					margin-right: 12rpx;
				}
			}
		}
	}
	.nav-list{
		display: flex;
		margin: 73rpx 0;
		view{
			display: flex;
			flex-direction: column;
			flex: 1;
			align-items: center;
			image{
				width: 98rpx;
				height: 98rpx;
				margin: 0 0 32rpx 0;
			}
			text{
				font-size: 32rpx;
				font-weight: 400;
				color: #333333;
			}
		}
	}
	.kc-nav{
		display: flex;
		justify-content: space-between;
		margin-bottom: 46rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #393939;
		.kc-left{
			display: flex;
			align-items: center;
			view{
				margin-right:45rpx;
				&:first-child{
					margin-right: 13rpx;
				}
			}
		}
	}
	.line-left-blue{
		width: 10rpx;
		height: 38rpx;
		background: #61BEFF;
		border-radius: 5rpx;
	}

	.content {
		padding: 30rpx;
	}
	.hidden {
		position: fixed;
		z-index: -1;
		width: 1upx;height: 1upx;
	}
	.test{
		height: 88rpx;
		width: 100%;
		background: #FFFFFF;
		position: fixed;
		top:0;
		left: 0;
		z-index: 9998;
	}
	.head_t {
		box-sizing: border-box;
		height: 88rpx;
		width: 100%;
		padding: 0 5%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		position: fixed;
		top:var(--status-bar-height);
		left: 0;
		z-index: 99;
	}
	
	.head_left {
		display: flex;
		align-items: center;
	}
	
	.head_left image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}
	
	.head_left text {
		margin-left: 14rpx;
		font-size: 30rpx;
		color: #020202;
	}
	
	.head_right {
		display: flex;
		align-items: center;
		image{
			height: 45rpx;
			margin-left: 20rpx;
		}
		.msg{
			position: relative;
			overflow: inherit;
			&::before{
				content: ' ';
				position: absolute;
				top: -5rpx;
				right: -5rpx;
				display: inline-block;
				width: 5px;
				height: 5px;
				background: red;
				border-radius: 50%;
			}
		}
	}
	
	// .head_right text {
	// 	font-size: 30rpx;
	// 	color: #020202;
	// 	margin-right: 26rpx;
	// }
	
	// .head_right text:last-child {
	// 	display: block;
	// 	font-size: 10px;
	// 	margin-top: -3px;
	// }
	.banner{
		margin-top: 65rpx;
	}
</style>
