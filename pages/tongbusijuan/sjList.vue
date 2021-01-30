<template>
	<view class="sjlist-box">
		<u-navbar :title="title" back-icon-color="#000" :is-back="true" title-color="#000"  :border-bottom="false" >
			<!-- <view class="slot-wrap">
				<view @click="$u.route({url:'pages/tongbusijuan/tongbusijuan',animationType:'none'})" style="padding-left:30rpx;">
					<u-icon name="arrow-left" size="38"></u-icon>
				</view>
			</view> -->
		</u-navbar>
		<view class="fixed"></view>
		<view class="list-wrapper" v-for="(item, index) in list" :key="index">
			<view class="title">{{item.sjmc}} ({{item.xt + item.dt}})</view>
			<view class="desc">
				<view>
					<image src="../../static/icon-jc.png" ></image>
					<text>共{{item.xt + item.dt}}道题/{{item.dt}}道大题</text>
				</view>
				<view>
					<image src="../../static/icon-zy.png"></image>
					<text>{{item.csrs}}人已测试</text>
				</view>
			</view>
			<view class="btn-box">
				<view class="jf">
					<image src="../../static/icon-jf.png" ></image>
					<text>{{item.dhjf}}积分</text>
				</view>
				<view class="btn-wrapper">
					<view class="zccs" v-if="item.sfwc == 1" @click="restTest(item)">
						<image src="../../static/icon-bi.png" mode=""></image>
						<text>再次测试</text>
					</view>
					<button type="default" style="background: #FF8400;"  @click="showJfBox(item)" v-if="item.sfwc == -1 || item.sfwc == 0">开始测试</button>
					<button type="default" style="background: #A8C62B;"  @click="goXQ(item)" v-if="item.sfwc == 1">测试报告</button>
				</view>
			</view>
		</view>
		<u-modal v-model="show" :content="content" @confirm="confirm" :show-cancel-button="true"></u-modal>
		<u-modal v-model="jfshow" :content="jfcontent" @confirm="jfconfirm" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				tbsjid:'',
				page: 1,
				list: '',
				xkid:'',
				xszjf:'',//学生总积分
				show:false,
				content:'确定后原测试报告将清除掉，是否确定重新测试?',
				item:'',
				jfshow:false,
				jfcontent:'是否扣除积分',
				items:'',//中间
			};
		},
		onLoad(obj) {
			console.log(obj.mc)
			this.title = obj.mc
			this.tbsjid = obj.tbsjid
			this.xkid = obj.xkid
			// this.getListInfo()
			// this.getJF()
		},
		onShow() {
			this.page = 1
			if(this.xkid != '' && this.tbsjid != ''){
				this.getListInfo()
				this.getJF()
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.getListInfo()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 300);
		},
		onReachBottom() {
			this.getListInfo()
		},
		methods:{
			showJfBox(item){
				this.items = item;
				console.log(item.dhjf)
				if(this.items.sfwc == -1 && this.items.dhjf != 0){
					this.jfshow = true
				} else {
					this.$u.route({
						url:'pages/test/testBox',
						params:{
							sjmc:item.sjmc,
							sjid:item.sjid,
							xsid:getApp().globalData.userInfo.xsid,
							lx:0, //同步试卷
							sfwc:item.sfwc,
							xkid:this.xkid,
							xszyid:item.xszyid,
							mc:this.title,
							tbsjid:this.tbsjid,
						}
					})
				}
			},
			jfconfirm(){
				// console.log(this.items)
				this.goTest(this.items)
			},
			//获取学生总积分
			getJF(){
				this.$u.post('grzx/selectGRZXJF',{
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					if(res){
						this.xszjf = res.xszjf
					}
				}).catch(err=>console.log(err))
			},
			//获取列表数据
			getListInfo() {
				this.$u.post('tbsj/selectTongBuShiJuanList', {
					tbsjid: this.tbsjid,
					xsId:getApp().globalData.userInfo.xsid,
					curr: this.page,
					limit: 8
				}).then(res => {
					if (this.page == 1) {
						this.list = res.rows
					} else {
						res.rows.forEach(val => {
							this.list.push(val)
						})
					}
					this.page++
				}).catch(err => console.log(err))
			},
			//更新积分信息
			upJF(jf){
				this.$u.post('grzx/updateXueShengJF',{
					xsid:getApp().globalData.userInfo.xsid,
					jifen:jf
				}).then(res=>{
					if(res.success){
						
					} else {
						this.$u.toast(res.message)
					}
				}).catch(err => console.log(err))
			},
			confirm(){
				this.$u.post('tbsj/deleteByZyIdXQ',{
					xqxszyid:this.item.xszyid
				}).then(res=>{
					if(res){
						this.item.sfwc = 0
						this.goTest(this.item)
						this.item = ''
					}
				}).catch(err => console.log(err))
			},
			//重新测试
			restTest(item){
				if(this.xszjf < 0 || this.xszjf < item.dhjf){
					this.$u.toast('积分不足')
					return false
				} else {
					this.item = item
					this.show = true
					return false
					// this.upJF(-item.dhjf)
				}
			},
			//去试卷详情
			goTest(item){
				if(item.sfwc == -1){
					if(this.xszjf < 0 || this.xszjf < item.dhjf){
						this.$u.toast('积分不足')
						return false
					} else {
						this.upJF(-item.dhjf)
					}
				}
				this.$u.route({
					url:'pages/test/testBox',
					params:{
						sjmc:item.sjmc,
						sjid:item.sjid,
						xsid:getApp().globalData.userInfo.xsid,
						lx:0, //同步试卷
						sfwc:item.sfwc,
						xkid:this.xkid,
						xszyid:item.xszyid,
						mc:this.title,
						tbsjid:this.tbsjid,
					}
				})
			},
			goXQ(item){
				this.$u.route('pages/test/testBox',{
					xszyid:item.xszyid,
					lx:6,
					sjmc:item.sjmc,
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background:#F7F7F7;
		background-size: 100% 100%;
		z-index: -1;
	}
	.sjlist-box{
		padding: 0 30rpx 30rpx;
	}
	.list-wrapper{
		padding: 35rpx;
		background: #FFFFFF;
		box-shadow: 0px 5rpx 27rpx 0px rgba(4, 0, 0, 0.09);
		border-radius: 20rpx;
		margin-top: 31rpx;
		.title{
			font-size: 32rpx;
			color: #333333;
			margin-bottom: 36rpx;
		}
		.desc{
			display: flex;
			justify-content: flex-start;
			margin-bottom: 32rpx;
			view{
				margin-right: 34rpx;
				image{
					width: 27rpx;
					height: 27rpx;
					vertical-align: middle;
					margin-right: 2rpx;
				}
				text{
					vertical-align: middle;
					font-size: 24rpx;
					color: #999999;
				}
			}
		}
		.btn-box{
			display: flex;
			justify-content: space-between;
			.jf{
				image{
					width: 34rpx;
					height: 34rpx;
					vertical-align: middle;
				}
				text{		
					vertical-align: middle;
					color: #61BEFF;
					margin-left: 13rpx;
				}
			}
			.btn-wrapper{
				display: flex;
				align-items: center;
				button{
					width: 184rpx;
					height: 51rpx;
					line-height: 51rpx;
					border-radius: 26rpx;
					font-size: 26rpx;
					color: #FEFEFE;
					border: none;
				}
				.zccs{
					margin-right: 20rpx;
					image{
						width: 53rpx;
						height: 53rpx;
						vertical-align: middle;
						margin-right:5rpx;
					}
					text{
						vertical-align: middle;
						color: #999999;
					}
				}
			}
		}
	}
</style>
