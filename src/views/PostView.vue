<template>
  <div class="post-view mt-20 px-4 md:px-10 lg:px-20 py-10 bg-gray-100 rounded-lg shadow-lg">
    <div class="mt-6 flex justify-end space-x-4">
      <button @click="editPost" class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md">
        Edit Post
      </button>
    </div>

    <!-- Conditional rendering for post content -->
    <div v-if="post">
      <h1 class="text-3xl font-extrabold text-gray-800 mb-4">{{ post.title }}</h1>
      <img :src="getImageUrl(post.image_url)" :alt="post.title" class="w-full h-auto object-cover rounded-lg shadow-md"/>
      <div class="mt-6 text-lg text-gray-700" v-html="post.fulltext"></div>
      <div class="mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <p class="font-semibold">{{ post.author }}</p>
        <p>{{ new Date(post.created_at).toLocaleDateString() }}</p>
      </div>
    </div>

    <!-- Display loading message if post data is not yet available -->
    <div v-else class="flex items-center justify-center h-64">
      <p class="text-xl text-gray-500">Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// Initialize route and router instances for navigation
const route = useRoute();
const router = useRouter();

const post = ref(null);

// Fetch the post data when the component is mounted
onMounted(async () => {
  const id = route.params.id;
  try {
    const response = await axios.get(`http://localhost:3000/posts/${id}`);
    post.value = response.data; // Store the fetched post data
  } catch (error) {
    console.error('Error fetching post:', error); // Log any errors
  }
});

// Function to navigate to the edit post page
const editPost = () => {
  router.push({ name: 'EditPost', params: { id: post.value.id } });
};

// Helper function to generate the correct image URL
function getImageUrl(imageUrl) {
  if (imageUrl.startsWith('uploads/')) {
    return `http://localhost:3000/${imageUrl}`; 
  }
  return `/assets/images/${imageUrl}`;
}
</script>

<style scoped>
.ql-editor {
  line-height: 1.6; 
  font-size: 16px; 
  color: #333; 
}
</style>
