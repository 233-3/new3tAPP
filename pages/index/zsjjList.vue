<template>
	<view class="zsjjbox">
		<u-navbar title="知识精讲" back-icon-color="#000" title-color="#000" :border-bottom="false" >
			<view class="slot-wrap" slot="right">
				<u-icon name="arrow-down-fill" color="#444444" size="14" @click="njShow = !njShow" :label="njmc" label-size="28" label-color="#000000" label-pos="left" margin-right="8" style="margin-right: 10rpx;"></u-icon>
				<u-icon name="arrow-down-fill" color="#444444" size="14" @click="qbShow = !qbShow" :label="qbmc" label-size="28" label-color="#000000" label-pos="left" margin-right="8"></u-icon>
			</view>
		</u-navbar>
		<u-select v-if="njList" v-model="njShow" :list="njList" value-name="njid" label-name="njmc"  @confirm="njConfirm"></u-select>
		<u-select v-if="qbList" v-model="qbShow" :list="qbList" value-name="qbid" label-name="qbmc"  @confirm="qbConfirm"></u-select>
		<view class="zsjj-wrapper" v-for="(item, index) in listInfo" :kry="index" @tap="openDetail(item.kcid,item)">
			<view class="zsjj-img">
				<u-image :src="item.kcfm" width="212" height="256"></u-image>
				<text v-if="shzt == 0" >{{item.sfsf == 1? 'VIP': (item.sfsf == 0? '免费': '限免')}}</text>
			</view>
			<view class="zsjj-desc">
				<view class="zsjj-bt">{{item.kcmc}}</view>
				<view class="je" v-if="item.kcxj && shzt == 0"><text>￥</text>{{item.kcxj}}</view>
				<view class="star-xx">开始学习</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				njList:'',
				njid:'',
				njmc:'',
				njShow:false,
				qbList:'',
				qbid:'',
				qbmc:'',
				qbShow:false,
				listInfo:'',
				shzt:'',
				page:1,
				all:{
					njid:'',
					njmc:'',
					qbmc:'',
					qbid:''
				}
			};
		},
		onLoad(obj) {
			this.shzt = getApp().globalData.shzt
			this.all = obj
			console.log(this.all)
			this.getNJList()
		},
		onReachBottom() {
			console.log('~~')
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
			openDetail(val,item){
				this.$u.route('pages/index/kcInfoTwo',{
					kcid:val,
					item:JSON.stringify(item)
				})
			},
			njConfirm(val) {
				this.page = 1
				this.njmc = val[0].label
				this.njid = val[0].value
				this.getQBList()
			},
			qbConfirm(val) {
				this.page = 1
				this.qbmc = val[0].label
				this.qbid = val[0].value
				this.getListInfo()
			},
			getNJList(){
				this.$u.get('api/ATZKCController/queryNJList').then(res=>{
					if(res){
						this.njList = res
						// this.njid = this.njList[0].njid
						// this.njmc = this.njList[0].njmc
						// let myNjId = getApp().globalData.userInfo.xsnj
						// for(let i=0; i<= this.njList.length-1; i++){
						// 	if(this.njList[i].njid == myNjId){
						// 		this.njmc = this.njList[i].njmc
						// 		this.njid = this.njList[i].njid
						// 		this.getQBList()
						// 		return false
						// 	} else {
						// 		this.njmc = res[0].njmc
						// 		this.njid = res[0].njid
						// 	}
						// }
						if(this.all.njid){
							this.njmc = this.all.njmc
							this.njid = this.all.njid
						}else {
							this.njmc = res[0].njmc
							this.njid = res[0].njid
						}
						this.getQBList()
					}
				})
			},
			getQBList(){
				this.$u.post('api/ATZKCController/queryQBList',{
					njid:this.njid
				}).then(res=>{
					if(res){
						this.qbList = res
						if(this.all.qbid){
							this.qbmc = this.all.qbmc
							this.qbid = this.all.qbid
						}else {
							this.qbid = this.qbList[0].qbid
							this.qbmc = this.qbList[0].qbmc
						}
						
						this.getListInfo()
					}
				})
			},
			getListInfo(){
				this.$u.post('api/ATZKCController/queryTKCList',{
					param1:this.page,
					param2:10,
					njid:this.njid,
					qbid:this.qbid
				}).then(res=>{
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

<style lang="scss" scoped>
	.slot-wrap{
		padding-right: 27rpx;
	}
	page{
		background: #F4F5F7;
	}
	.zsjjbox{
		padding: 30rpx;
	}
	.zsjj-wrapper{
		display: flex;
		justify-content: flex-start;
		margin-top: 35rpx;
		background: #FFFFFF;
		padding: 30rpx 20rpx;
		border-radius: 6rpx;
		.zsjj-desc{
			width: 480rpx;
		}
		.zsjj-bt{
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
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
			margin-top: 95rpx;
		}
		.zsjj-img{
			width: 212rpx;
			height: 265rpx;
			border-radius: 6rpx;
			overflow: hidden;
			margin-right: 30rpx;
			position: relative;
			image{
				width: 212rpx;
				height: 265rpx;
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
		}
	}
</style>
