<template>
	<view class="xxxx">
		<u-navbar title="系统信息" back-icon-color="#000"  title-color="#000" :border-bottom="false">
			<view class="slot-wrap" slot="right">
				<u-icon name="trash" color="#333"  @click="show = !show" size="38" ></u-icon>
			</view>
		</u-navbar>
		<view class="fixed"></view>
		<view class="card">
			<rich-text :nodes="xxInfo.xxnr"></rich-text>
		</view>
		<view class="time">
			{{xxInfo.xxrq}}
		</view>
		<u-modal v-model="show" :content="content" @confirm="del" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xsxxid:'',
				xxid:'',
				xxInfo:'',
				show:false,
				content: '是否删除该消息'
			};
		},
		onLoad(obj) {
			this.xsxxid = obj.xsxxid
			this.xxid = obj.xxid
			this.getInfo()
		},
		methods:{
			getInfo(){
				this.$u.post('api/FXXController/queryInfo',{
					param3:this.xxid,
					param4:this.xsxxid,
				}).then(res=>{
					console.log(res)
					this.xxInfo = res
				}).catch(err=>console.log(err))
			},
			del(){
				this.xsxxid
				console.log(this.xsxxid)
				this.$u.post('api/FXXController/delInfo',{
					param3:this.xsxxid,
				}).then(res=>{
					if(res){
						uni.navigateBack()
					} else {
						this.$u.toast('失败,请重试')
					}
				}).catch(err=>this.$u.toast('失败,请重试'))
			}
		}
	}
</script>

<style lang="scss">
	.xxxx{
		padding: 30rpx;
		.slot-wrap{
			padding-right: 30rpx;
		}
		.card{
			background: #FFFFFF;
			box-shadow: 0px 6rpx 10rpx 0px rgba(0, 0, 0, 0.02);
			border-radius: 12rpx;
			padding: 30rpx;
			margin-top: 30rpx;
		}
		.time{
			font-size: 26rpx;
			font-weight: 400;
			color: #666666;
			text-align: center;
			margin-top: 30rpx;
		}
	}
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #F4F5F7;
		background-size:cover;
		z-index: -1;
	}
</style>
