<template>
	<view class="jtjy-box">
		<u-navbar title="家庭教育" back-icon-color="#000" title-color="#000" :border-bottom="false" ></u-navbar>
		<u-tabs v-if="flList" :list="flList" name="xk_mc" font-size="32" inactive-color="#999999" active-color="#333333" :bar-style='barStyle' :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view class="bar-line"></view>
		<view class="tuijian" v-if="listInfo.length > 0">
			<view class="tuijinaList"  v-for="(item, index) in listInfo" :key="index"  @tap="openDetail(item.kc_id,item)">
				<image :src="item.kc_fm">
				<view class="kc_lx" >
					<image v-if="shzt == 0" :src="item.kc_sfsf == 1 ? '../../static/images/class_Vip.png': '../../static/images/class_mf.png'"></image>
					<text v-if="shzt == 0" :class="{'fm_active': item.kc_sfsf != 1}">{{item.kc_sfsf == 1? 'VIP': (item.kc_sfsf == 0? '免费': '限免')}}</text>
				</view>
				<view class="list_tit">
					<text class="lx" :class="{'color': item.lxmc == '素养'}">{{item.lxmc}}</text>
					<text class="text">{{item.kc_mc}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flList:'',
				current:0,
				xkid:'',
				barStyle:{
					width: '24rpx',
					height: '6rpx',
					background: '#61BEFF',
					borderRadius: '2rpx',
				},
				page:1,
				listInfo:'',
				shzt:''
			};
		},
		onLoad() {
			this.shzt = getApp().globalData.shzt
			this.getFLList()
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
				this.$u.route('pages/index/kcInfoThree',{
					kcid:val,
					item:JSON.stringify(item)
				})
			},
			change(index){
				this.current = index;
				this.xkid = this.flList[index].xk_id
				this.page = 1
				this.getListInfo()
			},
			getFLList(){
				this.$u.post('jiaTing/query_CXLM').then(res=>{
					if(res){
						this.flList = res
						this.flList.unshift({
							xk_id: -1,
							xk_mc: "全部"
						})
						this.xkid = -1
					}
					this.getListInfo()
				})
			},
			getListInfo(){
				this.$u.post('jiaTing/queryTJGDKC',{
					param1:this.page,
					param2:10,
					param3:this.xkid
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
			}
		}
	}
</script>

<style lang="scss">
	.bar-line{
		width: 100%;
		height: 2px;
		background: #F5F5F5;
		margin-top: -5px;
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
		padding: 30rpx;
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
		font-size: 12px;
		line-height: 18px;
		text-align: center;
	}
	.list_tit .text{
		font-size: 14px;
		margin-left: 2rpx;
		text-indent: 90rpx;
		line-height: 40rpx;
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
</style>
