<template>
	<view class="mryl-box">
		<u-navbar title="" back-icon-color="#333333" :border-bottom="false" :background="background">
			<view class="slot-wrap" slot="right">
				<view @click="xkShow = !xkShow">
					<image src="../../static/mryl-xk.png" mode=""></image>
					<text>{{xkmc}}</text>
				</view>
				<view @click="njShow = !njShow">
					<image src="../../static/mryl-nj.png" mode=""></image>
					<text>{{njmc}}</text>
				</view>
				<view @click="rqShow = !rqShow">
					<image src="../../static/mryl-rl.png" mode=""></image>
					<text>{{month}}月</text>
				</view>	
			</view>
		</u-navbar>
		<u-select v-model="xkShow" :list="xkList" value-name="xk_id" label-name="xk_mc"  @confirm="xkConfirm"></u-select>
		<u-select v-model="njShow" :list="njList" value-name="nj_id" label-name="nj_mc"  @confirm="njConfirm"></u-select>
		<u-picker v-model="rqShow" mode="time" :params="params" @confirm="timeConfirm"></u-picker>
		<view class="fixed"></view>
		<u-empty v-if="listInfo.length <= 0" text="暂无内容" color="#333333" iconColor="#333333" mode="list" margin-top="300"></u-empty>
		<view class="list-warpper">
			<!-- <view 
				:class="{test:dateTime == item.ylrq}"
				v-for="(item, index) in listInfo"
				:key="index"
				@click="goXQ(item)">
				<view class="left" >
					<view class="img-top">
						<image v-if="dateTime >= item.ylrq"  src="../../static/lk-zy.png" mode="heightFix"></image>
						<image v-else  src="../../static/mryl-suo.png" mode="heightFix"></image>
					</view>
					<view class="img-bottom">
						<image v-if="item.mrylxqid" src="../../static/mryl-bg2.png" ></image>
						<image v-else src="../../static/mryl-bg-hui.png" ></image>
					</view>
				</view>
				<view class="text">
					{{item.sjmc}}
				</view>
			</view> -->
			
			<view 
			:class="{test:dateTime == item.ylrq,'add-wrapper':true}"
			v-for="(item, index) in listInfo"
			:key="index"
			@click="goXQ(item)">
				<view class="title">
					<view class="t-box">
						<image class="ren" src="../../static/lk-zy.png" mode="widthFix"></image>
						<view>
							<view style="width: 190rpx;">{{item.sjmc}}</view>
							<view class="img-box">
								<image  v-if="dateTime < item.ylrq" class="suo" src="../../static/mryl-suo.png" mode="widthFix"></image>
								<image class="qian" :src="item.mrylxqid ? '../../static/mryl-bg2_g.png' : '../../static/mryl-bg-hui_g.png'" mode="heightFix"></image>
							</view>
						</view>
					</view>
				</view>
				<image class="b-img" src="../../static/diban.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background:{
					background:'#9fddec'
				},
				xkList:[],
				xkid:'',
				xkmc:'',
				xkShow:false,
				njList:[],
				njid:'',
				njmc:'',
				njShow:false,
				rqShow:false,
				year:'',
				month:'',
				page:1,
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				listInfo:[],
			};
		},
		onLoad() {
			this.getXKList()
			this.getDate()
		},
		onShow() {
			this.getMRYLList()
		},
		computed:{
			dateTime(){
				let time = new Date().valueOf()
				return this.$u.timeFormat(time, 'yyyy-mm-dd')
			}
		},
		onReachBottom() {
			this.getMRYLList()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getMRYLList()
			setTimeout(()=>{
				uni.stopPullDownRefresh()
			},300)
		},
		methods:{
			goXQ(item){
				console.log(item)
				let xqid = item.mrylxqid
				let sjid = item.sjid
				let xsid = getApp().globalData.userInfo.xsid
				let xkid = this.xkid
				let lx = 8
				let mrylid = item.ylid
				let sjmc = item.sjmc
				if(xqid){
					console.log('跳转到答题之后的详情')
					this.$u.route('pages/test/testBox',{
						xqid,
						lx:9
					})
				} else {
					if(this.dateTime >= item.ylrq){
						this.$u.route('pages/test/testBox',{
							sjid,
							xsid,
							xkid,
							lx,
							mrylid,
							sjmc,
							ylrq:item.ylrq
						})
					} else {
						this.$u.toast('未到当天')
					}
				}
			},
			//滚动到当前天
			setScroll(){
				if(this.listInfo.length > 0){
					this.$nextTick(function(){
						const query = uni.createSelectorQuery().in(this);
						query.select('.test').boundingClientRect(data => {
							let top = data.top //节点离页面顶部的距离为
							let allHeight //屏幕高度
							uni.getSystemInfo({
								success:res=>{
									allHeight = res.windowHeight
								}
							});
							let scroll = data.top - allHeight/3
							uni.pageScrollTo({
								scrollTop:scroll,
								duration: 200
							})
						}).exec();
					})
				}
			},
			njConfirm(val){
				this.page = 1
				this.listInfo = []
				this.njmc = val[0].label
				this.njid = val[0].value
				this.getMRYLList()
			},
			xkConfirm(val){
				this.page = 1
				this.listInfo = []
				this.xkmc = val[0].label
				this.xkid = val[0].value
				this.getNJList()
			},
			timeConfirm(val){
				this.page = 1
				this.listInfo = []
				this.year = val.year
				this.month = val.month
				this.getMRYLList()
			},
			getDate(){
				let year = new Date().getFullYear()
				let month = new Date().getMonth() + 1
				month < 10 ? this.month = `0${month}` : this.month = month
				this.year = year
				console.log(this.year,this.month)
			},
			//获取学科
			getXKList(){
				this.$u.post('dailyPractice/selectDailyPracticeXueKe',).then(res=>{
					if(res.success){
						this.xkList = res.data
						this.xkid = this.xkList[0].xk_id
						this.xkmc = this.xkList[0].xk_mc
						this.getNJList()
					} else {
						this.$u.toast(res.message)
					}
				}).catch(err=>this.$u.toast(err))
			},
			//获取年级
			getNJList(){
				this.$u.post('dailyPractice/selectDailyPracticeNianJi',{
					xkId:this.xkid
				}).then(res=>{
					if(res.success){
						this.njList = res.data
						this.njid = this.njList[0].nj_id
						this.njmc = this.njList[0].nj_mc
						this.getMRYLList()
					} else {
						this.$u.toast(res.message)
					}
				}).catch(err=>this.$u.toast(err))
			},
			//获取每日一练列表
			getMRYLList(){
				this.$u.post('dailyPractice/selectDailyPracticeXt',{
					xkId:this.xkid,
					njId:this.njid,
					rq:`${this.year}-${this.month}`,
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					if(res.success){
						if(this.page == 1) {
							this.listInfo = res.data
							setTimeout(()=>{
								this.setScroll()
							},200)
							return
						} else {
							res.data.rows.forEach(val=>{
								this.listInfo.push(val)
							})
						}
						setTimeout(()=>{
							this.setScroll()
						},200)
						this.page++
					} else {
						this.$u.toast(res.message)
					}
				}).catch(err=>this.$u.toast(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-warpper{
		padding: 30rpx;
		
		.add-wrapper{
			display: flex;
			flex-direction: column;
			// width: 139px;
			&:nth-child(2n){
				// width: 150rpx;
				align-items: flex-start;
			}
			&:nth-child(2n-1){
				// width: 150px;
				align-items: flex-end;
			}
			.title{
				.t-box{
					display: flex;
					.ren{
						width: 64rpx;
						margin-right: 10rpx;
					}
					view{
						display: flex;
						flex-direction: column;
						.img-box{
							display: flex;
							flex-direction: row;
							margin-top: 12rpx;
							.suo{
								width: 30rpx;
								margin-right: 10rpx;
							}
							.qian{
								height: 27rpx;
							}
						}
					}
				}
				font-size: 28rpx;
				font-weight: bold;
				color: #61BEFF;
				line-height: 28rpx;
				-webkit-text-stroke: 3rpx #FFFFFF;
				text-stroke: 3rpx #FFFFFF;
			}
			.b-img{
				width: 278rpx;
				margin-top: 7rpx;
			}
		}
		// view{
		// 	display: flex;
		// 	align-items: center;
		// 	&:nth-child(2n){
		// 		justify-content: flex-start;
		// 	}
		// 	&:nth-child(2n-1){
		// 		justify-content: flex-end;
		// 	}
		// 	.left{
		// 		display: flex;
		// 		flex-direction: column;
		// 		justify-content: center;
		// 		align-items: center;
		// 		width: 178rpx;
		// 	}
		// 	.text{
		// 		width: 300rpx;
		// 		font-size: 36rpx;
		// 		font-weight: normal;
		// 		color: #58B73F;
		// 		margin-left: 20rpx;
		// 	}
		// 	.img-top{
		// 		width: 100%;
		// 		height: 172rpx;
		// 		background: url(../../static/mryl-qp.png) no-repeat top center;
		// 		background-size: cover;
		// 		display: flex;
		// 		justify-content: center;
		// 		align-items: center;
		// 		image{
		// 			height: 74rpx;
		// 		}
		// 	}
		// 	.img-bottom{
		// 		image{
		// 			width: 154rpx;
		// 			height: 152rpx;
		// 		}
		// 	}
		// }
	}
	.slot-wrap{
		display: flex;
		align-items: center;
		view{
			margin-right: 32rpx;
			display: flex;
			align-items: center;
			image{
				width: 38rpx;
				height: 38rpx;
			}
			text{
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				margin-left: 8rpx;
			}
		}
	}
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background: url(../../static/mryl-add-bg.png) no-repeat top center;
		background-size: cover;
		z-index: -1;
	}
</style>
