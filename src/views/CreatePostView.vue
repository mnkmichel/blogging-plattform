<template>
  <div class="create-post-view mt-20 px-4 md:px-10 lg:px-20 py-10 bg-gray-100 rounded-lg shadow-lg">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-4">Erstelle einen neuen Post</h1>

    <!-- Form for creating a new post -->
    <form @submit.prevent="createPost" enctype="multipart/form-data">
      <!-- Input field for the post title -->
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
        <input type="text" id="title" v-model="title" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required />
      </div>

      <!-- Input field for the post description -->
      <div class="mb-4">
        <label for="content" class="block text-sm font-medium text-gray-700">Beschreibung</label>
        <input type="text" id="content" v-model="content" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required />
      </div>

      <!-- Input field for the post author -->
      <div class="mb-4">
        <label for="author" class="block text-sm font-medium text-gray-700">Autor</label>
        <input type="text" id="author" v-model="author" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required />
      </div>

      <!-- File input for uploading an image -->
      <div class="mb-4">
        <label for="image" class="block text-sm font-medium text-gray-700">Lade Bild hoch</label>
        <input type="file" id="image" @change="onFileChange"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <!-- Image preview after selecting a file -->
        <img v-if="imagePreview" :src="imagePreview" alt="Image Preview"
          class="mt-2 w-full h-auto object-cover rounded-md" />
      </div>

      <!-- Input field for the full text of the post -->
      <div class="mb-4">
        <label for="fulltext" class="block text-sm font-medium text-gray-700">Ganzer Text</label>
        <QuillEditor v-model="fulltext" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" theme="snow" />
      </div>

      <!-- Submit button for the form -->
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md">Post</button>
    </form>

    <!-- Confirmation message displayed after creating a post -->
    <div v-if="confirmationMessage" :class="{ 'text-green-600': !isError, 'text-red-600': isError }" class="mt-4">
      {{ confirmationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Reactive variables for form inputs and status messages
const title = ref('');
const author = ref('');
const content = ref('');
const fulltext = ref('');
const image = ref(null);
const imagePreview = ref(null);
const confirmationMessage = ref('');
const isError = ref(false);

// Handler for file input change event
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    image.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

// Function to generate the image URL for preview
const getImageUrl = (imageUrl) => {
  if (imageUrl.startsWith('uploads/')) {
    return `http://localhost:3000/${imageUrl}`;
  }
  return imageUrl;
};

// Function to handle post creation
const createPost = async () => {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('author', author.value);
  formData.append('content', content.value);
  formData.append('fullText', fulltext.value);
  if (image.value) {
    formData.append('image', image.value);
  }

  try {
    // Send POST request to create a new post
    const response = await axios.post('http://localhost:3000/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Set success message and clear form fields
    confirmationMessage.value = 'Post created successfully!';
    isError.value = false;

    title.value = '';
    author.value = '';
    content.value = '';
    fulltext.value = '';
    image.value = null;
    imagePreview.value = null;

    // Clear confirmation message after 3 seconds
    setTimeout(() => {
      confirmationMessage.value = '';
    }, 3000);

    // Update image preview if image URL is returned
    if (response.data.image_url) {
      imagePreview.value = getImageUrl(response.data.image_url);
    }
  } catch (error) {
    console.error('Error creating the post:', error);
    confirmationMessage.value = 'Error creating the post.';
    isError.value = true;
  }
};
</script>

<style scoped></style>
