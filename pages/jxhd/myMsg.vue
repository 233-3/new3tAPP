<template>
	<view class="myMsg">
		<view class="top">
			<!-- <u-tabs name="name" count="num" :list="list" active-color="#fff" inactive-color="#000" :active-item-style="obj" :is-scroll="false" :show-bar="false" :current="curNow" @change="sectionChange"></u-tabs> -->
			<view class="top-box">
				<view :class="{'ac':testIndex == item.id}" v-for="(item, index) in list" @click="testIndex = item.id;getList()">
					{{item.name}}
					<view v-if="item.num">{{item.num}}</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view>
				<view class="wrapper" v-for="(item, index) in xxlist" :key="index" @click="goInfo(item)">
					<image src="../../static/login_img.png" mode=""></image>
					<view class="right">
						<view class="title-box">
							<view class="title">{{item.xxmc}}</view>
							<view class="time">{{item.xxrq}}</view>
						</view>
						<view class="desc">
							{{escape2Html(removeHTMLTag(item.xxnr)).substring(0,30) + '...'}}
						</view>
					</view>
				</view>
			</view>
			<view class="noInfo" v-if="xxlist.length <= 0">
				<image src="../../static/xx-zwnr.png" mode="widthFix"></image>
				<view>暂无内容</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				testIndex:0,
				list: [
					{
						name: '老师信息',
						id: 0,
						num:0,
					},
					{
						name: '系统消息',
						id: 1,
						num:0,
					}
				],
				curNow:0,
				obj:{
					background: '#61BEFF',
					borderRadius: '30px'
				},
				xxlist:[]
			};
		},
		created() {
			this.getList()
			this.getNoLook()
		},
		activated() {
            this.getList()
            this.getNoLook()
        },
		methods: {
			goInfo(item){
				this.$u.route('pages/jxhd/msgInfo',{
					xsxxid:item.xsxxid,
					xxid:item.xxid
				})
			},
			sectionChange(val){
				this.curNow = val
				this.getList()
			},
			getList(){
				this.$u.post('api/FXXController/queryList',{
					param1:1,
					param2:100,
					param3:getApp().globalData.userInfo.xsid,
					param4:this.testIndex
				}).then(res=>{
					this.xxlist = res.rows
				}).catch(err=>console.log(err))
			},
			getNoLook(){
				this.$u.post('api/FXXController/queryWDList',{
					param3:getApp().globalData.userInfo.xsid,
				}).then(res=>{
					// console.log(res)
					for(let i=0; i <= res.length-1;i++){
						console.log(res[i])
						if(res[i].xxlx == 2){
							this.list[0].num = res[i].total
						} else {
							this.list[1].num += res[i].total
						}
					}
					// console.log(this.list)
				}).catch(err=>console.log(err))
			},
			removeHTMLTag(str) {
				str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
				str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
				str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
				str=str.replace(/ /ig,'');//去掉 
				return str;
			},
			escape2Html(str) { 
				var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}; 
				return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
			} 
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-tabs{
		border-radius: 30px;
	}
	.myMsg{
		.top{
			padding: 30rpx;
			background: #F4F5F7;
			.top-box{
				display: flex;
				background-color: #FFFFFF;
				border-radius: 30px;
				view{
					transition: all .5s;
					padding: 16rpx;
					text-align: center;
					flex: 1;
					font-size: 28rpx;
					font-weight: 500;
					color: #222222;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					view{
						position: absolute;
						top: -22rpx;
						right: 22rpx;
						width: 44rpx;
						height: 44rpx;
						background: #FF8400;
						border: 4rpx solid #FFFFFF;
						border-radius: 50%;
						color: #FFFFFF;
						font-size: 24rpx;
					}
				}
				.ac{	
					color: #FFFFFF;
					background: #61BEFF;
					border-radius: 30px;
				}
			}
		}
		.content{
			.noInfo{
				margin-top: 100rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image{
					width: 272rpx;
				}
				view{
					margin-top: 37rpx;
					font-size: 26rpx;
					font-weight: 400;
					color: #CFCFCF;
				}
			}
			.wrapper{
				padding: 30rpx;
				display: flex;
				justify-content: flex-start;
				border-bottom: 1px solid #F7F7F7;
				image{
					width: 101rpx;
					height: 101rpx;
					margin-right: 30rpx;
				}
				.right{
					flex: 1;
					.desc{
						font-size: 24rpx;
						font-weight: 400;
						color: #919191;
						margin-top: 25rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.title-box{
						display: flex;
						justify-content: space-between;
						align-items: center;
						.title{
							font-size: 36rpx;
							font-weight: 400;
							color: #222222;
						}
						.time{
							font-size: 22rpx;
							font-weight: 400;
							color: #919191;
						}
					}
				}
			}
		}
	}
</style>
