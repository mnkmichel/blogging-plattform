<template>
  <div class="edit-post-view mt-20 px-4 md:px-10 lg:px-20 py-10 bg-gray-100 rounded-lg shadow-lg">
    <!-- Main heading for the page -->
    <h1 class="text-3xl font-extrabold text-gray-800 mb-4">Bearbeite Post</h1>

    <!-- Form for editing a post -->
    <form @submit.prevent="updatePost" enctype="multipart/form-data">
      <!-- Input field for the post title -->
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
        <input type="text" id="title" v-model="title" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required />
      </div>

      <!-- Textarea for the post description -->
      <div class="mb-4">
        <label for="content" class="block text-sm font-medium text-gray-700">Beschreibung</label>
        <textarea id="content" v-model="content" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="5"
          required></textarea>
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
          class="mt-2 w-full h-[20rem] object-cover rounded-md" />
      </div>

      <!-- Quill Editor for full text of the post -->
      <div class="mb-4">
        <label for="fulltext" class="block text-sm font-medium text-gray-700">Ganzer Text</label>
        <QuillEditor id="fulltext" v-model="fulltext" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          theme="snow" ref="quillEditor" @ready="onEditorReady" />
      </div>

      <!-- Submit button to update the post -->
      <button type="submit" class="px-4 py-2 mr-4 bg-blue-600 text-white font-semibold rounded-md">Update Post</button>

      <!-- Button to delete the post -->
      <button type="button" @click="confirmDeletePost"
        class="px-4 py-2 bg-red-600 text-white font-semibold rounded-md mt-4">Lösche Post</button>
    </form>

    <!-- Confirmation message after update or delete action -->
    <div v-if="confirmationMessage" :class="{ 'text-green-600': !isError, 'text-red-600': isError }" class="mt-4">
      {{ confirmationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { QuillEditor } from '@vueup/vue-quill'; // Import QuillEditor component

const route = useRoute(); // Use route parameters
const router = useRouter(); // Use router to navigate

// Reactive variables for form inputs and status messages
const title = ref('');
const author = ref('');
const content = ref('');
const fulltext = ref('');
const image = ref(null);
const imagePreview = ref(null);
const confirmationMessage = ref('');
const isError = ref(false);
const quillEditor = ref(null);

// Fetch post details when the component is mounted
onMounted(async () => {
  const id = route.params.id;
  console.log('Fetching post with ID:', id);
  try {
    const response = await axios.get(`http://localhost:3000/posts/${id}`);
    const post = response.data;
    title.value = post.title;
    author.value = post.author;
    content.value = post.content;
    fulltext.value = post.fulltext;
    imagePreview.value = getImageUrl(post.image_url);

    // Set content in the Quill Editor after component mounts
    nextTick(() => {
      if (quillEditor.value) {
        quillEditor.value.getQuill().root.innerHTML = post.fulltext;
      }
    });
  } catch (error) {
    console.error('Error fetching post:', error);
  }
});

// Handle file input change and set image preview
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    image.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

// Function called when the Quill Editor is ready
const onEditorReady = () => {
  console.log('Quill Editor is ready');
};

// Update post with new details
const updatePost = async () => {
  const id = route.params.id;
  console.log('Updating post with ID:', id);

  // Get content from Quill Editor
  if (quillEditor.value) {
    fulltext.value = quillEditor.value.getQuill().root.innerHTML;
  }

  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('author', author.value);
  formData.append('content', content.value);
  formData.append('fulltext', fulltext.value);
  if (image.value) {
    formData.append('image', image.value);
  }

  try {
    const response = await axios.put(`http://localhost:3000/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Update response:', response);

    confirmationMessage.value = 'Post successfully updated!';
    isError.value = false;

    // Redirect to the post list after a short delay
    setTimeout(() => {
      confirmationMessage.value = '';
      router.push({ name: 'Posts', params: { id } });
    }, 2000);
  } catch (error) {
    console.error('Error updating post:', error);
    confirmationMessage.value = 'Error updating post.';
    isError.value = true;
  }
};

// Confirm deletion of the post with a confirmation dialog
const confirmDeletePost = () => {
  if (confirm('Are you sure you want to delete this post?')) {
    deletePost();
  }
};

// Delete the post from the server
const deletePost = async () => {
  const id = route.params.id;
  console.log('Deleting post with ID:', id);

  try {
    const response = await axios.delete(`http://localhost:3000/posts/${id}`);
    console.log('Delete response:', response);

    confirmationMessage.value = 'Post successfully deleted!';
    isError.value = false;

    // Redirect to the home page after a short delay
    setTimeout(() => {
      confirmationMessage.value = '';
      router.push({ name: 'Home' });
    }, 2000);
  } catch (error) {
    console.error('Error deleting post:', error);
    confirmationMessage.value = 'Error deleting post.';
    isError.value = true;
  }
};

// Helper function to get the image URL for preview
function getImageUrl(imageUrl) {
  if (imageUrl.startsWith('uploads/')) {
    return `http://localhost:3000/${imageUrl}`;
  }
  // If it's not a path starting with 'uploads/', assume it's a static frontend URL
  return `/assets/images/${imageUrl}`;
}
</script>

<style scoped></style>
