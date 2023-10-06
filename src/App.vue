<script setup>
import MinesWeeper from "./components/MinesWeeper.vue";
</script>

<template>
  <h1>Mini games</h1>
  <MinesWeeper :width="8" :height="7" :mines-percent="0.1" :tile-sizes="50" />
</template>

<style scoped></style>
