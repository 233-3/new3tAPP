<template>
	<view class="wraper">
		<u-navbar title="听读预练" title-color="#fff" :border-bottom="false" back-icon-color="#fff" :background="background" >
			<view class="slot-wrap" slot="right" @tap="show = true">
				<text style="margin-right:5px;color:#fff;width:150px">{{fl}}</text>
				<u-icon name="arrow-down-fill" color="#fff" size="24"></u-icon>
			</view>
		</u-navbar>
		<u-select v-model="show" :list="txList" value-name="id" label-name="mc"  @confirm="confirm"></u-select>
		<view class="flex"></view>
		<view  class="content">
			<view class="list" v-for="(item,index) in listInfo" :key="index" @tap="gojc(item)">
				<view class="list-wrapper">
					<view>
						<image :src="listIMG[index]" alt="" mode="heightFix"></image>
					</view>
				</view>
				<view class="list-text">{{item.kcmc}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				fl:'',
				background: {
					backgroundColor: '#66b9fd',
				},
				listIMG:[
					'../../static/tdyl-list1.png',
					'../../static/tdyl-list2.png',
					'../../static/tdyl-list3.png',
					'../../static/tdyl-list4.png',
					'../../static/tdyl-list5.png',
					'../../static/tdyl-list6.png',
					'../../static/tdyl-list7.png',
					'../../static/tdyl-list8.png',
				],
				txList:[],
				txid:'',
				page:1,
				listInfo:[],
			}
		},
		mounted() {
			this.getTixi()
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
		methods: {
			gojc(val){
				this.$u.route('pages/testCenter/tingdujc',{
					kcmc:val.kcmc,
					tdylid:val.tdylid
				})
			},
			//切换体系
			confirm(val) {
				this.fl = val[0].label
				this.txid = val[0].value
				this.getListInfo()
			},
			//获取体系
			getTixi() {
				this.$u.post('api/ATDYLController/queryFXTXA',{
					xkid: 1,
				}).then(res=>{
					if(res){
						this.txList = res
						this.fl = this.txList[0].mc
						this.txid = this.txList[0].id
						this.getListInfo()
					}
				}).catch(err=>console.log(err))
			},
			//获取列表
			getListInfo() {
				this.$u.post('api/ATDYLController/queryList',{
					param1: this.page,
					param2: 15,
					param4: this.txid
				}).then(res=>{
					if(this.page == 1) {
						this.listInfo = res.rows
						return
					} else {
						res.data.rows.forEach(val=>{
							this.listInfo.push(val)
						})
					}
					this.page++
				}).catch(err=>console.log(err))
			},
		}
	}
</script>

<style lang="scss">
	.flex{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background: url(../../static/tdyl-bg.png) no-repeat top center;
		background-size: 100% 100%;
		z-index: -1;
	}
	.slot-wrap{
		padding-right:30rpx;
		width:180rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #fff;
	}
	.content{
		box-sizing: border-box;
		padding: 0 30rpx;
		padding-top: 20px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.list{
		.list-wrapper{
			margin: 0 auto;
			width: 252rpx;
			height: 310rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			border-radius: 20rpx;
			background: #C1E3FF;
			border: 10rpx solid #6FE6FF;
			view{
				width: 100%;
				height: 100%;
				border: 4rpx solid #3997E3;
				border-radius: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;	
				image{
					height: 210rpx;
				}
			}
		}
		.list-text{
			width: 252rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			margin: 35rpx auto;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2; //多行在这里修改数字即可
			overflow:hidden;
			-webkit-box-orient: vertical;
		}
		
	}


	

</style>
