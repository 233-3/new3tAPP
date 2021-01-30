<template>
	<view class="testRecord">
		<u-navbar title="测试记录" back-icon-color="#303133" :border-bottom="false" >
			<view class="slot-wrap" slot="right">
				<u-icon name="zhuanfa" size="38"></u-icon>
			</view>
		</u-navbar>
		<view class="fixed"></view>
		<view class="card top-box" style="margin-top: 90px;">
			本课程一共<text>{{topInfo.zyts ? topInfo.zyts : 0}}</text>套作业，已完成<text>{{topInfo.wcts ? topInfo.wcts : 0}}</text>套测试，平均用时<text>{{Math.ceil(topInfo.pjys) ? Math.ceil(topInfo.pjys) : 0}}</text>分，平均得分<text>{{topInfo.pjdf ? topInfo.pjdf : 0}}</text>分，综合排名第<text>{{topInfo.pm ? topInfo.pm : 0}}</text>名。
		</view>
		<view class="card">
			<view class="dajx">具体得分情况</view>
			<canvas canvas-id="canvasMix" id="canvasMix"  class="charts"  disable-scroll=true 
			 @touchstart="touchColumn" @touchmove="moveA" @touchend="touchEndA"></canvas>
		</view>
		<view class="card">
			<view class="kczsd">知识点掌握</view>
			<view class="zsd-box" v-if="zsdjx">
				<view>
					<view class="huang">知识点</view>
					<view class="huang">我的得分率</view>
					<view class="huang">掌握情况</view>
				</view>
				<view v-for="(item, index) in zsdjx">
					<view>{{item.zsdmc}}</view>
					<view :class="{red:parseFloat(item.dfl) < parseFloat(item.pjdfl)}">{{item.dfl.toFixed(0)}}%</view>
					<view><u-rate :count="4" :disabled="true" v-model="item.zwqk" active-color="#feba0c"></u-rate></view>
				</view>
			</view>
		</view>
		<view class="card" v-if="allInfo">
			<view class="zsdnl">提升建议</view>
			<view class="tsjy" v-if="allInfo.tsjys != ''">{{allInfo.tsjys[index].tsjy}}</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '../../js_sdk/u-charts/u-charts/u-charts.js';
	let canvaColumn = null
	export default {
		data() {
			return {
				kcid:'',
				topInfo:'',
				cWidth:'',
				cHeight:'',
				allInfo:'',
				index:0,
				zsdjx:'',
			};
		},
		onLoad(obj) {
			this.kcid = obj.kcid
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getTopInfo()
			this.getChartsInfo()
		},
		methods:{
			//获取顶部数据
			getTopInfo(){
				this.$u.post('ceshijilu/selectCPJL',{
					kcid:this.kcid,
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					this.topInfo = res
				}).catch(err=>console.log(err))
			},
			//获取页面全部数据
			getChartsInfo(){
				this.$u.post('ceshijilu/selectCPJLTJ',{
					kcid:this.kcid,
					xsid:getApp().globalData.userInfo.xsid
				}).then(res=>{
					this.allInfo = res
					this.showTB()
				}).catch(err=>console.log(err))
			},
			resetZSD(index){
				let zsd = JSON.parse(JSON.parse(this.allInfo.zsdjxs[index].zsdjx))
				zsd.forEach(val=>{
				    let dfl = (val.zsdwddf/val.zsdzf) * 100
				    val.dfl = dfl
					if(90 <= dfl){
						val.zwqk = 4
					} else if (dfl >= 80 && dfl < 90){
						val.zwqk = 3
					} else if (dfl >= 60 && dfl < 80){
						val.zwqk = 2
					} else if (dfl < 90){
						val.zwqk = 1
					}
				})
				this.zsdjx = zsd
			},
			touchEndA(e){
				canvaColumn.scrollEnd(e);
			},
			moveA(e) {
				canvaColumn.scroll(e)
			},
			touchColumn(e){
				canvaColumn.scrollStart(e);
				this.index = canvaColumn.getCurrentDataIndex(e) 
				if(this.index == -1) {
					return false
				}
				this.resetZSD(this.index)
				canvaColumn.showToolTip(e, {
					format: function (item, category) {
						if(typeof item.data === 'object'){
							return category + ' ' + item.name + ' ' + item.data.value + '分' 
						}else{
							return category + ' ' + item.name + ' ' + item.data + '分' 
						}
					},
				});
			},
			showTB(){
				this.resetZSD(0)
				let chartData = {
					  "categories": [],
					  "series": [{
						"name": "-",
						"data": [],
					  },]
				}
				if(this.allInfo.jtdfqk){
					var jtdfqk = this.allInfo.jtdfqk
				} else {
					return false
				}
				for(var i=0; i<=jtdfqk.length-1;i++){
					chartData.categories.push(jtdfqk[i].jcmc)
					chartData.series[0].data.push(jtdfqk[i].fs)
				}
				canvaColumn = new uCharts({
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
			}
		}
	}
</script>

<style lang="scss" scoped>
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
				font-size: 24rpx;
				font-weight: 500;
				color: #FFFFFF;
				margin-left: 9rpx;
			}
		}
	}
	.charts{
		width: 630upx; 
		height:500upx;
	}
	.testRecord{
		padding: 0rpx 30rpx 30rpx;
		color: #505050;
		.top-box{
			font-size: 28rpx;
			font-weight: 400;
			line-height: 55rpx;
			text-indent: 50rpx;
			text{
				color: #FF5A00;
				margin: 0 10rpx;
			}
		}
		.card{
			background: #FFFFFF;
			box-shadow: 0px 4rpx 28rpx 0px rgba(4, 0, 0, 0.16);
			border-radius: 20rpx;
			padding: 30rpx;
			margin-bottom: 34rpx;
			.zsd-box{
				font-size: 12px;
				text-align: center;
				align-items: center;
				// border: 1px solid #bfbfbf;
				.huang{
					background: #FFCC00;
					border-color: #FFCC00!important;
					color: #FFFFFF;
					height: 35px !important;
					line-height: 35px;
				}
				view{
					display: flex;
					flex-wrap: wrap;
					flex: 1;
					align-items: center;
					justify-content: center;
					view{
						padding-left: 2px;
						height:60px;
						// border: 1px solid #bfbfbf;
						border-left: none;
						margin: 0;
						&:nth-child(1){
							border-left: 1px solid #bfbfbf;
							border-bottom: 1px solid #bfbfbf;
							overflow: auto;
						}
						&:nth-child(2){
							border-left: 1px solid #bfbfbf;
							border-bottom: 1px solid #bfbfbf;
							border-right: 1px solid #bfbfbf;
						}
						&:last-child{
							width: 30%;
							border:none;
							border-right: 1rpx solid #bfbfbf;
							border-bottom: 1px solid #bfbfbf;
						}
					}
					
				}
			}
			.red{
				color: red;
			}
			.tsjy{
				font-size: 28rpx;
				font-weight: 400;
				line-height: 55rpx;
				padding: 20rpx;
			}
			.dajx{
				margin: 20rpx 0 10rpx;
				background: url(../../static/lk-zy.png) no-repeat;
				background-size: 66rpx 70rpx;
				padding: 20rpx 0 20rpx 80rpx;
				font-size: 32rpx;
				font-weight: 500;
				&::after{
					content: '';
					display: block;
					width: 180rpx;
					height: 17rpx;
					background: #FFD14A;
					opacity: 0.4;
					margin-top: -15rpx;
				}
			}
			.kczsd{
				margin: 20rpx 0 10rpx;
				background: url(../../static/lk-dp.png) no-repeat;
				background-size: 67rpx 91rpx;
				padding: 20rpx 0 20rpx 80rpx;
				font-size: 32rpx;
				font-weight: 500;
				&::after{
					content: '';
					display: block;
					width: 157rpx;
					height: 17rpx;
					background: #FFD14A;
					opacity: 0.4;
					margin-top: -15rpx;
				}
			}
			.zsdnl{
				margin: 20rpx 0 10rpx;
				background: url(../../static/lk-zz.png) no-repeat;
				background-size: 67rpx 72rpx;
				padding: 20rpx 0 20rpx 80rpx;
				font-size: 32rpx;
				font-weight: 500;
				&::after{
					content: '';
					display: block;
					width: 157rpx;
					height: 17rpx;
					background: #FFD14A;
					opacity: 0.4;
					margin-top: -15rpx;
				}
			}
		}
	}
	.fixed{
		width: 100%;
		height:100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #fffcf4 url(../../static/csjl-bg.png) no-repeat;
		background-position: 0px 44px;
		background-size: 100%;
		z-index: -2;
	}
	
</style>
