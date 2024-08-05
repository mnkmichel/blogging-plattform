<template>
  <div id="app">
    <NavBar/>
    <!-- This is where routed components will be displayed -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
</script>
