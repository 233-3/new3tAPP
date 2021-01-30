<template>
	<view>
		<u-navbar title="同步试卷" back-icon-color="#000" :is-back="true" title-color="#000" :border-bottom="false" >
			<view class="slot-wrap" slot="right">
				<!-- <u-icon name="arrow-left" size="38" @click="$u.route({type:'tab',url:'pages/testCenter/testCenter',animationType:'pop-out'})"></u-icon> -->
				<u-icon name="arrow-down-fill" color="#444444" size="14" @click="njShow = !njShow" :label="njInfo.njmc" label-size="28" label-color="#000000" label-pos="left" margin-right="8" style="margin-right: 10rpx;"></u-icon>
			</view>
		</u-navbar>
		<u-tabs v-if="xkList" :list="xkList" name="xk_mc" font-size="32" inactive-color="#999999" active-color="#333333" :bar-style='barStyle' :is-scroll="false" :current="current" @change="change"></u-tabs>
		<u-select v-if="njList" @confirm="njConfirm" v-model="njShow" :list="njList" value-name="nj_id" label-name="nj_mc"></u-select>
		<view class="bar-line"></view>
		<!-- 列表 -->
		<view class="list-wrapper">
			<view v-for="item in list" :key="item.zyid" @click="goList(item)">
				<u-image :src="item.zyfm" width="203" height="272" :fade="false" ></u-image>
				<view>{{item.zymc}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				barStyle:{
					width: '24rpx',
					height: '6rpx',
					background: '#61BEFF',
					borderRadius: '2rpx',
				},
				xkList: '',
				xkShow: false,
				xkInfo: {
					xkid: '',
					xkmc: ''
				},
				njList: '',
				njShow: false,
				njInfo: {
					njid: '',
					njmc: ''
				},
				page: 1,
				list: '',
				current:0
			};
		},
		created() {
			this.getXKList()
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
		methods: {
			change(index){
				this.current = index;
				this.xkInfo.xkid = this.xkList[index].xk_id
				this.xkInfo.xkmc = this.xkList[index].xk_mc
				this.page = 1
				this.getListInfo()
			},
			//获取学科
			getXKList() {
				this.$u.post('tbsj/selectTongBuShiJuanXueKe').then(res => {
					if (res.success) {
						this.xkList = res.data
						this.xkInfo.xkid = this.xkList[0].xk_id
						this.xkInfo.xkmc = this.xkList[0].xk_mc
						this.getNJList()
					} else {
						uni.showToast({
							title: res.message,
							position: 'center',
							icon: 'none'
						});
					}
				}).catch(err => console.log(err))
			},
			//获取年级
			getNJList() {
				this.$u.post('tbsj/selectTongBuShiJuanNianJi', {
					xkid: this.xkInfo.xkid
				}).then(res => {
					if (res.success) {
						this.njList = res.data
						let myNjId = getApp().globalData.userInfo.xsnj
						for(let i=0; i<= this.njList.length-1; i++){
							if(this.njList[i].nj_id == myNjId){
								this.njInfo.njmc = this.njList[i].nj_mc
								this.njInfo.njid = this.njList[i].nj_id
								this.getListInfo()
								return false
							} else {
								this.njInfo.njid = this.njList[0].nj_id
								this.njInfo.njmc = this.njList[0].nj_mc
							}
						}
						this.getListInfo()
					} else {
						uni.showToast({
							title: res.message,
							position: 'center',
							icon: 'none'
						});
					}
				}).catch(err => console.log(err))
			},
			//获取列表数据
			getListInfo() {
				this.$u.post('tbsj/selectTongBuShiJuan', {
					xkid: this.xkInfo.xkid,
					njid: this.njInfo.njid,
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
			//切换学科
			xkConfirm(val) {
				this.xkInfo.xkid = val[0].value
				this.xkInfo.xkmc = val[0].label
				this.resetData()
				this.getNJList()
			},
			//切换年级
			njConfirm(val) {
				this.njInfo.njid = val[0].value
				this.njInfo.njmc = val[0].label
				this.resetData()
				this.getListInfo()
			},
			//重置数据
			resetData() {
				this.page = 1
				this.list = ''
			},
			//前往试卷列表
			goList(item){
				console.log(item)
				console.log('学科id',this.xkInfo.xkid)
				let xkid = this.xkInfo.xkid
				this.$u.route({
					url:'pages/tongbusijuan/sjList',
					params:{
						tbsjid:item.zyid,
						xkid:item.xkid,
						mc:item.zymc
					}
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.bar-line{
		width: 100%;
		height: 2px;
		background: #F5F5F5;
		margin-top: -5px;
	}
	.slot-wrap{
		padding-right: 27rpx;
	}
	.list-wrapper{
		padding: 30rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		view{
			&:nth-child(3n+3){
				margin-right: 0;
			}
			width: 203rpx;
			margin-right: 40rpx;
			image{
				width: 203rpx;
				height: 272rpx;
				margin: 0 auto;
			}
			view{
				margin: 23rpx 0;
				font-size: 28rpx;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				text-align: center;
			}
		}
	}
</style>
