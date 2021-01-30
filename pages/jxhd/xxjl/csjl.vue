<template>
	<view class="testjl">
		<view class="testjl-warpper" v-if="ssInfo != ''">
			<view class="title">
				<image v-if="ssInfo.xk_id == 2" src="../../../static/shuxue.png" mode="heightFix"></image>
				{{ssInfo.xk_mc}}近十次得分统计
			</view>
			<view style="width: 100%;background: #FFFFFF;">
				<canvas canvas-id="canvasMix" id="canvasMix"  class="charts"  disable-scroll=true
				 @touchstart="touchColumn" @touchmove="moveA" @touchend="touchEndA"></canvas>
			</view>
			<view class="test-bottom">
				<view>提升建议</view>
				<view>{{ssInfo.tsjy.join(',')}}</view>
				<image src="../../../static/csjl-right.png" mode="heightFix"></image>
			</view>
		</view>
		
		<view class="testjl-warpper" v-if="yyInfo != ''">
			<view class="title">
				<image v-if="yyInfo.xk_id == 1" src="../../../static/yingyu.png" mode="heightFix"></image>
				{{yyInfo.xk_mc}}近十次得分统计
			</view>
			<view style="width: 100%;background: #FFFFFF;">
				<canvas canvas-id="canvasMixB" id="canvasMixB"  class="charts"  disable-scroll=true
				 @touchstart="touchColumnB" @touchmove="moveB" @touchend="touchEndB"></canvas>
			</view>
			<view class="test-bottom">
				<view>提升建议</view>
				<view>{{yyInfo.tsjy.join(',')}}</view>
				<image src="../../../static/csjl-right.png" mode="heightFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '../../../js_sdk/u-charts/u-charts/u-charts.js';
	let canvaColumnSS = null
	let canvaColumnYY = null
	export default {
		data() {
			return {
				yyInfo:'',
				ssInfo:'',
				cWidth:'',
				cHeight:'',
			};
		},
		onLoad() {
			
		},
		created(){
			this.cWidth=uni.upx2px(700);
			this.cHeight=uni.upx2px(500);
			this.getTestInfo()
		},
		methods:{
			touchEndB(e){
				canvaColumnYY.scrollEnd(e);
			},
			moveB(e) {
				canvaColumnYY.scroll(e)
			},
			touchColumnB(e){
				canvaColumnYY.scrollStart(e);
				canvaColumnYY.showToolTip(e, {
					format: function (item, category) {
						if(typeof item.data === 'object'){
							return category + ' ' + item.name + ' ' + item.data.value + '分' 
						}else{
							return category + ' ' + item.name + ' ' + item.data + '分' 
						}
					},
				});
			},
			showTBYY(){
				let chartData = {
					  "categories": [],
					  "series": [{
						"name": "-",
						"data": [],
					  },]
				}
				for(var i=0; i<=this.yyInfo.tjtb.length-1;i++){
					chartData.categories.push(this.yyInfo.tjtb[i].sjmc)
					chartData.series[0].data.push(this.yyInfo.tjtb[i].xsdf)
				}
				canvaColumnYY = new uCharts({
					$this:this,
					canvasId: 'canvasMixB',
					type: 'column',
					legend:{show:false},
					fontSize:11,
					background:'#FFFFFF',
					pixelRatio:1,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					colors:['#00D399'],
					enableScroll: true,//开启图表拖拽功能 	
					xAxis: {
						disableGrid:false,
						rotateLabel:true,
						itemCount:6,//x轴单屏显示数据的数量,!!!
						scrollShow:true,//新增是否显示滚动条，默认false
						scrollAlign:'left',//滚动条初始位置
						scrollBackgroundColor:'#F7F7FF',//默认为 #EFEBEF
						scrollColor:'#DEE7F7',//默认为 #A6A6A6
					},
					dataLabel: true,
					width: this.cWidth,
					height: this.cHeight,
					extra: {
						column: {
							type:'group',
							width: 20
						}
					 }
				});
			},
			touchEndA(e){
				canvaColumnSS.scrollEnd(e);
			},
			moveA(e) {
				canvaColumnSS.scroll(e)
			},
			touchColumn(e){
				canvaColumnSS.scrollStart(e);
				canvaColumnSS.showToolTip(e, {
					format: function (item, category) {
						if(typeof item.data === 'object'){
							return category + ' ' + item.name + ' ' + item.data.value + '分' 
						}else{
							return category + ' ' + item.name + ' ' + item.data + '分' 
						}
					},
				});
			},
			showTBSS(){
				let chartData = {
					  "categories": [],
					  "series": [{
						"name": "-",
						"data": [],
					  },]
				}
				for(var i=0; i<=this.ssInfo.tjtb.length-1;i++){
					chartData.categories.push(this.ssInfo.tjtb[i].sjmc)
					chartData.series[0].data.push(this.ssInfo.tjtb[i].xsdf)
				}
				console.log(chartData)
				canvaColumnSS = new uCharts({
					$this:this,
					canvasId: 'canvasMix',
					type: 'column',
					legend:{show:false},
					fontSize:11,
					background:'#FFFFFF',
					pixelRatio:1,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					colors:['#00D399'],
					enableScroll: true,//开启图表拖拽功能 	
					xAxis: {
						rotateLabel:true,
						itemCount:6,//x轴单屏显示数据的数量,!!!
						scrollShow:true,//新增是否显示滚动条，默认false
						scrollAlign:'left',//滚动条初始位置
						scrollBackgroundColor:'#F7F7FF',//默认为 #EFEBEF
						scrollColor:'#DEE7F7',//默认为 #A6A6A6
					},
					dataLabel: true,
					width: this.cWidth,
					height: this.cHeight,
					extra: {
						column: {
							type:'group',
							width: 20
						}
					 }
				});
			},
			getTestInfo(){
				this.$u.post('ceshijilu/selectCSJL',{
					xsid:getApp().globalData.userInfo.xsid,
				}).then(res=>{
					for(let i=0; i<= res.length-1; i++){
						if(res[i].xk_id == 2){
							console.log('数学')
							console.log(res[i])
							this.ssInfo = res[i]
							this.showTBSS()
						}
						if(res[i].xk_id == 1){
							console.log('英语')
							console.log(res[i])
							this.yyInfo = res[i]
							this.showTBYY()						
						}
					}
					console.log(this.yyInfo,this.ssInfo)
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.testjl{
		.charts{
			width: 100%;
			height: 500rpx;
		}
		.testjl-warpper{
			.test-bottom{
				background: #FFCC00;
				border-radius: 55rpx;
				padding: 0 30rpx;
				height: 109rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 60rpx 0;
				image{
					height: 150rpx;
				}
				view{
					&:nth-child(1){
						font-size: 30rpx;
						font-weight: 500;
						color: #272A29;
						&::after{
							content: ' ';
							display: block;
							width: 146rpx;
							height: 17rpx;
							background: #FDAA43;
							border-radius: 5rpx;
							margin: -7px -5px 0;
						}
					}
					&:nth-child(2){
						width: 241rpx;		
						font-size: 24rpx;
					}
				}
			}
			.title{
				font-size: 30rpx;
				font-weight: 400;
				color: #272A29;
				vertical-align: middle;
				margin: 33rpx 0;
				image{
					height: 40rpx;
					margin-right: 10rpx;
					vertical-align: middle;
				}
			}
		}
	}
</style>
