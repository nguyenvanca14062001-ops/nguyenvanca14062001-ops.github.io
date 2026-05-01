<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Ở đây CHỈ ĐƯỢC CÓ RouterView, không được có Sidebar hay Flex gì hết -->
  <RouterView />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #090e17;
}
</style>