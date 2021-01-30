<template>
	<view class="wkxx">
		<u-tabs v-if="flList" :list="flList" name="fl_mc" font-size="32" inactive-color="#999999" active-color="#333333" :bar-style='barStyle' :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view class="kc-list">
			<view :class="{'kc-wrapper':true,'test-wrapper':item.xxjdkclx == 1} " v-for="(item, index) in kclist" :key="index" @click="goInfo(item)">
				<view class="kc-img">
					<image :src="item.kc_fm ? item.kc_fm : $errImg" mode="widthFix"></image>
					<text v-if="shzt == 0" :class="{'fm_active': item.kc_sfsf != 1}">{{item.kc_sfsf == 1? 'VIP': (item.kc_sfsf == 0? '免费': '限免')}}</text>
				</view>
				<view class="kc-info">
					<text class="kc-title">{{item.kc_mc}}</text>
					<view class="jczy-box">
						<view>
							<image src="../../../static/icon-jc.png" mode=""></image>
							<text>讲次：{{item.jcTotal}}讲</text>
						</view>
						<view>
							<image src="../../../static/icon-zy.png" mode=""></image>
							<text>作业：{{item.zyTotal}}套</text>
						</view>
					</view>
					<view class="bottom-wrapper" style="display: flex; justify-content: space-between;align-items: center;margin-top: 10rpx;">
						<view style="color: 666;font-size: 24rpx;opacity: .6;">已学{{item.jdTotal}}节课</view>
						<view class="bottom-btn">开始学习</view>
					</view>
				</view>
			</view>
		</view>
		<u-empty v-if="kclist.length <= 0" text="暂无内容" mode="list"  margin-top="100"></u-empty>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				barStyle:{
					width: '24rpx',
					height: '6rpx',
					background: '#61BEFF',
					borderRadius: '2rpx',
				},
				current:0,
				flList:[
					{
						'fl_mc':'知识精讲',
						'fl_id':0
					},
					{
						'fl_mc':'家庭教育',
						'fl_id':1
					},
					{
						'fl_mc':'教材课程',
						'fl_id':2
					}
				],
				kclist:'',
				shzt:''
			};
		},
		created(){
			this.shzt = getApp().globalData.shzt
			this.getListInfo()
		},
		methods:{
			goInfo(item){
				// console.log(item)
				let lx = item.xxjdkclx
				let kcid = item.kc_id
				let xkid = item.kc_xkid
				console.log(lx)
				if(lx == 0){
					this.$u.route('pages/index/kcInfoTwo',{
						kcid:kcid,
						item:JSON.stringify(item)
					})
					return false
				}
				if(lx == 1){
					this.$u.route('pages/index/kcInfoThree',{
						kcid:kcid,
						item:JSON.stringify(item)
					})
					return false
				}
				if(lx == 2){
					this.$u.route('pages/index/kcInfo',{item:JSON.stringify(item),xkid:xkid})
					return false
				}
			},
			change(index){
				this.current = index;
				console.log(this.current)
				this.getListInfo()
			},
			getListInfo(){
				this.$u.post('weikexuexi/selectWKXX',{
					xxjdxsid:getApp().globalData.userInfo.xsid,
					xxjdkclx:this.flList[this.current].fl_id
				}).then(res=>{
					console.log(res)
					this.kclist = res
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wkxx{
		.kc-list{
			margin-top: 25rpx;
			.test-wrapper{
				.kc-img{
					width: 336rpx !important;
					margin-right: 28rpx;
					position: relative;
					overflow: hidden;
					image{
						width: 336rpx !important;
					}
				}
				.jczy-box{
					display: none !important;
				}
				.bottom-wrapper{
					view{
						&:first-child{
							display: none !important;
						}
						&:last-child{
							margin-top: 30rpx;
						}
					}
				}
			}
			.kc-wrapper{
				display: flex;
				background: #FFFFFF;
				box-shadow: 0px 5px 27px 0px rgba(4, 0, 0, 0.09);
				border-radius: 20px;
				padding: 38rpx;
				position: relative;
				margin-bottom: 45rpx;
				.kc-img{
					// display: flex;
					// align-items: center;
					width: 168rpx;
					// height: 210rpx;
					margin-right: 28rpx;
					position: relative;
					overflow: hidden;
					image{
						width: 168rpx;
						// height: 210rpx;
					}
					text{
						position: absolute;
						top: 0;
						right: -40rpx;
						width: 120rpx;
						line-height: 40rpx;
						transform: rotate(45deg);
						color: #fff;
						font-size: 12px !important;
						text-align: center;
						background: #ff6f4c;
					}
					.fm_active{
						// color: #333;
					}
				}
				.bottom-btn{
					// float: right;
					width: 203rpx;
					height: 48rpx;
					background: #FF8400;
					border-radius: 24rpx;
					font-size: 24rpx;
					font-weight: 500;
					color: #FFFEFE;
					text-align: center;
					line-height: 48rpx;
					margin-top: 20rpx;
				}
				.kc-info{
					flex: 1;
					.jczy-box{
						display: flex;
						justify-content: space-between;
						margin-top: 26rpx;
					}
					.kc-title{
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
						font-size: 30rpx;
						font-weight: 500;
						color: #333333;
					}
					image{
						width: 24rpx;
						height: 24rpx;
						margin-right: 12rpx;
					}
				}
			}
		}
	}
</style>
