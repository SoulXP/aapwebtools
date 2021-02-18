import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../views/Landing.vue';
import Login from '../views/Login.vue';
import BadLines from '../views/BadLines.vue';

const routes = [
	{
		path: '/',
		name: 'Landing',
		component: Landing
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/badlines',
		name: 'BadLines',
		component: BadLines
	}
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
