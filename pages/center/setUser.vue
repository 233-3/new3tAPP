<template>
	<view>
		<u-navbar title="个人信息" back-icon-color="#000" title-color="#000" :border-bottom="false"></u-navbar>
		<view class="fixed"></view>
		<view class="list">
			<view class="list-wrapper">
				<text>头像</text>
				<u-avatar :src="src" @click="openImg"></u-avatar>
			</view>
			<u-line></u-line>
		</view>
		<view class="list">
			<view class="list-wrapper">
				<text>用户名</text>
				<view style="width: 150rpx;">
					<input v-model="name" style="text-align: right;font-size: 14px;color: #999999;" />
				</view>
			</view>
			<u-line></u-line>
			<view class="list-wrapper" @click="$u.route('pages/center/resetTel')">
				<text>账户号码</text>
				<u-icon name="arrow-right" :label="$telXX(userInfo.xsdh)" label-size="28rpx" label-color="#999999" color="#999999"
				 size="20" label-pos="left" margin-right="15"></u-icon>
			</view>
			<u-line></u-line>
			<!-- <view class="list-wrapper" @click="$u.route('pages/center/resetMM')">
				<text>账号密码</text>
				<u-input @click="$u.route('pages/center/resetMM')" :value="userInfo.xsmm" :custom-style="{textAlign: 'right',color: '#999999'}"
				 disabled type="password" :password-icon="true" />
			</view>
			<u-line></u-line> -->
			<view class="list-wrapper">
				<text>性别</text>
				<view class="sexbox">
					<view :class="{acsex:sex == 0}" @click="sex = 0">男</view>
					<view :class="{acsex:sex == 1}" @click="sex = 1">女</view>
				</view>
			</view>
			<u-line></u-line>
		</view>
		<u-select v-model="njShow" v-if="njList" :list="njList" value-name="nj_id" label-name="nj_mc" @confirm="njConfirm"></u-select>
		<view class="list">
			<view class="list-wrapper" @click="njShow = !njShow">
				<text>所在年级</text>
				<u-icon name="arrow-down" :label="njmc" label-size="28rpx" label-color="#999999" color="#999999" size="20"
				 label-pos="left" margin-right="15"></u-icon>
			</view>
			<u-line></u-line>
			<view class="list-wrapper" @click="show = !show">
				<text>所在区域</text>
				<u-icon name="arrow-down" :label="xsssqmc" label-size="28rpx" label-color="#999999" color="#999999" size="20"
				 label-pos="left" margin-right="15"></u-icon>
			</view>
			<u-line></u-line>
			<view class="list-wrapper">
				<text>详细地址</text>
				<input v-model="xsaddress" style="text-align: right;font-size: 14px;color: #999999;" />
			</view>
			<u-line></u-line>
		</view>
		<u-select v-model="show" v-if="list"  mode="mutil-column-auto" :list="list" @confirm="confirm"></u-select>
		<view class="submit" @click="sendInfo">保存</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				src: '',
				userInfo: '',
				sex: '',
				name: '',
				njmc: '',
				njid: '',
				njShow: false,
				njList: '',
				xsaddress: '',
				xsssqmc: '',
				xsssq: 0,
				list:'',
			};
		},
		onLoad() {
			this.getUserInfo()
			this.getNJList()
		},
		created() {
			this.getSSQ()
		},
		methods: {
			//修改成功后更新缓存
			resetStorage(){
				this.userInfo = getApp().globalData.userInfo
				this.userInfo.xstx = this.src
				this.userInfo.xsxb = this.sex
				this.userInfo.xsmc = this.name
				this.userInfo.nj_mc = this.njmc
				this.userInfo.xsnj = this.njid
				this.userInfo.xsaddress = this.xsaddress
				this.userInfo.xsssqmc = this.xsssqmc
				console.log(this.userInfo)
				//把用户信息存到缓存中
				uni.setStorage({
				    key: 'userInfo',
				    data: this.userInfo,
				})
			},
			sendInfo() {
				if(this.name == ''){
					this.$refs.uToast.show({
						type:'error',
						title:'用户名不能为空，请重试'
					})
					return false
				}
				let data = {
					xsid:getApp().globalData.userInfo.xsid,
					xsmc: this.name,
					xsxb: this.sex,
					xstx: this.src,
					xsnj: this.njid,
					xsaddress: this.xsaddress,
					xsssqmc: this.xsssqmc,
					xsssq: this.xsssq
				}
				this.$u.post('grzx/updateByIdXSXX',data).then(res=>{
					console.log(res)
					if(res){
						this.$refs.uToast.show({
							type:'success',
							title:'修改成功'
						})
						this.resetStorage()
					}else {
						this.$u.toast('失败请重试')
					}
				}).catch(err=>console.log(err))
				console.log(data)
			},
			njConfirm(val) {
				this.njmc = val[0].label
				this.njid = val[0].value
			},
			confirm(val) {
				console.log(val)
				this.xsssqmc = `${val[0].label}-${val[1].label}-${val[2].label}`
				this.xsssq = `${val[0].value}-${val[1].value}-${val[2].value}`
				console.log(this.xsssqmc,this.xsssq)
			},
			//获取省市区
			getSSQ() {
				this.$u.post('api/ACommonController/queryArea').then(res => {
					this.list = res
				}).catch(err => console.log(err))
			},
			getNJList() {
				this.$u.post('app/appLoginController/selectNj').then(res => {
					if (res) {
						this.njList = res
					} else {
						this.$refs.uToast.show({
							title: res
						})
					}
				}).catch(err => this.$refs.uToast.show({
					title: err
				}))
			},
			getUserInfo() {
				this.userInfo = getApp().globalData.userInfo
				this.src = this.userInfo.xstx ? this.userInfo.xstx : '../../static/login_img.png'
				this.sex = this.userInfo.xsxb
				this.name = this.userInfo.xsmc
				this.njmc = this.userInfo.nj_mc
				this.njid = this.userInfo.xsnj
				this.xsaddress = this.userInfo.xsaddress
				this.xsssqmc = this.userInfo.xsssqmc
			},
			//上传图片
			openImg() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						console.log(JSON.stringify(res.tempFilePaths));
						const tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '上传中'
						});
						this.testUpFile(tempFilePaths, 0)
					}
				});
			},
			testUpFile(tempFilePaths) {
				let url = tempFilePaths[0]
				uni.uploadFile({
					url: this.$action, //仅为示例，非真实的接口地址
					filePath: url,
					name: 'file',
					success: (uploadFileRes) => {
						let str = JSON.parse(uploadFileRes.data)
						if (uploadFileRes.statusCode == 200) {
							this.src = str.url
							console.log(this.src)
							uni.hideLoading()
						} else {
							uni.hideLoading()
							this.$u.toast('上传失败，请重试')
						}
					},
					fail: () => {
						uni.hideLoading()
						this.$u.toast('上传失败')
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.submit {
		margin: 110rpx auto 0;
		width: 479rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		background: #61BEFF;
		border-radius: 35rpx;
		font-size: 36rpx;
		font-weight: 400;
		color: #FFFEFE;
	}

	.fixed {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #F4F5F7;
		z-index: -1;
	}

	.list {
		background: #FFFFFF;
		padding: 0 20rpx;
		margin-top: 20rpx;

		.list-wrapper {
			padding: 45rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.sexbox {
				display: flex;

				view {
					width: 76rpx;
					height: 36rpx;
					line-height: 36rpx;
					border: 1px solid #61BEFF;
					border-radius: 18rpx;
					font-size: 27rpx;
					font-weight: 400;
					color: #61BEFF;
					text-align: center;

					&:first-child {
						margin-right: 15rpx;
					}
				}

				.acsex {
					color: #FFFFFF;
					background: #61BEFF;
					border: 1px solid #61BEFF;
				}
			}
		}
	}
</style>
