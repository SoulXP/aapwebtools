<template>
	<div id="loginform-container">
		<h1 class="aap-wt-normal aap-sz-28">AAP Tribe Login</h1>
		<form id="login-form" action="" novalidate>
			<div class="form-group">
				<div class="form-element">
					<label for="show">Username or email address</label>
					<input type="text" id="show">
				</div>
				<div class="form-element">
					<div>
						<label for="character_name">Password</label>
						<a href="#">Forgot password?</a>
					</div>
					<input type="password" id="character_name">
				</div>
			</div>
			<button @click.prevent="">Log in</button>
		</form>
		<div id="loginform-register-container">
			<p>Need an account? <a href="#">Register here.</a></p>
		</div>
	</div>
</template>

<script>
// import services from '@/services/services.js';
// import { ref } from 'vue';

export default {
	name: 'LoginForm'
}
</script>

<style scoped>
	* {
		margin: 0;
		box-sizing: border-box;
		font-family: 'Poppins', sans-serif;
		color: #EEEEEE;
		outline: none;
		background: none;
	}

	#loginform-container {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: column;
		gap: 2rem;
	}

	#login-form {
		display: flex;
		margin: 0;
		width: 460px;
		height: auto;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background-color: #353535;
		border-radius: 6px;
		padding: 1rem 1.5rem 1rem 1.5rem;
		font-size: 18px;
	}

	#login-form input {
		max-width: 460px;
		max-height: 3rem;
		height: 100%;
		margin-top: 0.5rem;
		padding: 0.75rem;
		border: 1px solid #757575;
		border-radius: 6px;
		background-color: #505050 !important;
		font-size: 14px;
	}

	#login-form select {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		-ms-appearance: none;
		max-width: 460px;
		margin-top: 0.5rem;
		padding: 0.75rem;
		border: 1px solid #757575;
		background-color: #505050 !important;
		border-radius: 6px;
	}

	#login-form button {
		max-width: 460px;
		height: 3rem;
		width: 100%;
		margin-top: 3rem;
		background-color: #C70E00;;
		border: none;
		border-radius: 6px;
		font-size: 24px;
	}

	#login-form label {
		height: 25px;
	}

	#login-form select:focus,
	#login-form textarea:focus,
	#login-form input:focus {
		border-color: #C70E00;
	}

	#login-form button:hover {
		background-color: #C70E00;
	}

	#login-form button:active {
		background-color:#D70E00;
	}

	#login-form button:focus {
		border: 1px solid #D70E00;
	}

	#login-form .form-group {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	#login-form .form-element {
		display: flex;
		min-width: 100%;
		flex-direction: column;
		justify-content: space-between;
		margin-top: 0.5rem;
	}

	#login-form .form-element div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
	}

	#login-form .form-element div > a {
		font-size: 0.75rem;
		text-decoration: none;
		color: #AAAAAA;
	}

	#login-form > .form-group > :first-child {
		margin-top: 0;
	}

	#loginform-register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 460px;
		height: 4rem;
		border: 1px solid #303030;
		border-radius: 6px;
		font-size: 0.75rem;
	}

	#loginform-register-container a {
		color: #AAAAAA;
		text-decoration: none;
		margin-left: 0.75rem;
	}
</style>
