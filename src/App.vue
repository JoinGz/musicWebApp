<template>
  <div id="music">
			<header class="header">
				<router-link to="/home">
					<i class="fa fa-home"></i>
				</router-link>
				<h1><i class="fa fa-music"></i> Songs</h1>
				<router-link to="/Gz">
					<i class="fa fa-list"></i>
				</router-link>
			</header>
			<keep-alive>
				<transition name="transitionName" >
					<keep-alive>
						<router-view></router-view>
					</keep-alive>
				</transition>
			</keep-alive>
			<audio>
				Your browser does not support the audio tag.
			</audio>
		</div>
</template>

<script>
	import home from "./components/list.vue"
	import intro from "./components/intro.vue"
	import h from "./components/songs.vue"
	import Vue from "vue"
	import VueRouter from "vue-router"
	Vue.use(VueRouter);
	var router1 = [{
				path: "/home",
				component: home
			}, {
				path: "/Gz",
				component: intro
			}, {
				path: "/:id",
				component: h
			}];
export var router3 = new VueRouter({ //创建 router 实例，然后传 `routes1` 配置
				routes: router1
			});
export default {
  		
  
}
</script>

<style>
				
			.transitionName-enter,
			.transitionName-leave {
				opacity: 1;
				-webkit-transform: translate3d(0, 10rem, 0);
				transform: translate3d(0, 10rem, 0);
			}
			
			.transitionName-leave-active,
			.transitionName-enter-active {
				opacity: 0;
				transition: all 0.3s ease;
				-webkit-transform: translate3d(0, 10rem, 0);
				transform: translate3d(0, 10rem, 0);
			}
</style>
