<template>
    <!-- Container for the registration form -->
    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
                <!-- Form container with padding and responsive design -->
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <!-- Form title -->
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                        Erstelle einen Account
                    </h1>
                    <!-- Registration form -->
                    <form @submit.prevent="registerUser" class="space-y-4 md:space-y-6">
                        <!-- Username input field -->
                        <div>
                            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 ">
                                Username
                            </label>
                            <input type="text" v-model="username" id="username"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 "
                                placeholder="Your username" required>
                        </div>
                        <!-- Email input field -->
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">
                                Deine E-Mail
                            </label>
                            <input type="email" v-model="email" id="email"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 "
                                placeholder="name@company.com" required>
                        </div>
                        <!-- Password input field -->
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 #">
                                Passwort
                            </label>
                            <input type="password" v-model="password" id="password" placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                                required>
                        </div>
                        <!-- Confirm password input field -->
                        <div>
                            <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 #">
                                Bestätige Passwort
                            </label>
                            <input type="password" v-model="confirmPassword" id="confirm-password" placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                                required>
                        </div>
                        <!-- Terms and conditions checkbox -->
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input id="terms" aria-describedby="terms" type="checkbox" v-model="termsAccepted"
                                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 "
                                    required>
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="terms" class="font-light text-gray-500 ">
                                    Ich akzeptiere <a class="font-medium text-blue-600 hover:underline " href="#">
                                        Datenschutz und Konditionen
                                    </a>
                                </label>
                            </div>
                        </div>
                        <!-- Submit button -->
                        <button type="submit"
                            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Erstelle einen Account
                        </button>
                        <!-- Link to login page -->
                        <p class="text-sm font-light text-gray-500 ">
                            Hast du schon einen Account? <a href="#" class="font-medium text-blue-600 hover:underline">Login
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Reactive variables for form fields
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const termsAccepted = ref(false);

// Function to handle user registration
const registerUser = async () => {
    // Check if passwords match
    if (password.value !== confirmPassword.value) {
        alert('Passwords do not match!');
        return;
    }

    // Check if terms are accepted
    if (!termsAccepted.value) {
        alert('You must accept the terms and conditions.');
        return;
    }

    try {
        // Send registration request to the server
        const response = await axios.post('http://localhost:3000/register', {
            username: username.value,
            email: email.value,
            password: password.value,
        });

        // Alert user of successful registration
        alert('Account created successfully!');
        console.log('Registration response:', response.data);

        // Optionally clear the form or redirect user
        username.value = '';
        email.value = '';
        password.value = '';
        confirmPassword.value = '';
        termsAccepted.value = false;
    } catch (error) {
        // Handle registration errors
        console.error('Error registering user:', error.response ? error.response.data : error.message);
        alert('Error creating account. Please try again.');
    }
};
</script>
  