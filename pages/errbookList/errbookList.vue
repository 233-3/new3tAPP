<template>
	<view>
		<u-navbar title="错题本" back-icon-color="#000" title-color="#000" :border-bottom="false" >
			<view class="slot-wrap" slot="right" >
				<u-icon name="arrow-down-fill" @click="zsdShow = !zsdShow" color="#444444" size="14" :label="zsdmc" label-size="28" label-color="#000000" label-pos="left" margin-right="8" style="margin-right: 10rpx;"></u-icon>
			</view>
		</u-navbar>
		<u-select v-if="yjzsdList" v-model="zsdShow" :list="yjzsdList" value-name="zsdid" label-name="zsdmc"  @confirm="zsdConfirm"></u-select>
		<view class="zsd-box">
			<view class="zsd-wrapper" v-for="(item, index) in errInfo" :key="index" @tap="goInfo(item)">
				<view>{{item.zsdmc}} ({{item.stsl}})</view>
				<u-icon name="arrow-right" color="#DADADA" size="26"></u-icon>
			</view>
		</view>
		<view class="fixed"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				yjzsdList:'',
				zsdid:'',
				zsdmc:'',
				zsdShow:false,
				page:1,
				errInfo:''
			};
		},
		onLoad() {
			this.getYJZSD()
		},
		onReachBottom() {
			this.getErrList()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getErrList()
			setTimeout(()=>{
				uni.stopPullDownRefresh()
			},300)
		},
		methods:{
			goInfo(item){
				let zsdid = item.zsdid
				let zsdmc = item.zsdmc
				let lx = 7
				this.$u.route('pages/test/testBox',{
					zsdid,
					zsdmc,
					lx,
					xsid:getApp().globalData.userInfo.xsid
				})
			},
			//获取一级知识点
			getYJZSD(){
				this.$u.post('api/ACTBController/queryCTFZSD',{
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					if(res){
						this.yjzsdList = res
						this.zsdid = res[0].zsdid
						this.zsdmc = res[0].zsdmc
						this.getErrList()
					}
				}).catch(err=>console.log(err))
			},
			//切换知识点
			zsdConfirm(val){
				this.zsdid = val[0].value
				this.zsdmc = val[0].label
				this.page = 1
				this.getErrList()
			},
			//获取错题列表
			getErrList(){
				this.$u.post('api/ACTBController/queryList',{
					param1:this.page,
					param2:10,
					param3:getApp().globalData.userInfo.xsid,
					param4:this.zsdid
				}).then(res=>{
					if(this.page == 1) {
						this.errInfo = res.rows
					} else {
						res.rows.forEach(val=>{
							this.errInfo.push(val)
						})
					}
					this.page++
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.slot-wrap{
		padding-right: 27rpx;
	}
	.zsd-box{
		padding: 30rpx;
		.zsd-wrapper{
			padding: 35rpx;
			background: #FFFFFF;
			box-shadow: 0px 5rpx 27rpx 0px rgba(4, 0, 0, 0.09);
			border-radius: 20rpx;
			margin-bottom: 29rpx;
			display: flex;
			justify-content: space-between;
			view{
				white-space: nowrap;
			}
		}
	}
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #F7F7F7;
		z-index: -1;
	}
</style>
