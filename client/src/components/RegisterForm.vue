<template>
	<div id="registerform-container">
		<h1 class="aap-wt-normal aap-sz-28">AAP Tribe Registration</h1>
		<form id="register-form" action="" novalidate>
			<div class="form-group">
				<div class="form-element">
					<div class="form-element-group">
						<label for="show">Full Names</label>
						<input type="text" id="name">
					</div>
				</div>
				<div class="form-element">
					<div class="form-element-group">
						<label for="show">Username</label>
						<input type="text" id="name">
					</div>
					<div class="form-element-group">
						<label for="show">Email</label>
						<input type="text" id="email">
					</div>
				</div>
				<div class="form-element">
					<div class="form-element-group">
						<label for="character_name">Password</label>
						<input type="password" id="password1">
					</div>
					<div class="form-element-group">
						<label for="character_name">Confirm Password</label>
						<input type="password" id="passoword2">
					</div>
				</div>
			</div>
			<button @click.prevent="">Submit</button>
		</form>
	</div>
</template>

<script>
// import services from '@/services/services.js';
// import { ref } from 'vue';

export default {
	name: 'RegisterForm'
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

	#registerform-container {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: column;
		gap: 2rem;
	}

	#register-form {
		display: flex;
		margin: 0;
		width: 820px;
		height: auto;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background-color: #353535;
		border-radius: 6px;
		padding: 1rem 1.5rem 1rem 1.5rem;
		font-size: 18px;
	}

	#register-form input {
		max-width: 820px;
		max-height: 3rem;
		width: 100%;
		height: 100%;
		margin-top: 0.5rem;
		padding: 0.75rem;
		border: 1px solid #757575;
		border-radius: 6px;
		background-color: #505050 !important;
		font-size: 14px;
	}

	#register-form select {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		-ms-appearance: none;
		max-width: 820px;
		margin-top: 0.5rem;
		padding: 0.75rem;
		border: 1px solid #757575;
		background-color: #505050 !important;
		border-radius: 6px;
	}

	#register-form button {
		max-width: 820px;
		height: 3rem;
		width: 100%;
		margin-top: 3rem;
		background-color: #C70E00;;
		border: none;
		border-radius: 6px;
		font-size: 24px;
	}

	#register-form label {
		height: 25px;
	}

	#register-form select:focus,
	#register-form textarea:focus,
	#register-form input:focus {
		border-color: #C70E00;
	}

	#register-form button:hover {
		background-color: #C70E00;
	}

	#register-form button:active {
		background-color:#D70E00;
	}

	#register-form button:focus {
		border: 1px solid #D70E00;
	}

	#register-form .form-group {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	#register-form .form-element {
		display: flex;
		min-width: 100%;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 0.5rem;
		gap: 1rem;
	}

	#register-form .form-element > .form-element-group {
		display: flex;
		max-width: 820px;
		width: 100%;
		justify-content: space-between;
		align-items: flex-start;
		flex-direction: column;
	}

	#register-form .form-element div > a {
		font-size: 0.75rem;
		text-decoration: none;
		color: #AAAAAA;
	}

	#register-form > .form-group > :first-child {
		margin-top: 0;
	}

	#registerform-register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 460px;
		height: 4rem;
		border: 1px solid #303030;
		border-radius: 6px;
		font-size: 0.75rem;
	}

	#registerform-register-container a {
		color: #AAAAAA;
		text-decoration: none;
		margin-left: 0.75rem;
	}
</style>
