import axios from 'axios';
export default () => {
	const instance = axios.create({
		// TODO: Load enviroment
		baseURL: 'http://localhost:8081/badlines'
	});
	return instance;
}
