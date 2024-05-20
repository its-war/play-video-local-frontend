<template>
  <v-app-bar>
    <v-app-bar-title v-if="!$store.isMobile">Play Animes</v-app-bar-title>
    <v-app-bar-title v-else>PA</v-app-bar-title>
    <template v-slot:append>
      <v-btn @click="goRoute('Upload')"
             :size="$store.isMobile?'x-small':'default'"
             :color="isUpload?'info':'default'"
             tag="a" prepend-icon="mdi-upload">Upload Vídeos</v-btn>

      <v-btn @click="goRoute('Listar')"
             :size="$store.isMobile?'x-small':'default'"
             :color="isListar?'info':'default'"
             tag="a" prepend-icon="mdi-format-list-bulleted">Listar Vídeos</v-btn>
    </template>
  </v-app-bar>
  <v-main>
    <router-view/>
  </v-main>
</template>

<script>
export default {
  name: "HomeComponent",
  computed: {
    isListar(){
      return this.$route.name === 'Listar';
    },
    isUpload(){
      return this.$route.name === 'Upload';
    }
  },
  methods: {
    goRoute(route){
      this.$router.push({name: route});
    }
  }
}
</script>

<style scoped>

</style>