import api from '@/services/api.js';

export default {
	// Dev requests
	dev_get () {
		console.log('Sending GET request to API services provider');
		return api().get('/');
	},

	// Client requests
	addBadLine (formData) {
		console.log('Sending POST request to API services provider');
		return api().post('/', formData);
	}
}
