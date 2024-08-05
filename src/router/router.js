import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/HomeView.vue';
import Post from '../views/PostView.vue';
import Login from '../views/LoginView.vue';
import Register from '../views/RegisterView.vue';
import CreatePost from '../views/CreatePostView.vue';
import EditPost from '../views/EditPostView.vue';

const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/posts/:id', component: Post, props: true, name: "Posts"},
    { path: '/posts/newPost', component: CreatePost },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/posts/:id/edit', name: 'EditPost', component: EditPost
      }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
