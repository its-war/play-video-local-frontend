<script setup>
import {RouterView} from 'vue-router'
import {useDisplay} from "vuetify"
import Store from '@/store'
const store = Store()
store.setMobile(useDisplay().mobile.value)
</script>

<template>
  <v-app>
    <v-overlay :model-value="store.isLoading" class="align-center justify-center">
      <v-progress-circular color="info" indeterminate :size="store.isMobile?40:80"/>
    </v-overlay>
    <RouterView/>
  </v-app>
</template>

<style scoped>

</style>
