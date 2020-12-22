<template>
	<view class="content">
		<u-form :model="form" ref="uForm">
			<u-form-item label="账号" prop="tel">
				<u-input v-model="form.tel"  placeholder="请输入手机号"/>
			</u-form-item>
			<u-form-item label="密码" prop="password">
				<u-input v-model="form.password" type="password" placeholder="请输入密码" />
			</u-form-item>
		</u-form>
		<u-button @click="submit" style="margin-top: 20px;">登录</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					tel: '',
					password: ''
				},
				rules: {
					tel: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change'],
						}
					],
					password: [{
						min: 6,
						message: '密码不能少于6个字',
						trigger: 'change'
					}]
				}
			}
		},
		onLoad() {
			this.geXKList()
			this.setNJ()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log(getApp().globalData)
					} else {
						console.log('验证失败');
					}
				});
			},
			geXKList(){
				this.$u.get('/api/ACommonController/queryTBJCXKList').then(res=>console.log(res))
			},
			setNJ(){
				this.$u.post('/api/ACommonController/queryTBJCNJList',{xkid:1}).then(res=>console.log(res))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
	}
</style>
