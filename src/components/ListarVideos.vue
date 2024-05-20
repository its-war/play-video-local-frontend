<template>
  <div style="width: 50px; margin: 15px auto">
    <v-btn @click="listarArquivos" :loading="loading" color="green" tag="a" icon="mdi-restart"/>
  </div>
  <div style="width: 85%; margin: auto">
    <div v-for="(arquivo, i) in arquivos" :key="i" ref="lista">
      <div style="border: 1px solid white; display: inline-block; border-radius: 5px">
        <div :id="`arquivo-${i}`" class="btn-video" @click="selecionarVideo(i)">{{getArquivoNome(arquivo)}}</div>
        <v-btn :title="`${arquivos[i]}`" @click="setArquivoSelecionado(i); deletePanel = true" icon="mdi-close" variant="text"/>
        <RenomearVideos :index="i" :nome-arquivo="getArquivoNome(arquivo)" @renomear="renomearArquivo"/>
        <v-dialog v-model="deletePanel" :width="$store.isMobile?'95%':'25%'">
          <v-card>
            <v-card-text>Deseja realmente apagar o arquivo?</v-card-text>
            <v-card-actions>
              <v-btn @click="deletePanel = false" color="info" prepend-icon="mdi-cancel">Cancelar</v-btn>
              <v-spacer/>
              <v-btn @click="apagarArquivo" color="red" append-icon="mdi-delete">Apagar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
  <div id="video" :style="$store.isMobile?'width: 100%':'width: 60%'">
  </div>
</template>

<script>
import RenomearVideos from "@/components/RenomearVideos.vue";
export default {
  name: 'ListarVideos',
  components: {RenomearVideos},
  data: () => ({
    arquivos: [],
    arquivoSelecionado: null,
    arquivoSelecionadoIndex: null,
    loading: false,
    deletePanel: false
  }),
  methods: {
    listarArquivos() {
      this.loading = true;
      this.arquivoSelecionado = null;
      this.removerBackgroundBtns();
      document.title = 'Play Animes';
      let div = document.querySelector('#video');
      div.innerHTML = '';
      this.axios.get('video/listar').then((res) => {
        this.arquivos = res.data.arquivos;
      }).finally(() => {
        this.loading = false;
      });
    },
    selecionarVideo(index){
      this.arquivoSelecionado = this.arquivos[index];
      document.title = this.arquivoSelecionado.replace('.mp4', '');
      let div = document.querySelector('#video');
      let selecionado = document.querySelector(`#arquivo-${index}`);
      div.innerHTML = `<video controls crossorigin="anonymous" width="100%">
                 <source src="${this.$baseUrl}/animes/${this.arquivoSelecionado}" type="video/mp4">
                 </video>`;
      this.removerBackgroundBtns();
      selecionado.style.backgroundColor = 'rgb(200, 0, 0)';
      selecionado.style.color = 'white';
    },
    removerBackgroundBtns(){
      for (let i = 0; i < this.arquivos.length; i++) {
        let btn = document.querySelector(`#arquivo-${i}`);
        btn.style.backgroundColor = '#b8b8b8';
        btn.style.color = '#343434';
      }
    },
    apagarArquivo(){
      const arquivoSelecionado = this.arquivos[this.arquivoSelecionadoIndex];
      this.axios.delete(`video/apagar`, {
        data: {
          arquivo: arquivoSelecionado
        }
      }).then((res) => {
        if(res.data.apagar){
          this.arquivos.splice(this.arquivoSelecionadoIndex, 1);
        }
      }).finally(() => {
        this.removerBackgroundBtns();
        this.arquivoSelecionado = null;
        this.deletePanel = false;
      })
    },
    setArquivoSelecionado(index){
      this.arquivoSelecionadoIndex = index;
    },
    getArquivoNome(arquivo){
      return arquivo.replace('.mp4', '');
    },
    renomearArquivo(nomeArquivo, novoNome){
      for (let i = 0; i < this.arquivos.length; i++) {
        if(this.arquivos[i] === nomeArquivo){
          this.arquivos[i] = novoNome + '.mp4';
        }
      }
    }
  },
  mounted() {
    this.listarArquivos();
  }
}
</script>

<style scoped>
.btn-video {
  margin: 5px;
  background-color: #b8b8b8;
  color: #343434;
  font-weight: bold;
  padding: 6px;
  display: inline-block;
  border-radius: 5px;
  cursor: default;
}

.btn-video:active {
  background-color: #727272;
}

#video {
  margin: auto;
}
</style>
