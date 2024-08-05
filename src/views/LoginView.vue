<template>
    <!-- Main section of the login page with background color -->
    <section class="bg-gray-50 dark:bg-gray-900">
        <!-- Container for centering and padding the content -->
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <!-- Card-like container for the login form -->
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <!-- Header for the login form -->
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Melde dich an
                    </h1>
                    <!-- Login form with submission handler -->
                    <form @submit.prevent="loginUser" class="space-y-4 md:space-y-6">
                        <!-- Input field for email or username -->
                        <div>
                            <label for="identifier" class="block mb-2 text-sm font-medium text-gray-900">
                                Email or Benutzername
                            </label>
                            <input type="text" v-model="identifier" id="identifier"
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Email or Username" required />
                        </div>
                        <!-- Input field for password -->
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Passwort</label>
                            <input type="password" v-model="password" id="password" placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                required />
                        </div>
                        <!-- Submit button for the form -->
                        <button type="submit"
                            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Sign in
                        </button>
                        <!-- Link to registration page -->
                        <p class="text-sm font-light text-gray-500">
                            Du hast noch keine Account? <a href="#"
                                class="font-medium text-blue-600 hover:underline">Regestriere dich</a>
                        </p>
                    </form>
                    <!-- Error message displayed if login fails -->
                    <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Initialize router for navigation
const router = useRouter();

// Reactive variables for form data and error messages
const identifier = ref('');
const password = ref('');
const errorMessage = ref('');

// Function to handle user login
const loginUser = async () => {
    try {
        // Check if both fields are filled
        if (!identifier.value || !password.value) {
            errorMessage.value = 'All fields are required.';
            return;
        }

        // Make a POST request to the login endpoint
        const response = await axios.post('http://localhost:3000/login', {
            identifier: identifier.value,
            password: password.value
        });

        // Check if the response indicates a successful login
        if (response.data && response.data.success) {
            alert('Login successful!');
            router.push('/'); // Redirect to the home page upon successful login
        } else {
            // Display the error message from the server or a default message
            errorMessage.value = response.data.message || 'Invalid email or username, or password.';
        }
    } catch (error) {
        // Log the error and show a generic error message
        console.error('Error logging in:', error.response ? error.response.data : error.message);
        errorMessage.value = 'An error occurred. Please try again.';
    }
};
</script>
  