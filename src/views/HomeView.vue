<template>
  <div class="container mx-auto p-4 mt-28">
    <div class="flex flex-wrap justify-center">
      <!-- Iterate over the posts and create a PostItem component for each one -->
      <PostItem v-for="(post, index) in posts" :key="post.id" :post="post" :index="index" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import PostItem from '../components/PostItem.vue'; 

// Reactive variable to store the list of posts
const posts = ref([]);

// Function to fetch posts from the server
const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/posts');
    posts.value = response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};

// Fetch posts when the component is mounted
onMounted(fetchPosts);
</script>

<style scoped>
</style>
