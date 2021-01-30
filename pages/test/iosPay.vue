<template>
	<view>
		<web-view v-if="url" :src="url" :webview-styles="webviewStyles"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				obj:'',
				webviewStyles: {
					progress: {
						color: '#66b9fd'
					}
				}
			}
		},
		onLoad(obj) {
			this.obj = JSON.parse(obj.obj)
			let url = `http://test.zzxiaoyi.com/index.html?ddlx=${this.obj.ddlx}&gmje=${this.obj.gmje}&spid=${this.obj.spid}&spmc=${this.obj.spmc}&spxj=${this.obj.spxj}&xsid=${this.obj.xsid}&yhje=${this.obj.yhje}&yhlx=${this.obj.yhlx}&kcfm=${this.obj.kcfm}&spyj=${this.obj.spyj}&yhid="${this.obj.yhid}"`
			this.url = url
			console.log(this.url)
			console.log(this.obj)
		},

	}
</script>

<style>

</style>
