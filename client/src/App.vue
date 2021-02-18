<template>
<div id="app-container">
	<Navigation id="navigation-main"/>
	<router-view/>
	<Footer id="footer-main"/>
</div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';
import Footer from '@/components/Footer.vue';

export default {
	setup () {
		return {
			Navigation,
			Footer
		};
	}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
@import url('../public/css/AAPGlobal.css');

* {
	font-family: 'Poppins', sans-serif;
	color: #EEEEEE;
}

#app-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
	height: 100vh;
}
</style>
