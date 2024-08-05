<template>
    <div class="flex flex-col md:w-1/2 mb-4 p-4 ">
        <div class="w-full mb-4">
            <h2 class="text-2xl font-bold mb-2">{{ post.title }}</h2>
            <img :src="getImageUrl(post.image_url)" :alt="post.title" class="w-full h-[20rem] object-cover rounded shadow" />
        </div>
        <div class="flex flex-col flex-1">
            <p class="mb-4 text-gray-600">{{ post.content }}</p>
            <router-link :to="`/posts/${post.id}`" class="text-black underline flex items-center mt-auto">
                <span class="mr-2">Read Post</span>
                <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
                </svg>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    post: {
        type: Object,
        required: true,
        validator: (value) => {
            return (
                typeof value.id === 'number' &&
                typeof value.title === 'string' &&
                typeof value.image_url === 'string' &&
                typeof value.content === 'string'
            );
        }
    }
});

const getImageUrl = (imageUrl) => {
  if (imageUrl.startsWith('uploads/')) {
    return `http://localhost:3000/${imageUrl}`;
  }
  return `/assets/images/${imageUrl}`;
};
</script>
