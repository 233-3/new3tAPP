<template>
	<view class="testCenter">
		<view class="status_bar">
			<!-- 状态栏占位 -->
		</view>
		<view class="test-top">
			<view v-if="thisSt.dttg">
				{{dx[thisSt.dtth-1]}}、
				{{thisSt.dttg}}
			</view>
			<!-- <view>
				<img src="@/static/sz.png" alt="" style="width: 100%;height: 100%;">
			</view> -->
		</view>
		<view class="test-center-box"  >
			<!-- 选择题 -->
				<view v-if="thisSt.txid == 1">
					<view  style="width: 100%;height: 360px;overflow-y: auto;">
						<view class="tg">
							{{`${this.index+1}、`}}
							<view v-html="stInfo"></view>
						</view>
						<view class="xx">
							<view v-for="(item, i) in stxx" :key="i" :class="{active:myDaan[index] == item.key,actives:inde == i}" v-html="item.value" @tap="xzxx(item.key,i)"></view>
						</view>
					</view>
				</view>
		
			
			<!-- 听力 -->
				<view v-if="thisSt.txid == 8">
					<view  style="width: 100%;height: 360px;overflow-y: auto;">
						{{`${this.index+1}、`}}
						<audio style="text-align: left" poster="../../static/sz.png" :name="thisSt.zsdmc" :src="tldz" controls></audio>
						<view class="tg" style="margin-top: 10px;">
							<view v-html="stInfo"></view>
						</view>
						<view class="xx">
							<view v-for="(item, i) in stxx" :key="i" :class="{active:myDaan[index] == item.key,actives:inde == i}" v-html="item.value" @tap="xzxx(item.key,i)"></view>
						</view>
					</view>
				</view>
			<!-- 阅读理解 -->
			<view v-if="thisSt.txid == 10">
				<view style="width: 100%;height: 360px;overflow-y: auto;">
					<view class="tg">
						<view v-html="thisSt.ydtg"></view>
						<u-line  color="#000" margin="20px 0"></u-line>
						{{`${this.index+1}、`}}
						<view v-html="stInfo"></view>
					</view>
					<view class="xx">
						<view v-for="(item, i) in stxx" :key="i" :class="{active:myDaan[index] == item.key,actives:inde == i}" v-html="item.value" @tap="xzxx(item.key,i)"></view>
					</view>
				</view>
			</view>

			
			<!-- 填空题 -->
			<view v-if="thisSt.txid == 2 || thisSt.txid == 9">
				<view  style="width: 100%;height: 360px;overflow-y: auto;">
					{{`${this.index+1}、`}}
					<view class="tg">
						<view v-html="stInfo"></view>
					</view>
				</view>
			</view>
			
			<!-- 英汉互译 -->
			<view v-if="thisSt.txid == 3">
				<view  style="width: 100%;height: 360px;overflow-y: auto;">
					{{`${this.index+1}、`}}
					<view class="tg">
						<view v-html="stInfo"></view>
						<textarea  placeholder="" v-model="yhhy"  style="background: #FFFFFF;border: 1px solid black;border-radius: 7px;margin-top: 20px;"/>
						<view class="zwpfBox" v-if="pfShow">
							<view :class="{pfAc:subInfo[index].pfShow == 0}" @tap="pf(0)">0分</view>
							<view :class="{pfAc:subInfo[index].pfShow == 1}" @tap="pf(1)">25%</view>
							<view :class="{pfAc:subInfo[index].pfShow == 2}" @tap="pf(2)">50%</view>
							<view :class="{pfAc:subInfo[index].pfShow == 3}" @tap="pf(3)">75%</view>
							<view :class="{pfAc:subInfo[index].pfShow == 4}" @tap="pf(4)">满分</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 主观题 -->
			<view v-if="thisSt.txid == 7">
				<view  style="width: 100%;height: 360px;overflow-y: auto;">
					{{`${this.index+1}、`}}
					<view class="tg">
						<view v-html="stInfo"></view>
						<u-upload action="https://stuapp.zzxiaoyi.com/muiUpload" 
							max-count="1"
							@on-success="upImg"
							upload-text="上传答案"
							ref="uUpload"
							>
						</u-upload>
						<u-image  width="100%" height="auto" mode="widthFix"  v-if="subInfo[index]" :src="subInfo[index].myDaan"></u-image>
						<image :src="imgSrc" v-else mode="widthFix" style="width:100% ;"></image>
						<view class="zwpfBox" v-if="pfShow">
							<view :class="{pfAc:subInfo[index].pfShow == 0}" @tap="pf(0)">0分</view>
							<view :class="{pfAc:subInfo[index].pfShow == 1}" @tap="pf(1)">25%</view>
							<view :class="{pfAc:subInfo[index].pfShow == 2}" @tap="pf(2)">50%</view>
							<view :class="{pfAc:subInfo[index].pfShow == 3}" @tap="pf(3)">75%</view>
							<view :class="{pfAc:subInfo[index].pfShow == 4}" @tap="pf(4)">满分</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 连词成句 -->
			<view v-if="thisSt.txid == 4">
				<view  style="width: 100%;height: 360px;overflow-y: auto;">
					{{`${this.index+1}、`}}
					<view class="tg">
						<view v-for="(item,i) in stInfo" :key="i" :class="{lccjAc:lccjIndex[i] == i,lccj}" @tap="pushLccj(item,i)">{{item}}</view>
						<view @tap="clearLccj" style="display: inline-block;margin: 5px;background: white;border: 1px solid red;border-radius: 7px;padding: 5px 8px;">清空</view>
						<p class="lccjinput">{{lccj.join(' ')}}</p>
					</view>
				</view>
			</view>
			
			<!-- 完形填空 -->
			<view v-if="thisSt.txid == 6">
				<view  style="width: 100%;height: 360px;overflow-y: auto;">
					{{`${this.index+1}、`}}
					<view class="tg">
						<view></view>
						<view v-html="stInfo"></view>
					</view>
				</view>
			</view>
			<u-select v-model="show" :list="wxtkdq" value-name="value" label-name="value" @confirm="confirm"></u-select>
			
			<!-- 补全对话 -->
			<view v-if="thisSt.txid == 5">
				<view  style="width: 100%;height: 360px;overflow-y: auto;">
					{{`${this.index+1}、`}}
					<view class="tg">
						<view v-html="stInfo"></view>
					</view>
				</view>
			</view>
			<u-select v-model="shows" :list="bqdh" value-name="value" label-name="value"  @confirm="bqdhConfirm"></u-select>
						
		</view>
		<view class="test-bottom-box">
			<button type="default" @tap="upper()">上一题</button>
			<button type="default" v-if="!isLast" @tap="next()">下一题</button>
			<button type="default" v-if="isLast" @tap="submitInfo()">提交</button>
		</view>
		<!-- <button type="default" class="lastSubmit" <s></s>tyle="margin-top: 15px;" v-if="lastSubmit" @tap="submitInfo()">提交</button> -->
		<u-top-tips ref="uTips" navbar-height="44"></u-top-tips>
		<u-modal v-model="mtkShow" :content="content" :show-cancel-button="true"  @confirm="submit"></u-modal>

		<!-- ~~~~~~~~~~~~~~~~~分隔线~~~~~~~~~~~~~~~~~~~~~~ -->
		
		<view class="fixed-box" v-if="resetShow">
			<view class="status-wrapper">
				<view v-for="(item,i) in title" :key="i">
					<h2>{{item}}</h2>
					<view class="st-list-box" v-for="(items, j) in subInfo" :key="j">
						<view @tap="goThisSt(j)" :class="{'ac-box':items.zdStatus == 1,
									   'no-box':items.zdStatus == 0,
									   'py-box':items.zdStatus == 3}"
								v-if="items.dttg == item">{{j+1}}</view>
					</view>
				</view>

				<u-line border-style="dashed"/>
				
				<view class="desc-box">
					<view>
						<view></view>
						已做答
					</view>
					<view>
						<view></view>
						未做答
					</view>
					<view>
						<view></view>
						已批阅
					</view>
					<view>
						<view></view>
						未批阅
					</view>
				</view>
				<button type="default" class="bottom-btn" @tap="mtkShow = true">生成报告</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sjid:'',
				testinfo:'',
				index:0, //当前试题下标
				thisSt:{}, //当前试题
				stInfo:'' ,//当前试题题干
				stxx:'', //当前试题选项
				stDaan:'', //当前试题答案
				myDaan:[], //我的答案
				isLast:false,//是否为最后一题
				subInfo:[], //我的作答信息
				sfzd:false, //是否作答
				inde:null,
				yhhy:'', //英汉互译
				lccj:[], //连词成句
				lccjIndex:[],
				wxtkxx:[], //完形填空选项全部数据
				wxtkdq:[],//完形填空选项当前选项数据
				mywxtk:[],//完形填空我的数据
				wxtkIndex:'',//完形填空下标
				show:false, //完形填空选项展示
				bqdh:[], //补全对话数据
				mybqdh:[], //补全对话我的数据
				bqdhIndex:'', //补全对话下标
				shows:false,//补全对话选项显示
				resetShow:false, //显示自我纠错页面
				title:[], //题目
				pfShow:false, //自我评分
				lastSubmit:false,
				num:0,//总分
				starDate:'', //开始答题时间
				mtkShow:false, //模态框
				content:'确认要提交吗？',
				tldz:'',//听力地址
				dx: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'],
				imgSrc:'',
			}
		},
		onLoad(obj) {
			this.sjid = obj.sjid
			this.starDate = new Date().valueOf()
			if(this.sjid){
				this.getSJInfo()
			}
		},
		watch:{
			index(){
				//监听当前试题索引是否为最后一题
				if(this.index === this.testinfo.length-1){
					this.isLast = true
				}
				if(this.index != this.testinfo.length-1){
					this.isLast = false
				}
			}
		},
		methods: {
			upImg(data){
				console.log(data)
				this.imgSrc = data
				console.log(this.imgSrc)
				if(this.subInfo[this.index]){
					this.$nextTick(()=>{
						this.subInfo[this.index].myDaan = this.imgSrc
						// this.$set(this.subInfo[this.index],'myDaan',this.imgSrc)
					})
				}
			},
			//获取试题信息
			getSJInfo(){
				this.$u.post('api/ASJController/querySJNR',{
					sjid:this.sjid
				}).then(res=>{
					this.testinfo = res
					// console.log('试题',this.testinfo)
					this.getThisSt()
				})
			},
			//处理当前试题
			getThisSt(){
				this.thisSt = this.testinfo[this.index]
				//选择题———阅读理解
				if(this.thisSt.txid == 1 || this.thisSt.txid == 10){
					this.stInfo = this.thisSt.xttg  //获取题干
					this.stxx = JSON.parse(this.thisSt.xx) //获取选择题选项
					this.stDaan = this.thisSt.zqda  //获取选择题答案
					return
				}
				//填空题~~首字母填空
				if(this.thisSt.txid == 2 || this.thisSt.txid == 9){
					let reg1 = /@_@/g
					if(reg1.exec(this.thisSt.xttg)){
						this.stInfo = this.thisSt.xttg.replace(/@_@/g,
							`<input type="text" class="tk1"  style="border: none;background: transparent;border-bottom: 1px solid #666;width: 70px;margin: 10px;" />`
						);
						setTimeout(()=>{
							var inputs = document.getElementsByClassName('tk1')
							if(this.myDaan[this.index]){
								for (let i = 0; i<=inputs.length - 1; i++) {
									inputs[i].value = this.myDaan[this.index][i]
								}
							}							
						},0)
						this.stDaan = this.thisSt.zqda.split('@&@')  //获取答案
						return 
					}
					let reg2 = /@___@/g
					if(reg2.exec(this.thisSt.xttg)){
						// console.log('长')
						this.stInfo = this.thisSt.xttg.replace(/@___@/g,
									`<input type="text" class="tk1" style="	border: none;background: transparent;border-bottom: 1px solid #666;width: 100px;margin: 10px;"name="tk" />`)
						setTimeout(()=>{
							var inputs = document.getElementsByClassName('tk1')
							if(this.myDaan[this.index]){
								for (let i = 0; i<=inputs.length - 1; i++) {
									inputs[i].value = this.myDaan[this.index][i]
								}
							}
						},0)
						this.stDaan = this.thisSt.zqda.split('@&@')  //获取答案
						return 
					}
					let reg3 = /@__@/g
					if(reg3.exec(this.thisSt.xttg)){
						this.stInfo = this.thisSt.xttg.replace(/@__@/g,
							`
							<span style="width: 40px; height: 90px; display: inline-block; font-size: 0;vertical-align: middle;margin-left: 10px;"> 
								<input type="text" name="fenshi" class="tk1" style="text-align: center; font-size: 15px; color: #222; margin: 0; padding: 0; width: 40px; height: 25px; display: block;"     background: #fff;border: 1px solid #424242; border-radius: 5px;/>
								<span style="display: block; width: 40px; height: 1px; background: #41b0ff; margin: 10px 0;"></span>
								<input type="text" name="fenshi" class="tk1" style="text-align: center; font-size: 15px; color: #222; margin: 0; padding: 0; width: 40px; height: 25px; display: block;"     background: #fff; border: 1px solid #424242; border-radius: 5px;/>
							</span>
							`
						)
						setTimeout(()=>{
							var inputs = document.getElementsByClassName('tk1')
							if(this.myDaan[this.index]){
								for (let i = 0; i<=inputs.length - 1; i++) {
									inputs[i].value = this.myDaan[this.index][i]
								}
							}
						},0)
						this.stDaan = this.thisSt.zqda.split('@&@')[0].split('/')  //获取答案
						return 
					}
				}
				//解答题
				if(this.thisSt.txid == 7){
					this.stInfo = this.thisSt.xttg  //获取题干
					this.stDaan = this.thisSt.zqda  //获取答案
					return
				}
				//听力题
				if(this.thisSt.txid == 8){
					this.stInfo = this.thisSt.xttg  //获取题干
					this.stxx = JSON.parse(this.thisSt.xx) //获取选择题选项
					this.stDaan = this.thisSt.zqda  //获取选择题答案
					// console.log(this.thisSt)
					if(this.thisSt.tldz){
						this.tldz = this.thisSt.tldz
					}
					return
				}
				//英汉互译
				if(this.thisSt.txid == 3){
					if(this.myDaan[this.index]){
						this.yhhy = this.myDaan[this.index]
					}
					this.stInfo = this.thisSt.xttg  //获取题干
					this.stDaan = this.thisSt.zqda  //获取选择题答案
					return
				}
				//连词成句
				if(this.thisSt.txid == 4){
					if(this.myDaan[this.index]){
						this.lccj =  this.myDaan[this.index]
						this.lccjIndex = this.subInfo[this.index].lccjIndex
					}
					this.stInfo = this.thisSt.xcx.split('@*@')  //获取题干
					this.stDaan = this.thisSt.zqda  //获取答案
					console.log(this.stInfo)
					return
				}
				//完形填空
				if(this.thisSt.txid == 6){
					this.stInfo = this.thisSt.xttg.replace(/@S@/g,
						`<span class="wxtkxx" style="display: inline-block; border-bottom: 1px solid #000; margin: 0 7px; padding-right: 25px; min-width: 55px; height: 25px; line-height: 25px; font-size: 15px; vertical-align: middle;"></span>`
					)  //获取题干
					
					//如果我的答案里有值得话，直接赋值
					setTimeout(()=>{
						if(this.myDaan[this.index]){
							this.mywxtk = this.myDaan[this.index]
							for(let i=0; i<=this.mywxtk.length-1;i++){
								if(this.mywxtk[i]){
									console.log(document.getElementsByClassName('wxtkxx')[i])
									document.getElementsByClassName('wxtkxx')[i].innerText = this.mywxtk[i]
								}
							}
						}
					},10)
					// * #
					let arr = this.thisSt.xcx.split('@#@')
					arr.forEach((val,index)=>{
						arr[index] = val.split('@*@')
					})
					// console.log(arr)
					this.wxtkxx = arr
					this.$nextTick(()=>{
						let wxtkxx = document.getElementsByClassName('wxtkxx')
						// console.log(wxtkxx)
						for(let i=0; i<=wxtkxx.length-1;i++){
							wxtkxx[i].addEventListener('click',()=>{
								this.selectWXTK(i)
							})
						}
					})
					this.stDaan = this.thisSt.zqda.split('@&@')  //获取选择题答案
				}
				//补全对话
				if(this.thisSt.txid == 5){
					this.stInfo = this.thisSt.xttg.replace(/@S@/g,
						`<span class="wxtkxx" style="display: inline-block; border-bottom: 1px solid #000; margin: 0 7px; padding-right: 25px; min-width: 55px; height: 25px; line-height: 25px; font-size: 15px; vertical-align: middle;"></span>`
					)  //获取题干
					
					setTimeout(()=>{
						if(this.myDaan[this.index]){
							this.mybqdh = this.myDaan[this.index]
							for(let i=0; i<=this.mybqdh.length-1;i++){
								if(this.mybqdh[i]){
									console.log(document.getElementsByClassName('wxtkxx')[i])
									document.getElementsByClassName('wxtkxx')[i].innerText = this.mybqdh[i]
								}
							}
						}
					},10)
					
					let arr = this.thisSt.xcx.split('@*@')
					arr.forEach((val, index)=>{
						let obj = {
							value: val
						}
						arr[index] = obj
					})
					this.bqdh = arr
					this.$nextTick(()=>{
						let bqdhxx = document.getElementsByClassName('wxtkxx')
						for(let i=0; i<=bqdhxx.length-1;i++){
							bqdhxx[i].addEventListener('click',()=>{
								this.selectBQDH(i)
							})
						}
					})
					this.stDaan = this.thisSt.zqda.split('@&@')  //获取选择题答案
				}

			},
			//选择选择选项
			xzxx(key,i){
				this.$nextTick(function(){
					this.myDaan[this.index] = key
					this.inde = i
				})
			},
			//评分
			pf(val){
				// 0 - 0分
				// 1 - 25%
				// 2 - 50%
				// 3 - 75%
				// 4 - 100% 满分
				let xtfs = this.subInfo[this.index].xtfs
				let wddf = val/xtfs
				this.pfShow = false
				this.$set(this.subInfo[this.index],'pfShow',val)
				this.$set(this.subInfo[this.index],'wddf',wddf)
				this.$set(this.subInfo[this.index],'zdStatus',3)
				this.$nextTick(function(){
					this.pfShow = true
				})
				
				console.log(val,this.index,wddf,this.subInfo[this.index])
			},
			//回到当前小题
			goThisSt(j){
				console.log(j)
				this.index = j
				this.getThisSt()
				this.resetShow = false
				this.lastSubmit = true
			},
			//补全对话选项
			selectBQDH(i){
				this.bqdhIndex = i
				this.shows = true
			},
			bqdhConfirm(e){
				this.mybqdh[this.bqdhIndex] = e[0].value
				document.getElementsByClassName('wxtkxx')[this.bqdhIndex].innerText = e[0].value
			},
			// 选中select
			confirm(e){
				this.mywxtk[this.wxtkIndex] = e[0].value
				document.getElementsByClassName('wxtkxx')[this.wxtkIndex].innerText = e[0].value
			},
			//处理当前选中的select
			selectWXTK(i){
				this.wxtkIndex = i
				this.show = true
				this.wxtkdq = []
				console.log(this.wxtkxx[i])
				this.wxtkxx[i].forEach((val, index)=>{
					let obj = {
						value: val
					}
					this.wxtkdq.push(obj)
				})
			},
			//push连词成句答案
			pushLccj(item, i){
				if(this.lccjIndex[i] == i){
					return false
				}
				this.lccjIndex[i] = i
				this.lccj.push(item)
				console.log(i, this.lccjIndex)
			},
			//清除连词成句答案
			clearLccj(){
				this.lccjIndex = []
				this.lccj = []
			},
			//设置答案
			setData(){
				let obj = {}
				// console.log(this.myDaan)
				//选择题
				if(this.thisSt.txid == 1 || this.thisSt.txid == 10 || this.thisSt.txid == 8){
					this.inde = null
					obj.myDaan = this.myDaan[this.index] || ''
					if(obj.myDaan == ''){
						this.myDaan[this.index] = ''
					}
					if(obj.myDaan == '' || !obj.myDaan){
						obj.zdStatus = 0
					} else {
						obj.zdStatus = 1
					}
					obj.dajx = this.thisSt.dajx
					obj.zqda = this.thisSt.zqda
					obj.zsdmc = this.thisSt.zsdmc
					obj.xtfs = this.thisSt.xtfs
					obj.dttg = this.thisSt.dttg
					obj.xtth = this.thisSt.xtth   //设置题号
					obj.th = this.index+1   //设置题号
					obj.txid = this.thisSt.txid  //设置题型id
					obj.nyd = this.thisSt.ynd    //难易度
					obj.zsdid = this.thisSt.zsdid //知识点id
					this.subInfo[this.index] = obj
				}
				//填空题
				if(this.thisSt.txid == 2 || this.thisSt.txid == 9){
					let input = document.getElementsByClassName('tk1')
					this.myDaan[this.index] = []
					for(var i=0; i<=input.length-1;i++){
						this.myDaan[this.index].push(input[i].value)
					}
					
					obj.myDaan = this.myDaan[this.index] || ''
					if(obj.myDaan == '' || obj.myDaan.length < 0){
						obj.zdStatus = 0
					} else {
						if(obj.myDaan.length > 0){
							for(var i = 0; i<=obj.myDaan.length-1; i++){
								obj.myDaan[i] == '' ? obj.zdStatus = 0 : obj.zdStatus = 1
							}
						}
						//  else {
						// 	obj.zdStatus = 1
						// }
					}
					obj.dajx = this.thisSt.dajx   //答案解析
					obj.zqda = this.stDaan  //设置当前题答案
					obj.zsdmc = this.thisSt.zsdmc   //设置当前题知识点
					obj.xtfs = this.thisSt.xtfs    //设置当前题的分数
					obj.dttg = this.thisSt.dttg   //设置当前题题干
					obj.xtth = this.thisSt.xtth   //设置题号
					obj.th = this.index+1   //设置题号
					obj.txid = this.thisSt.txid  //设置题型id
					obj.nyd = this.thisSt.ynd    //难易度
					obj.zsdid = this.thisSt.zsdid //知识点id
					this.subInfo[this.index] = obj
				}
				if(this.thisSt.txid == 7){
					// 主管题
					if(this.subInfo[this.index]){
						obj.zdStatus = 3
						obj.myDaan =  this.subInfo[this.index].myDaan
						return false
					}else{
						obj.zdStatus = 2
						obj.myDaan = this.imgSrc
					}
					
					obj.dajx = this.thisSt.dajx
					obj.zqda = this.thisSt.zqda
					obj.zsdmc = this.thisSt.zsdmc
					obj.xtfs = this.thisSt.xtfs
					obj.dttg = this.thisSt.dttg
					obj.xtth = this.thisSt.xtth   //设置题号
					obj.th = this.index+1   //设置题号
					obj.txid = this.thisSt.txid  //设置题型id
					obj.nyd = this.thisSt.ynd    //难易度
					obj.zsdid = this.thisSt.zsdid //知识点id
					this.subInfo[this.index] = obj
					this.imgSrc = ''
				}
				//英汉互译
				if(this.thisSt.txid == 3){
					obj.myDaan = this.yhhy
					this.myDaan[this.index] = this.yhhy
					
					// 主管题
					if(this.subInfo[this.index]){
						obj.zdStatus = 3
						this.yhhy = ''
						return false
					}else{
						obj.zdStatus = 2
					}

					obj.dajx = this.thisSt.dajx
					obj.zqda = this.thisSt.zqda
					obj.zsdmc = this.thisSt.zsdmc
					obj.xtfs = this.thisSt.xtfs
					obj.dttg = this.thisSt.dttg
					obj.xtth = this.thisSt.xtth   //设置题号
					obj.th = this.index+1   //设置题号
					obj.txid = this.thisSt.txid  //设置题型id
					obj.nyd = this.thisSt.ynd    //难易度
					obj.zsdid = this.thisSt.zsdid //知识点id
					this.subInfo[this.index] = obj
					this.yhhy = ''
				}
				//连词成句
				if(this.thisSt.txid == 4){
					obj.myDaan = this.lccj
					this.myDaan[this.index] = this.lccj
					
					if(obj.myDaan == '' || obj.myDaan.length <= 0){
						obj.zdStatus = 0 //未做答
					} else {
						obj.zdStatus = 1 //已做答
					}
					obj.lccjIndex = this.lccjIndex
					obj.dajx = this.thisSt.dajx
					obj.zqda = this.thisSt.zqda
					obj.zsdmc = this.thisSt.zsdmc
					obj.xtfs = this.thisSt.xtfs
					obj.dttg = this.thisSt.dttg
					obj.xtth = this.thisSt.xtth   //设置题号
					obj.th = this.index+1   //设置题号
					obj.txid = this.thisSt.txid  //设置题型id
					obj.nyd = this.thisSt.ynd    //难易度
					obj.zsdid = this.thisSt.zsdid //知识点id
					this.subInfo[this.index] = obj
					this.lccj = []
					this.lccjIndex = []
				}
				//完形填空
				if(this.thisSt.txid == 6){
					obj.myDaan = this.mywxtk
					this.myDaan[this.index] = this.mywxtk
					
					if(obj.myDaan == '' || obj.myDaan.length <= 0){
						obj.zdStatus = 0 //未做答
					} else {
						obj.zdStatus = 1 //已做答
					}
					obj.dajx = this.thisSt.dajx
					obj.zqda = this.thisSt.zqda.split('@&@')
					obj.zsdmc = this.thisSt.zsdmc
					obj.xtfs = this.thisSt.xtfs
					obj.dttg = this.thisSt.dttg
					obj.xtth = this.thisSt.xtth   //设置题号
					obj.th = this.index+1   //设置题号
					obj.txid = this.thisSt.txid  //设置题型id
					obj.nyd = this.thisSt.ynd    //难易度
					obj.zsdid = this.thisSt.zsdid //知识点id
					this.subInfo[this.index] = obj
					this.wxtkxx = [] //完形填空选项全部数据
					this.wxtkdq = []//完形填空选项当前选项数据
					this.mywxtk = []//完形填空我的数据
					this.wxtkIndex = ''//完形填空下标
				}
				//补全对话
				if(this.thisSt.txid == 5){
					obj.myDaan = this.mybqdh
					this.myDaan[this.index] = this.mybqdh
					if(obj.myDaan == '' || obj.myDaan.length <= 0){
						obj.zdStatus = 0 //未做答
					} else {
						obj.zdStatus = 1 //已做答
					}
					obj.dajx = this.thisSt.dajx
					obj.zqda = this.thisSt.zqda.split('@&@')
					obj.zsdmc = this.thisSt.zsdmc
					obj.xtfs = this.thisSt.xtfs
					obj.dttg = this.thisSt.dttg
					obj.xtth = this.thisSt.xtth   //设置题号
					obj.th = this.index+1   //设置题号
					obj.txid = this.thisSt.txid  //设置题型id
					obj.nyd = this.thisSt.ynd    //难易度
					obj.zsdid = this.thisSt.zsdid //知识点id
					this.subInfo[this.index] = obj
					this.bqdh = []  //清空补全对话数据
					this.mybqdh = [] //清空我的数据
					this.wxtkIndex = '' //清空下标
				}
			},
			//上一题
			upper(){
				if(this.index == 0){
					this.$refs.uTips.show({
						title: '当前已经是第一题',
						type: 'error',
						duration: '2300'
					})
					return
				}
				this.index--
				this.getThisSt()
			},
			// 下一题
			next(){
				this.setData()
				this.index++
				this.getThisSt()
			},
			//提交信息
			submitInfo(){
				this.setData()
				let arr = []
				this.subInfo.forEach(val=>{
					arr.push(val.dttg)
				})
				this.title = [...new Set(arr)]
				//显示纠错页
				this.resetShow = true
				//显示评分部分
				this.pfShow = true
			},
			toHHmmss(data) {
			        var s;
			        var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			        var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
			        var seconds = (data % (1000 * 60)) / 1000;
			        s = (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
			        return s;
			},
			submit(){
				let endDate = new Date().valueOf()
				// let date = this.toHHmmss(endDate - this.starDate)
				let date = (endDate - this.starDate)/1000
				for(var i = 0; i <= this.subInfo.length-1;i++){
					if(this.subInfo[i].zdStatus == 2){
						this.$refs.uTips.show({
							title: '请先批阅后在提交',
							type: 'error',
							duration: '1000'
						})
						return false
					}
				}
				// 1 易 2 中 3难
				let nyd = []
				let zf = 0
				this.subInfo.forEach(val=>{
					zf += val.xtfs
					nyd.push(val.nyd)
					// 选择题
					if(val.txid == 8 || val.txid == 10 || val.txid == 1){
						if(val.myDaan == val.zqda){
							this.num += val.xtfs
							this.$set(val,'sfzq',1) //1对 0错 2半对
							this.$set(val,'wddf', val.xtfs) //我的得分
						}else{
							this.$set(val,'sfzq',0) //1对 0错 2半对
							this.$set(val,'wddf', 0) //我的得分
						}
					}
					// 主观题
					if(val.txid == 3 || val.txid == 7){
						this.num += val.wddf
						this.$set(val,'wddf', val.wddf) //我的得分
						if(val.wddf == 0){
							this.$set(val,'sfzq',0) //1对 0错 2半对
						} else if(val.wddf == val.xtfs){
							this.$set(val,'sfzq',1) //1对 0错 2半对
						} else {
							this.$set(val,'sfzq',2) //1对 0错 2半对
						}
					}
					// 填空题
					if(val.txid == 2){
						let dqfs = 0
						for(var i=0; i<=val.myDaan.length-1; i++){
							if(val.myDaan[i] == val.zqda[i]){
								this.num += val.xtfs/val.zqda.length
								dqfs += val.xtfs/val.zqda.length
							}
						}
						if(dqfs == val.xtfs){
							this.$set(val,'sfzq',1) //1对 0错 2半对
						} else if(dqfs == 0){
							this.$set(val,'sfzq',0) //1对 0错 2半对
						} else {
							this.$set(val,'sfzq',2) //1对 0错 2半对
						}
						this.$set(val,'wddf', dqfs) //我的得分
					}
					// 连词成句
					if(val.txid == 4){
						console.log(val.myDaan,val.zqda)
						let zqda = val.zqda.split(' ').join('')
						let wdda = val.myDaan.join('')
						console.log(zqda.toUpperCase().replace(/\s+/g, ''),wdda.toUpperCase().replace(/\s+/g, ''))
						if(zqda.toUpperCase().replace(/\s+/g, '') == wdda.toUpperCase().replace(/\s+/g, '')){
							this.num += val.xtfs
							this.$set(val,'sfzq',1) //1对 0错 2半对
							this.$set(val,'wddf', val.xtfs) //我的得分
						} else {
							this.$set(val,'sfzq',0) //1对 0错 2半对
							this.$set(val,'wddf', 0) //我的得分
						}
					}
					// 首字母填空
					if(val.txid == 9){
						let dqfs = 0
						for(var i=0; i<=val.myDaan.length-1; i++){
							let zqda = val.zqda[i].substring(1)
							console.log(val.myDaan[i],zqda)
							if(val.myDaan[i] == zqda){
								this.num += val.xtfs/val.zqda.length
								dqfs += val.xtfs/val.zqda.length
							}
						}
						if(dqfs == val.xtfs){
							this.$set(val,'sfzq',1) //1对 0错 2半对
						} else if(dqfs == 0){
							this.$set(val,'sfzq',0) //1对 0错 2半对
						} else {
							this.$set(val,'sfzq',2) //1对 0错 2半对
						}
						this.$set(val,'wddf', dqfs) //我的得分
					}
					// 完形填空 补全对话
					if(val.txid == 6 || val.txid == 5){
						let dqfs = 0
						if(val.myDaan.length == 0){
							this.num += 0
						} else {
							for (var i = 0; i<= val.myDaan.length-1; i++) {
								if(!val.myDaan[i]){
									this.num+=0
								}else{
									let zqda = val.myDaan[i].split('.')[0]
									console.log(zqda)
									if(zqda == val.zqda[i]){
										this.num += val.xtfs/val.zqda.length
										dqfs += val.xtfs/val.zqda.length
									}
								}
							}
						}
						if(dqfs == val.xtfs){
							this.$set(val,'sfzq',1) //1对 0错 2半对
						} else if(dqfs == 0){
							this.$set(val,'sfzq',0) //1对 0错 2半对
						} else {
							this.$set(val,'sfzq',2) //1对 0错 2半对
						}
						this.$set(val,'wddf', dqfs) //我的得分
					}
				})
				
				let nydArr = [
					{
						data:0,
						name:'易'
					},
					{
						data:0,
						name:'中'
					},
					{
						data:0,
						name:'难'
					}
				]
				//处理难易度相关数据
				console.log(nyd)
				nyd.forEach(val=>{
					console.log(val)
					if(val == 1){
						nydArr[0].data+=1
					}
					if(val == 2){
						nydArr[1].data+=1
					}
					if(val == 3){
						nydArr[2].data+=1
					}
				})
				let zsdArr = []
				//处理知识点数据
				this.subInfo.forEach((val,index)=>{
					let zsdIds = val.zsdid.split(',')
					let zsdMcs = val.zsdmc.split(',')
					zsdIds.pop()
					zsdMcs.pop()
					for(var i=0; i<=zsdIds.length-1; i++){
						let obj = {
							zsdzf:0,
							zsdwddf:0,
							zsdth:''
						}
						obj.zsdid = zsdIds[i]
						obj.zsdmc = zsdMcs[i]
						zsdArr.push(obj)
					}
				})
				zsdArr = this.deteleObject(zsdArr)
				console.log('全部数据',this.subInfo)
				console.log('时间',date)
				console.log('难易度',nydArr)
				console.log('得分',this.num)
				console.log('总分',zf)
				let param5 = this.setZSDList(zsdArr)
				let param4 = this.subInfo
				let param3 = {
					xqsjid:this.sjid,
					xsdf:this.num,
					sjzf:zf,
					zdys:Math.floor(date),
					nyd:nydArr
				}
				// this.$u.post('/RMC/SRMCAnsController/addRMCXQ',{
				// 	param3:JSON.stringify(param3),
				// 	param4:JSON.stringify(param4),
				// 	param5:param5
				// }).then(res=>{
				// 	// console.log(res)
				// 	this.$u.route({
				// 		url:'pages/index/submitInfo',
				// 		params:{
				// 			id:res.id
				// 		}
				// 	})
				// })
			},
			setZSDList(zsdArr){
				for(var i = 0; i<=zsdArr.length-1;i++){
					this.subInfo.forEach(val=>{
						if(val.zsdid.indexOf(zsdArr[i].zsdid) != -1){
							zsdArr[i].zsdzf += val.xtfs
							zsdArr[i].zsdwddf += val.wddf
							zsdArr[i].zsdth += `${val.th}、`
						}
					})
				}
				return JSON.stringify(zsdArr)
			},
			//对象去去重
			deteleObject(obj) {
			    var uniques = [];
			    var stringify = {};
			    for (var i = 0; i < obj.length; i++) {
			        var keys = Object.keys(obj[i]);
			        keys.sort(function(a, b) {
			            return (Number(a) - Number(b));
			        });
			        var str = '';
			        for (var j = 0; j < keys.length; j++) {
			            str += JSON.stringify(keys[j]);
			            str += JSON.stringify(obj[i][keys[j]]);
			        }
			        if (!stringify.hasOwnProperty(str)) {
			            uniques.push(obj[i]);
			            stringify[str] = true;
			        }
			    }
			    uniques = uniques;
			    return uniques;
			}
		}
	}
</script>

<script module="test" lang="renderjs">
	export default {
		mounted() {
			setTimeout(()=>{
				console.log('试题',this.sjid)
			},5000)
		},
		methods: {
			
		}
	}
</script>



<style scoped lang="scss">
	::v-deep .u-add-wrap{
		width: 70px !important;
		height: 70px !important;
	}
	::v-deep .u-upload{
		justify-content: flex-end;
	}
	page{
		background: url('@/static/icon_topbeijing.png') ;
		background-size: 100% 100%;
		background-position:center;
	}
	uni-button:after {
	    border: none !important;
	}
	.pfAc{
		opacity: .8;
	}
	.zwpfBox{
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		view{
			width: 40px;
			height: 40px;
			line-height: 40px;
			text-align: center;
			background: #fff;
			border: 1px solid #000000;
			border-radius: 50%;
			margin-top: 20px;
		}
	}
	.testCenter{
		padding: 30rpx;
	
	}
	.lccj{
		display: inline-block;
		margin: 5px;
		background: rgb(255, 255, 255);
		border: 1px solid black;
		border-radius: 7px;
		padding: 5px 8px;
	}
	.lccjinput{
		border-bottom: 1px solid #000000;
		margin-top: 30px;
	}
	.lccjAc{
		opacity: .8;
	}
	.test-top{
		display: flex;
		justify-content: space-around;
		view{
			&:nth-child(1){
				/* height: 40px; */
				padding: 5px 20px;
				background: white;
				border: 2px solid #313131;
				text-align: left;
				font-size: 18px;
				// font-weight: 800;
				color: #343434;
				/* white-space: nowrap; */
				width: 100%;
			}
			&:nth-child(2){
				width:140rpx;
				height:140rpx;
				background:rgba(255,255,255,1);
				border:4rpx solid rgba(49,49,49,1);
			}
		}
	}
	.test-center-box{
		height:800rpx;
		background: url('@/static/icon_juxing.png') no-repeat;
		background-size: 100% 100%;
		background-position: center;
		margin-top: 75rpx;
		padding: 30rpx;
		// overflow-y: auto;
		.tg{
			margin-bottom: 25px;
			line-height: 28px;
			
		}
		.xx{
			view{
				margin: 10px 0;
				padding: 5px;
				background:rgba(255,255,255,1);
				border:3rpx solid rgba(0,0,0,1);
				border-radius:15rpx;
			}
		}
		.active,.actives{
			opacity: .8;
			color: #26B9FB !important;
			border: 1px solid #26B9FB !important;
		}
	}
	.test-bottom-box{
		display: flex;
		justify-content: space-around;
		margin-top: 86rpx;
		button{
			width:329rpx;
			height:78rpx;
			line-height: 78rpx;
			background: url('@/static/icon_anniu03.png') no-repeat;
			background-size: 100% 100%;
			background-position: center;
		}
	}
	.lastSubmit{
		width:329rpx;
		height:78rpx;
		line-height: 78rpx;
		background: url('@/static/icon_anniu03.png') no-repeat;
		background-size: 100% 100%;
		background-position: center;
	}
	.fixed-box{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 900;
		background: url('@/static/icon_zdqkbeijing.png') no-repeat;
		background-size: 100% 100%;
		background-position: center;
		padding: 30rpx;
		overflow-y: auto;
		.status-wrapper{
			width: 100%;
			background:rgba(255,255,255,1);
			border-radius:10rpx;
			padding: 40rpx;
			h2{
				font-size:26rpx;
				font-weight:400;
				color:rgba(52,52,52,1);
				margin-bottom: 45rpx;
			}
			.bottom-btn{
				width:350rpx;
				height:65rpx;
				background:rgba(255,210,0,1);
				border-radius:24rpx;
				font-size:30rpx;
				font-family:Source Han Sans CN;
				font-weight:500;
				color:rgba(34,34,34,1);
				line-height:65rpx;
				border: none !important;
			}
			.desc-box{
				display: flex;
				justify-content: space-evenly;
				margin: 80rpx auto;
				view{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size:22rpx;
					font-weight:400;
					color:rgba(102,102,102,1);
					&:nth-child(1){
						view{
							background:rgba(124,186,50,1);
						}
					}
					&:nth-child(2){
						view{
							background:rgba(255,124,90,1);
						}
					}
					&:nth-child(3){
						view{
							background:rgba(138,148,244,1);
						}
					}
					&:nth-child(4){
						view{
							border:1px solid rgba(0,0,0,1);
						}
					}
					view{
						width:19rpx;
						height:19rpx;
						border-radius:50%;
					}
				}
			}
			.st-list-box{
				display: inline-block;
				view{
					width:71rpx;
					height:71rpx;
					text-align: center;
					line-height: 71rpx;
					border-radius:50%;
					margin-right: 40rpx;
					margin-bottom: 30rpx;
					
					border: 1px solid #424242;
				}
				.ac-box{
					background:rgba(124,186,50,1);
					color: #FFFFFF;
					border-color:rgba(124,186,50,1) ;
				}
				.no-box{
					background:rgba(255,124,90,1);
					color: #FFFFFF;
					border-color:rgba(255,124,90,1) ;
				}
				.py-box{
					background:rgba(138,148,244,1);
					color: #FFFFFF;
					border-color:rgba(138,148,244,1) ;
				}
			}
		}
	}
</style>
