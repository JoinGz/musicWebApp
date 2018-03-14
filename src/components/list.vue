<template id="list">
	<div class="myflex">
		<section class="main">
			<div class="list">
				<ol>
					<li v-for="(val,index) in songs">
						<router-link :to="val.id">
							<!--<a href="item.html">-->
							<span class="num">{{index+1}}</span>
							<div class="info">
								<h3 class="title">{{val.title}}</h3>
								<span class="artist">{{val.artist}}</span>
							</div>
							<span class="duration">04:50</span>
							<div class="photo"><img :src="val.photo" alt="李克勤"></div>
							<!--</a>-->
						</router-link>
					</li>
				</ol>
			</div>
		</section>
	</div>

</template>

<script>
	export default {
		template: "#list",
		mounted: function() {
			this.get1()
		},
		data: function() {
			return {
				songs: {}
			}
		},
		methods: {
			get1: function() {
				var that = this;
				this.$http.get('./dist/api/new_file.php').then(function(res) {
//					console.log(res.data)
					that.songs =res.data;
				}, function() {
					alert("我靠，出错了")
				})
			}
		}
	}
</script>

<style>

</style>