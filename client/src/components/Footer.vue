<template>
<div id="footer-main">
  <div id="footer-main-content">
	<h1 id="footer-section-left"></h1>
		<div id="footer-section-center" class="aap-gray">
		</div>
	<h1 id="footer-section-right"></h1>
  </div>
</div>
</template>

<script>
export default {
	name: 'Footer'
}
</script>

<style scoped>
  * {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	background: none;
  }

  h1 {
	font-size: 1.5em;
  }

  h3 {
	font-size: 1.1em;
  }

  #footer-main {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 4.5em;
	left: 0;
	top: 0;
	background-color: #303030;
  }

  #footer-main-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	max-width: 85vw;
	width: 100%;
  }

  #footer-section-center {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 2em;
  }

  .aap-gray {
	color: #AAAAAA;
  }
</style>
