<template>
	<form id="badline-form" action="" novalidate>
		<div class="form-group">
			<div class="form-element">
				<label for="show">Show Name</label>
				<select v-model="showName" name="show">
					<option v-for="name in showNames" :key="name">{{ name }}</option>
				</select>
			</div>
			<div class="form-element">
				<label for="character">Character Name</label>
				<input v-model="characterName" type="text" id="character_name">
			</div>
		</div>
		<div class="form-element">
			<label for="line">Line</label>
			<textarea v-model="line" name="line" id="line" cols="30" rows="10"></textarea>
		</div>
		<button @click.prevent="validateForm()">Submit</button>
	</form>
</template>

<script>
import services from '@/services/services.js';
import { ref } from 'vue';

export default {
	name: 'BadLineForm',
	setup () {
		const showNames = ref([
			'One',
			'Two',
			'Three'
		]);
		const characterName = ref('');
		const line = ref('');

		return {
			showNames,
			characterName,
			line
		}
	},

	methods: {
		validateForm () {
			// Send to api for logging
			services.addBadLine({ type: 'badline-form', formdata: { show: this.showName, character: this.characterName, line: this.line } })
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		sendPost (formData) {
			services.dev_get()
				.then((res) => {
					console.log(res.data);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}

// 	data () {
// 		return {
// 			showNames: [
// 				'One',
// 				'Two',
// 				'Three'
// 			],
// 			characterName: '',
// 			line: ''
// 		}
// 	},
// 	methods: {
// 		validateForm () {
// 			// Send to api for logging
// 			services.addBadLine({ type: 'badline-form', formdata: { show: this.showName, character: this.characterName, line: this.line } })
// 				.then((res) => {
// 					console.log(res);
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 				});
// 		},
// 		sendPost (formData) {
// 			services.dev_get()
// 				.then((res) => {
// 					console.log(res.data);
// 				})
// 				.catch((err) => {
// 					console.error(err);
// 				});
// 		}
// 	}
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

	#badline-form {
		display: flex;
		margin: 0;
		width: 820px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 0.5em;
		background-color: #353535;
		border-radius: 6px;
		padding: 1.5em 2em 1.5em 2em;
	}

	#badline-form input {
		max-width: 820px;
		margin-top: 0.5em;
		padding: 0.75em;
		border: 0.1em solid #757575;
		border-radius: 4px;
		background-color: #505050 !important;
	}

	#badline-form textarea {
		resize: none;
		width: 100%;
		height: 200px;
		padding: 0.75em;
		margin-top: 0.5em;
		border: 0.1em solid #757575;
		border-radius: 4px;
		background-color: #505050;
	}

	#badline-form select {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		-ms-appearance: none;
		max-width: 820px;
		margin-top: 0.5em;
		padding: 0.75em;
		border: 0.1em solid #757575;
		background-color: #505050 !important;
		border-radius: 4px;
	}

	#badline-form button {
		max-width: 820px;
		height: 3em;
		width: 100%;
		margin-top: 1em;
		background-color: #C70E00;;
		border: none;
	}

	#badline-form select:focus,
	#badline-form textarea:focus,
	#badline-form input:focus {
		border-color: #C70E00;
	}

	#badline-form button:hover {
		background-color: #C70E00;
	}

	#badline-form button:active {
		background-color:#D70E00;
	}

	#badline-form button:focus {
		border: 0.1em solid #D70E00;
	}

	#badline-form .form-group {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	#badline-form .form-element {
		display: flex;
		min-width: 100%;
		flex-direction: column;
		justify-content: space-between;
		margin-top: 0.5em;
	}
</style>
