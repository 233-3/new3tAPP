<template>
	<view>
		<u-navbar title="拓展课程" back-icon-color="#000" title-color="#000" :border-bottom="false" >
			<view class="slot-wrap" slot="right">
				<u-icon name="arrow-down-fill" color="#444444" size="14" @click="njShow = !njShow" :label="njmc" label-size="28" label-color="#000000" label-pos="left" margin-right="8" style="margin-right: 10rpx;"></u-icon>
				<u-icon name="arrow-down-fill" color="#444444" size="14" @click="qbShow = !qbShow" :label="qbmc" label-size="28" label-color="#000000" label-pos="left" margin-right="8"></u-icon>
			</view>
		</u-navbar>
		<u-select v-if="njList" v-model="njShow" :list="njList" value-name="njid" label-name="njmc"  @confirm="njConfirm"></u-select>
		<u-select v-if="qbList" v-model="qbShow" :list="qbList" value-name="qbid" label-name="qbmc"  @confirm="qbConfirm"></u-select>
		<view class="zsjjList">
			<view class="title">知识精讲</view>
			<view class="zsjj-wrapper" v-for="(item, index) in listInfo" :kry="index" @tap="openDetail(item.kcid,item)">
				<view class="zsjj-img">
					<image :src="item.kcfm" width="212" height="256"></image>
					<text v-if="shzt == 0" >{{item.sfsf == 1? 'VIP': (item.sfsf == 0? '免费': '限免')}}</text>
				</view>
				<view class="zsjj-desc">
					<view class="zsjj-bt">{{item.kcmc}}</view>
					<view class="je" v-if="item.kcxj && shzt == 0"><text>￥</text>{{item.kcxj}}</view>
					<view class="star-xx">开始学习</view>
				</view>
			</view>
			<view @click="$u.route('pages/index/zsjjList',{njid,njmc,qbid,qbmc})" v-if="num > 2" style="color: #303133;font-size: 14px;text-align: center;margin: 40rpx 0 20rpx;">点击进入更多</view>
			<image src="../../static/tzkc-banner.png" class="banner"></image>
			<view class="title">家庭教育</view>
			<view class="tuijian" v-if="bottomInfo.length > 0">
				<view class="tuijinaList"  v-for="(item, index) in bottomInfo" :key="index"  @tap="openDetails(item.kc_id,item)">
					<image :src="item.kc_fm">
					<view class="kc_lx" >
						<image v-if="shzt == 0" :src="item.kc_sfsf == 1 ? '../../static/images/class_Vip.png': '../../static/images/class_mf.png'"></image>
						<text v-if="shzt == 0" :class="{'fm_active': item.kc_sfsf != 1}">{{item.kc_sfsf == 1? 'VIP': (item.kc_sfsf == 0? '免费': '限免')}}</text>
					</view>
					<view class="list_tit">
						<text class="lx" :class="{'color': item.lxmc == '素养'}">{{item.lxmc}}</text>
						<text class="text">{{item.kc_mc}}</text>
					</view>
					<view class="xq">
						<text>讲师：{{item.kc_wksl}}</text>
						<text>{{item.kc_xxrc}} 人已学</text>
					</view>
				</view>
			</view>
			<view @click="$u.route('pages/index/jtjyList')"  style="color: #303133;font-size: 14px;text-align: center;margin: 20rpx 0;">点击进入更多</view>
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
				bottomInfo:'',
				shzt:'',
				num:'',
			};
		},
		onLoad() {
			this.shzt = getApp().globalData.shzt
			this.getNJList()
			this.getBottomList()
		},
		methods:{
			openDetail(val,item){
				this.$u.route('pages/index/kcInfoTwo',{
					kcid:val,
					item:JSON.stringify(item)
				})
			},
			openDetails(val,item){
				this.$u.route('pages/index/kcInfoThree',{
					kcid:val,
					item:JSON.stringify(item)
				})
			},
			njConfirm(val) {
				this.njmc = val[0].label
				this.njid = val[0].value
				this.getQBList()
			},
			qbConfirm(val) {
				this.qbmc = val[0].label
				this.qbid = val[0].value
				this.getListInfo()
			},
			getNJList(){
				this.$u.get('api/ATZKCController/queryNJList').then(res=>{
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
			getQBList(){
				this.$u.post('api/ATZKCController/queryQBList',{
					njid:this.njid
				}).then(res=>{
					if(res){
						this.qbList = res
						this.qbid = this.qbList[0].qbid
						this.qbmc = this.qbList[0].qbmc
						this.getListInfo()
					}
				})
			},
			getListInfo(){
				this.$u.post('api/ATZKCController/queryTKCList',{
					param1:1,
					param2:2,
					njid:this.njid,
					qbid:this.qbid
				}).then(res=>{
					if(res){
						this.listInfo = res.rows
						this.num = res.count
					}
				})
			},
			getBottomList(){
				this.$u.post('jiaTing/queryTJKC',)
				.then(res=>{
					if(res){
						this.bottomInfo = res
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.lx{
		position: absolute;
		left: 0;
		top: 1px;
		width: 42px;
		height: 18px;
		background: #ff6f4c;
		color: #fff;
		border-top-left-radius: 50rpx;
		border-top-right-radius: 50rpx;
		border-bottom-right-radius: 50rpx;
		font-size: 13px;
		line-height: 18px;
		text-align: center;
	}
	.list_tit .text{
		font-size: 14px;
		margin-left: 2rpx;
		text-indent: 90rpx;
		line-height: 40rpx;
		height: 40px;
		color: #333;
		font-weight: bold;
		display: -webkit-box;
		-webkit-line-clamp:2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}
	.color {
		background: #FACC07;
	}
	.slot-wrap{
		padding-right: 27rpx;
	}
	.zsjjList{
		padding: 55rpx 30rpx 55rpx;
		.title{
			font-size: 45rpx;
			font-weight: 500;
			color: #393939;
		}
		.banner{
			width: 100%;
			height: 175rpx;
			padding: 40rpx 0;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.zsjj-wrapper{
			display: flex;
			margin-top: 35rpx;
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
	}
	.xq {
		width: 100%;
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.xq text:first-child {
		width: 192rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.xq text:last-child {
		white-space: nowrap;
	}
	
	.xq text {
		font-size: 13px;
		color: #999999;
	}
	.tuijian {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	.tuijinaList {
		width: 47%;
		height: auto;
		float: left;
		margin: 30rpx 0;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	
	.tuijinaList:nth-child(even) {
		margin-left: 6%;
	}
	
	.tuijinaList image {
		display: block;
		width: 324rpx;
		height: 191rpx;
		border-radius: 15rpx;
	}
	
	.tuijinaList .list_tit {
		margin-top: 14rpx;
		position: relative;
	}
	.kc_lx{
		position: absolute;
		right: 0;
		top: 0;
		width: 60rpx;
		height: 60rpx;
	}
	.kc_lx image{
		display: block;	
		width: 60rpx;
		height: 60rpx;
	}
	.kc_lx text{
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
	.kc_lx .fm_active{
		color: #333;
	}
</style>
