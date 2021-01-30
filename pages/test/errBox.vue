<template>
	<view>
		<web-view v-if="url" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				zsdid:'',
				zsdmc:'',
				url:'',
				href:'http://192.168.2.100:8081',
			}
		},
		onLoad(obj) {
			this.zsdid = obj.zsdid
			this.zsdmc = obj.zsdmc
			let xsid = getApp().globalData.userInfo.xsid
			this.url = `http://192.168.2.100:8081/dist/pages/index/errTest?zsdid=${this.zsdid}&zsdmc=${this.zsdmc}&xsid=${xsid}`
			console.log(this.url)
		},
	}
</script>

<style>

</style>
