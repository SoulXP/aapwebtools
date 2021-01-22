import axios from 'axios';
export default () => {
    const instance = axios.create({
        // TODO: Load enviroment
        baseURL: 'http://102.132.255.252/badlines'
    });
    return instance;
}
