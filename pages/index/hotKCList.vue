<template>
	<view>
		<view class="select">
			<view class="xk">
				<u-icon name="arrow-down-fill" :label="xkmc" @click="xkShow = !xkShow" label-pos="left" label-color="#aaa" color="#bbb" size="24"></u-icon>
			</view>
			<view class="nj">
				<u-icon name="arrow-down-fill" :label="njmc" @click="njShow = !njShow" label-pos="left" label-color="#aaa" color="#bbb" size="24"></u-icon>
			</view>
			<view class="xl">
				<u-icon name="arrow-down-fill" :label="qbmc" @click="qbShow = !qbShow" label-pos="left" label-color="#aaa" color="#bbb" size="24"></u-icon>
			</view>
		</view>
		<u-select v-if="njList" @confirm="njConfirm" v-model="njShow" :list="njList" value-name="njid" label-name="njmc"></u-select>
		<u-select v-if="xkList" @confirm="xkConfirm" v-model="xkShow" :list="xkList" value-name="xkid" label-name="xkmc"></u-select>
		<u-select v-if="qbList" @confirm="qbConfirm" v-model="qbShow" :list="qbList" value-name="qbid" label-name="qbmc"></u-select>
		<view class="kc-list">
			<view class="kc-wrapper" v-for="(item, index) in listInfo" :key="index" @click="$u.route('pages/index/kcInfo',{item:JSON.stringify(item),xkid:xkid})">
				<view class="kc-img">
					<image :src="item.kc_fm ? item.kc_fm : $errImg" ></image>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//学科相关
				xkList:[],
				xkmc:'',
				xkid:'',
				xkShow:false,
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
				listInfo:'',
				page:1,
				shzt:''
			};
		},
		onLoad() {
			this.shzt = getApp().globalData.shzt
			this.getXK()
		},
		onReachBottom() {
			this.getListInfo()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getListInfo()
			setTimeout(()=>{
				uni.stopPullDownRefresh()
			},300)
		},
		methods:{
			//切换学科
			xkConfirm(val){
				this.xkid = val[0].value
				this.xkmc = val[0].label
				this.page = 1
				this.getNJ()
			},
			//切换年级
			njConfirm(val){
				this.njid = val[0].value
				this.njmc = val[0].label
				this.page = 1
				this.getQBList()
			},
			//切换期别
			qbConfirm(val){
				this.page = 1
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
						this.njList = res
						let myNjId = getApp().globalData.userInfo.xsnj
						for(let i=0; i<= this.njList.length-1; i++){
							if(this.njList[i].njid == myNjId){
								this.njmc = this.njList[i].njmc
								this.njid = this.njList[i].njid
								this.getQBList()
								return false
							} else {
								this.njmc = res[0].njmc
								this.njid = res[0].njid
							}
						}
						this.getQBList()
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
					console.log('全部数据',res)
					if(this.page == 1) {
						this.listInfo = res.rows
					} else {
						res.rows.forEach(val=>{
							this.listInfo.push(val)
						})
					}
					this.page++
				})
			},
		}
	}
</script>

<style lang="scss">
	.select{
		position: fixed;
		top:0;
		width: 100%;
		height: 90rpx;
		display: flex;
		border-bottom: 2rpx solid #eee;
		box-shadow: 1px 13px 12px 0px #dedede;
		background: #FFFFFF;
		z-index: 999;
		view {
			flex: 1;
			height: 90rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			text{
				font-size: 34rpx;
				color: #aaa;
				margin-right: 10rpx;
			}
		}
	}
	.kc-list{
		padding: 30rpx;
		padding-top: 120rpx;
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
</style>
