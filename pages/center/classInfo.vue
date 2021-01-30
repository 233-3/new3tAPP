<template>
	<view>
		<u-navbar title="班级信息">
		</u-navbar>
		<view class="bjlist">
			<view>
				<text>班级名称</text>
				<text>{{classInfo.bjmc}}</text>
			</view>
			<view>
				<text>班级老师</text>
				<text>{{classInfo.rkls}}</text>
			</view>
			<view>
				<text>结班日期</text>
				<text>{{classInfo.bjjssj}}</text>
			</view>
			<view>
				<text>班级状态</text>
				<text v-if="classInfo.bjzt == 1">正常</text>
				<text v-else>闭班</text>
			</view>
			<view>
				<text>是否入班</text>
				<text>
					<text class="bjmcspan" @click="sendClass">是</text>
					<text class="bjmcspan" @click="goBack">否</text>
				</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classInfo:''
			};
		},
		onLoad(obj) {
			console.log(obj.classInfo)
			this.classInfo =JSON.parse(obj.classInfo)
		},
		methods:{
			goBack(){
				uni.navigateBack()
			},
			sendClass(){
				console.log({
					bjId:this.classInfo.bjid,
					xsid:getApp().globalData.userInfo.xsid
				})
				return
				this.$u.post('grzx/insertXsBanJi',{
					bjId:this.classInfo.bjid,
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					if(res.success){
						this.$u.toast(res.message)
						setTimeout(()=>{
							this.$u.route.navigateBack()
						},800)
					} else {
						this.$u.toast(res.message)
					}
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss">
	.bjlist{
		view{
			margin: 0 auto;
			height: 58px;
			border-bottom: 1px solid #e0e0e0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;
			text{
				&:first-child{
					font-size: 16px;
					color: #333333;
					margin-left: 3px;
				}
				&:last-child{
					color: #999;
					margin-right: 3px;
				}
				text{
					padding: 5px 20px;
					border-radius: 15px;
					&:first-child{
						background: #4768f3;
						color: #fff;
						margin-right: 10px;
					}
					&:last-child{
						background: #fff;
						color: #d9defc;
						border: 1px solid #4768f3;
					}
				}
			}
		}
	}
</style>
