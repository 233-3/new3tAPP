<template>
	<view class="wraper">
		<u-navbar :title="mc" title-color="#fff" :border-bottom="false" back-icon-color="#fff" :background="background"></u-navbar>
		<view class="fixed"></view>
		<view class="list" v-for="(item, index) in jcList">
			<view class="flot" @tap="toListen(item.jcmc, item.jcid)">
				<view>
					<image src="../../static/tdyl-bokk.png" alt="" class="hx"></image>
				</view>
				<view class="text">{{item.jcmc}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mc:'',
				tdylid:'',
				jcList: [],
				userInfo:{},
				background: {
					backgroundColor: '#67b9fc',
				},
			}
		},
		onLoad(obj){
			this.mc = obj.kcmc
			this.tdylid = obj.tdylid
			this.getListInfo()
		},
		methods: {
			getListInfo(){
				this.$u.post('api/ATDYLController/queryJC',{
					kcid:this.tdylid
				}).then(res=>{
					this.jcList = res
				}).catch(err=>console.log(err))
			},
			toListen(mc,id){
				this.$u.route('pages/testCenter/tingduInfo',{mc,id})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wraper{
		padding: 30rpx 0;
	}
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background: url(../../static/tdyl-bg2.png) no-repeat top center;
		background-size: 100% 100%;
		z-index: -1;
	}
	.list{
		&:nth-child(2n-1){
			// background: url(../../static/xian-left.png) no-repeat center center;
			background-size: 60% 100%;
		}
		&:nth-child(2n){
			// background: url(../../static/xian-right.png) no-repeat center center;
			background-size: 60% 100%;
		}
		&:last-child{
			background: none;
		}
		width: 90%;
		overflow: hidden;
		margin: 0 auto 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		// flex-wrap: wrap;
	}
	.list:nth-child(odd) .flot{
		align-self:  flex-start
	}
	.list:nth-child(even) .flot{
		align-self: flex-end;
	}
	.flot{
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		view{
			&:first-child{
				width: 189rpx;
				height: 190rpx;
				background: url(../../static/tdyl-bg2-yuan.png) no-repeat top center;
				background-size: 100% 190rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
			}
			
			image{
				width: 94rpx;
				height: 108rpx;
				// margin-top: 40rpx;
			}
		}
	}
	.flot view{
		display: flex;
		align-items: center;
	}
	.text{
		font-size: 30rpx;
		font-weight: 600;
		color: #FFFFFF;
		// -webkit-text-stroke: 3rpx #1E63CA;
		// text-stroke: 3rpx #1E63CA;
		// background: linear-gradient(0deg, rgba(159, 221, 242, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%);
		// -webkit-background-clip: text;
		// -webkit-text-fill-color: transparent;
		text-align: center;
		margin-top: 38rpx;
	}
</style>
