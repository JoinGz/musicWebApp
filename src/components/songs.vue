<template id="Song">
	<section class="main">
		<div class="player">
			<div class="disc">
				<img :src="nowsong.photo" alt="李克勤">
				<span class="duration">{{songtime | changTime}}</span>
			</div>
			<h2 class="title">{{nowsong.title}}</h2>
			<h3 class="artist">{{nowsong.artist}}</h3>
			<div class="lyric">
				<p class="previous">" "</p>
				<p class="current">{{lrc[0][1]}}</p>
				<p class="next">{{lrc[1][1]}}</p>
			</div>
			<div class="progressbar">
				<progress value="0" max="100" @click="changtime()"></progress>
				<div class="point" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="touchMove" @touchend.stop.prevent="touchEnd"></div>
			</div>
			<div class="controls">
				<button class="active"><i class="fa fa-volume-up" @click.self="changeShow1"></i>
							<div class="controlVoice" v-show="showx">  <!--if是重新生成，数据会被初始化。show是展示隐藏。-->
								<div class="yuan" @touchstart.stop.prevent = "touchStart" @touchmove.stop.prevent = "touchMove" @touchend.stop.prevent = "touchEnd" ></div>
							</div>
						</button>
				<button class="active" @click="last"><i class="fa fa-backward"></i></button>
				<button class="active" @click="play"><i class="fa fa-play" id = "playi"></i></button>
				<button class="active" @click="next"><i class="fa fa-forward"></i></button>
				<button class="active"><i class="fa fa-random"></i></button>
			</div>

		</div>

		<div class="err yaoactive">没有了</div>

	</section>

</template>

<script>
	import Vue from "vue"
	Vue.filter('changTime', function(a) {
				if(!a) {
					return '00:00'
				}
				//				value = value.toString()
				//返回处理后的值
				var hh = parseInt(a / 3600);
				if(hh < 10) hh = "0" + hh;
				var mm = parseInt((a - hh * 3600) / 60);
				if(mm < 10) mm = "0" + mm;
				var ss = parseInt((a - hh * 3600) % 60);
				if(ss < 10) ss = "0" + ss;
				var length = mm + ":" + ss;
				return length;

			})
	export default {
		template: "#Song",
		data: function() {
			return {
				songtime: 0, //歌曲时间
				gotime: 0, //歌曲已播放时间
				timer: 0, // 歌词，进度条定时器
				startY: 0, //声音开始Y轴位置
				endY: 0, // 声音滑动了多少距离
				moveY: 0, //声音滑动了多少距离
				showx: false, // 控制声音面板的显示
				lrc: [1, 2, 3], //歌词
				songID: 1, // 当前歌曲播放ID
				allsongs: {}, // 所有歌曲数据
				nowsong: "", //现在播放的歌曲
				lrcaddress: "", //歌词地址
				now: "", // 现在播放的歌曲
				pointStartX: 0, //进度条开始的X
				pointEndX: 0,
				pointMoveX: 0,
				routerID: "" // router的ID

			}
		},
		computed: {
			playButton: function() {
				return document.querySelector("audio"); //audio标签
			},
			playi: function() {
				return document.querySelector("#playi"); // i图标
			},
			progress: function() {
				return document.querySelector("progress"); // 进度条
			},
			point: function() {
				return document.querySelector(".point"); // 进度点
			},
			PointWidth: function() {
				return window.screen.availWidth - this.point.offsetWidth;
			}

		},
		watch: {
			'$route' (to, from) {
				this.showx = false;
				clearInterval(this.timer);
				// 对路由变化作出响应...
				if(to.params.id) {
					clearInterval(this.timer);
					var _this = this;
					this.songID = parseInt(to.params.id);
					if(this.songID != this.routerID) {
						clearInterval(this.timer);
						this.nowsong = this.allsongs[this.songID - 1];
						this.playButton.src = this.nowsong.songname;
						this.lrcaddress = this.nowsong.lrc;
						this.getlrc();
					}
					this.now = this.songID - 1;
					this.routerID = this.songID;

					this.timer = setInterval(function() {
						_this.gotime = _this.playButton.currentTime;
						_this.progress.value = Math.round(_this.gotime / _this.songtime * 100);
						_this.point.style.left = _this.PointWidth * _this.progress.value / 100 + "px";
						_this.pointEndX = _this.PointWidth * _this.progress.value / 100;
						console.log(11)
						if(_this.progress.value == 100) {
							_this.playi.className = "fa fa-play";
							_this.next();
							clearInterval(_this.timer);
						}
					}, 1000)

				}

			}
		},
		methods: {
			play: function() {
				var _that = this;

				if(this.playButton.paused) {

					this.thingPlay();
				} else {

					this.thingPause();
				}

			},

			changeShow1: function() { // 控制调节音量的显示按钮

				this.showx = !this.showx;
			},
			touchStart: function(ev) {
				var voice = document.querySelector(".yuan");
				if(ev.target == voice) {
					if(ev.touches.length == 1) {
						this.startY = ev.touches[0].clientY; // 记录开始位置
					}

				} else {
					this.playButton.pause();
					this.playi.className = "fa fa-play";
					clearInterval(this.timer)
					if(ev.touches.length == 1) { //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
						this.pointStartX = ev.touches[0].clientX; // 记录开始位置
					}
				}

			},
			touchMove: function(ev) {
				var voice = document.querySelector(".yuan");

				if(ev.target == voice) {
					var yuan = document.querySelector(".yuan");
					this.moveY = ev.touches[0].clientY - this.startY + this.endY;
					yuan.style.top = this.moveY + "px";
					if(this.moveY > 100) {
						yuan.style.top = "100px";
						this.moveY = 100;
					} else if(this.moveY < 0) {
						yuan.style.top = "0px";
						this.moveY = 0
					}
					this.playButton.volume = 1 - this.moveY / 100;
				} else {
					this.pointMoveX = ev.touches[0].clientX - this.pointStartX + this.pointEndX;
					this.point.style.left = this.pointMoveX + "px";
					var length = this.pointMoveX / this.PointWidth;
					if(this.pointMoveX > this.PointWidth) {
						this.point.style.left = this.PointWidth + "px";
						this.pointMoveX = this.PointWidth;
					} else if(this.pointMoveX < 0) {
						this.point.style.left = "0px";
						this.pointMoveX = 0
					}
					this.playButton.currentTime = length * this.songtime;
					this.progress.value = this.playButton.currentTime / this.songtime * 100;
					// console.log("end:"+this.pointEndX);

				}

			},
			touchEnd: function(ev) {
				var voice = document.querySelector(".yuan");
				if(ev.target == voice) {
					this.endY = this.moveY
				} else {

					this.thingPlay();

					this.pointEndX = this.pointMoveX;
				}

			},

			getlrc: function() {
				var _this = this;

				this.$http.get(this.lrcaddress).then(function(res) {
					var lrctxt = res.data; //获取歌词
					var lrc = lrctxt.split("\n"); // 歌词一行一个数据放入数组
					//console.log(lrc)
					var pattern = /\[\d{2}\:\d{2}\.\d{2}\]/g; //匹配时间的正则
					var result = []; // 结果存放
					while(!pattern.test(lrc[0])) { // 歌词开头有不是歌词的删除掉，得到纯净歌词文件
						lrc = lrc.slice(1)
					}
					lrc[lrc.length - 1].length === 0 ? lrc.pop() : ""; // 删除最后的空白，看歌词文件最后有回车没得

					lrc.forEach(function(item, index, arr) {
						// console.log(item)

						var time = item.match(pattern);
						
						var value1 = item.replace(pattern, "");
						time.forEach(function(v, i, a) {
							var t = v.slice(1, -1).split(":");
							//v.slice(1,-1)--> 从第一个到最后中间的 取到了数字 

							result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value1]);
						})

					});
					result.sort(function(a, b) {
						return a[0] - b[0];
					});
					//return result;

					_this.lrc = result;

				})
			},
			next: function() {

				var xx = document.querySelector(".err");
				if(this.now >= this.allsongs.length - 1) {
					xx.style.display = "block";

					setTimeout(function() {
						xx.style.display = "none";
					}, 2000)

					return;
				}
				clearInterval(this.timer);
				this.now++;
				this.routerID++;
				this.nowsong = this.allsongs[this.now];
				this.playButton.src = this.nowsong.songname;
				this.lrcaddress = this.nowsong.lrc;
				this.getlrc();
			},
			last: function() {

				var xx = document.querySelector(".err");
				if(this.now <= 0) {
					//							alert("最后一首啦");
					xx.style.display = "block";
					setTimeout(function() {
						xx.style.display = "none";
					}, 2000)
					return;
				}
				clearInterval(this.timer);
				this.now--;
				this.routerID--;
				this.nowsong = this.allsongs[this.now];
				this.playButton.src = this.nowsong.songname;
				this.lrcaddress = this.nowsong.lrc;
				this.getlrc();
			},
			changtime: function() {
				var clientX = event.clientX;
				var cx = clientX / this.progress.offsetWidth;
				this.playButton.currentTime = cx * this.songtime;
				this.progress.value = this.playButton.currentTime / this.songtime * 100;
				this.pointEndX = cx * this.PointWidth;
				this.point.style.left = this.pointEndX + "px";
			},
			thingPlay: function() {
				var _this = this;
				this.playButton.play();
				this.playi.className = "fa fa-pause";
				clearInterval(this.timer);
				this.timer = setInterval(function() {
					_this.gotime = _this.playButton.currentTime;
					_this.progress.value = Math.round(_this.gotime / _this.songtime * 100);
					_this.point.style.left = _this.PointWidth * _this.progress.value / 100 + "px";
					_this.pointEndX = _this.PointWidth * _this.progress.value / 100;
//					console.log(1)
					if(_this.progress.value == 100) {
						_this.playi.className = "fa fa-play";
						_this.next();
						clearInterval(_this.timer);
					}
				}, 1000)
			},
			thingPause: function() {
				this.playButton.pause();
				this.playi.className = "fa fa-play";
				clearInterval(this.timer)
			}

		},
		mounted: function() {
			var _this = this;
			this.$http.get('./dist/api/new_file.php').then(function(res) {
				_this.allsongs = res.data;
				var x = parseInt(_this.$route.params.id);
				_this.nowsong = _this.allsongs[x - 1];
				_this.playButton.src = _this.nowsong.songname;
				_this.lrcaddress = _this.nowsong.lrc;
				_this.routerID = x;
				_this.now = x - 1;
				//						console.log(this.now)
				// console.log(this.lrcaddress)
				_this.getlrc();

			}, function() {
				alert("我靠，出错了")
			});

			// var point = document.querySelector(".point");

			this.playButton.onloadedmetadata = function() {
				_this.songtime = _this.playButton.duration;

				_this.pointEndX = 0;
				_this.pointMoveX = 0;
				_this.point.style.left = "0px";
				_this.progress.value = "0";
				if(_this.playButton.paused) {

					_this.thingPlay();

				} else {

					_this.thingPause();
				}
			}
			var _that = this;
			var lycp = document.querySelector(".current");
			var next = document.querySelector(".next");
			var previous = document.querySelector(".previous");

			this.playButton.ontimeupdate = function(e) {

				for(var i = 0; i < _that.lrc.length; i++) {
					if(this.currentTime > _that.lrc[i][0]) {

						if(i > 1) {
							previous.innerHTML = _that.lrc[i - 1][1];
						}

						lycp.innerHTML = _that.lrc[i][1]
						if(i < _that.lrc.length - 1) {
							next.innerHTML = _that.lrc[i + 1][1];
						} else if(i > _that.lrc.length - 2) {
							next.innerHTML = "";
						}

					}
				}

			}

		}

	}
	
</script>

	
<style>

</style>