<template>
  <header class="fixed top-0 w-full bg-white z-50 flex justify-between items-center p-4 md:px-16 border-b border-gray-400">
    <nav class="w-full flex items-center justify-between ">
      <ul class="flex flex-row items-center space-x-8">
        <li class="text-2xl uppercase">
          <router-link to="/" class="block p-4 text-black ">
            BloggingPlattform
          </router-link>
        </li>
      </ul>
      <div class="flex items-center space-x-4">
        <router-link to="/posts/newPost" class="px-5 py-2 text-white bg-blue-600 rounded hover:bg-gray-600">
          Neuen Post erstellen
        </router-link>
          <router-link to="/register" class="px-5 py-2 text-black bg-transparent rounded hover:text-blue-500">
            Registrieren
          </router-link>
          <router-link to="/login" class="px-5 py-2 text-white bg-black rounded hover:bg-gray-600">
            Log In
          </router-link>
      </div>
    </nav>
  </header>
</template>

<script setup>
</script>


