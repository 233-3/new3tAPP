<template>
	<view style="overflow: hidden;">
		<!-- <view class="test"></view> -->
		<web-view v-if="url" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sjid:'',
				xsid:'',
				url:'',
				lx:'', //0同步试卷 1课后作业 6学情 7错题本 8每日一练 9每日一练学情
				sfwc:'',
				xkid:'',
				xszyid:'',
				href:'http://192.168.2.102:8081',
				zsdid:'',
				zsdmc:'',
			}
		},
		onLoad(obj) {
			this.sjid = obj.sjid
			this.xsid = obj.xsid
			this.lx = obj.lx
			this.sfwc = obj.sfwc
			this.xkid = obj.xkid
			this.zsdid = obj.zsdid
			this.zsdmc = obj.zsdmc
			if(this.sfwc == 0 && this.lx == 0){
				this.url = `${this.href}/dist/?sjid=${this.sjid}&xsid=${this.xsid}&lx=${this.lx}&sfwc=${this.sfwc}&xkid=${this.xkid}&xszyid=${obj.xszyid}&sjmc=${obj.sjmc}&mc=${obj.mc}&tbsjid=${obj.tbsjid}`
				return false
			} else if (this.lx == 1) { 
				this.url = `${this.href}/dist/?sjid=${this.sjid}&xsid=${this.xsid}&lx=${this.lx}&xkid=${this.xkid}&xszyid=${obj.xszyid}&sjmc=${obj.sjmc}&item=${obj.item}`
				return false
			} else if (this.lx == 6) {  //通用学情相关
				this.url = `${this.href}/dist/pages/index/studyInfo?zyid=${obj.xszyid}&sjmc=${obj.sjmc}&index=1`
				return false
			} else if(this.lx == 7){ //错题本相关
				this.url = `${this.href}/dist/pages/index/errTest?zsdid=${this.zsdid}&zsdmc=${this.zsdmc}&xsid=${this.xsid}`
				return false
			} else if (this.lx == 8) { //每日一练做题相关
				this.url = `${this.href}/dist/pages/index/mrylTest?xkid=${this.xkid}&xsid=${this.xsid}&sjid=${this.sjid}&sjmc=${obj.sjmc}&mrylid=${obj.mrylid}&ylrq=${obj.ylrq}`
				return false
			} else if (this.lx == 9) { //每日一练学情
				this.url = `${this.href}/dist/pages/index/mrylStudyInfo?xqid=${obj.xqid}`
				return false
			} else {
				this.url = `${this.href}/dist/?sjid=${this.sjid}&xsid=${this.xsid}&lx=${this.lx}&sfwc=${this.sfwc}&xkid=${this.xkid}&sjmc=${obj.sjmc}`
				return false
			} 
		},
		methods: {
		}
	}
</script>

<style scoped>
	.test{
		height: 88rpx;
		width: 100%;
		background: #FFFFFF;
		position: fixed;
		top:0;
		left: 0;
		z-index: 999;
	}
</style>
