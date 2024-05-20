<template>
  <div style="width: 85%; margin: 15px auto">
    <v-file-input
      v-model="files"
      color="info"
      counter
      label="Adicionar vídeos"
      multiple
      placeholder="Selecione arquivos"
      prepend-icon="mdi-movie-open-plus"
      variant="outlined"
      :show-size="1000"
      accept="video/mp4"
      v-on:click:clear="files = null"
    />
    <v-btn v-if="files" @click="upload" prepend-icon="mdi-upload" color="success" :loading="isLoading">Enviar</v-btn>

    <div v-show="!upload.finish" v-for="(upload, i) in arquivosEmUpload" :key="i" style="margin: 10px 0; padding: 10px; border: 1px solid white; border-radius: 10px">
      <h3>{{upload.fileName}}</h3>
      <v-progress-linear
          v-show="upload.loading"
          style="margin-top: 15px; height: 20px; border-radius: 10px"
          color="info"
          :max="100"
          :model-value="upload.progress">{{upload.progress}}% de 100%</v-progress-linear>

      <v-alert
          :key="i"
          style="margin-top: 15px"
          v-show="upload.success"
          type="success">
        Upload do arquivo <strong>{{upload.fileName}}</strong> foi concluído com sucesso!
      </v-alert>

      <v-alert
          :key="i"
          style="margin-top: 15px"
          v-show="upload.error"
          closable
          type="error">
        Erro ao fazer o upload. Tente novamente.<br/>
        <strong>{{upload.error}}</strong>
      </v-alert>
    </div>

    <v-alert
        style="margin-top: 15px"
        v-if="isFinish"
        type="success">
      Todos os arquivos foram enviados com sucesso!
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "UploadComponent",
  data: () => ({
    files: null,
    worker: null,
    arquivosEmUpload: []
  }),
  methods: {
    upload() {
      for (let i = 0; i < this.files.length; i++) {
        this.arquivosEmUpload.push({
          fileName: this.files[i].name,
          progress: 0,
          success: false,
          error: false,
          loading: true,
          finish: false
        });
        this.worker.postMessage({file: this.files[i], url: this.$baseUrl});
      }
    },
    onWorkerMessage(event){
      const {type, fileName, progress, error} = event.data;
      switch(type){
        case 'progress':{
          for (let i = 0; i < this.arquivosEmUpload.length; i++) {
            if(this.arquivosEmUpload[i].fileName === fileName){
              this.arquivosEmUpload[i].progress = progress;
              break;
            }
          }
          break;
        }
        case 'success':{
          for (let i = 0; i < this.arquivosEmUpload.length; i++) {
            if(this.arquivosEmUpload[i].fileName === fileName){
              this.arquivosEmUpload[i].success = true;
              this.arquivosEmUpload[i].loading = false;
              setTimeout(() => {
                this.arquivosEmUpload[i].success = false;
                this.arquivosEmUpload[i].finish = true;
              }, 5000);
              break;
            }
          }
          break;
        }
        case 'error':{
          for (let i = 0; i < this.arquivosEmUpload.length; i++) {
            if(this.arquivosEmUpload[i].fileName === fileName){
              this.arquivosEmUpload[i].error = true;
              this.arquivosEmUpload[i].loading = false;
              console.error(error);
              break;
            }
          }
          break;
        }
      }
    },
    resetPage(){
      this.files = null;
      this.arquivosEmUpload = [];
    }
  },
  mounted() {
    this.worker = new Worker(new URL('./UploadWorker.js', import.meta.url));
    this.worker.onmessage = this.onWorkerMessage;
  },
  computed: {
    isLoading(){
      for (let i = 0; i < this.arquivosEmUpload.length; i++) {
        if(this.arquivosEmUpload[i].loading){
          return true;
        }
      }
      return false;
    },
    isFinish(){
      if(this.arquivosEmUpload.length > 0){
        for (let i = 0; i < this.arquivosEmUpload.length; i++) {
          if(!this.arquivosEmUpload[i].finish){
            return false;
          }
        }
        setTimeout(() => {
          this.resetPage();
        }, 4000);
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>

</style>