<template>
  <div style="width: 50px; margin: 15px auto">
    <v-btn @click="listarArquivos" :loading="loading" color="green" tag="a" icon="mdi-restart"/>
  </div>
  <div style="width: 85%; margin: auto">
    <span style="color: deepskyblue" v-if="hasLastVideo">Visto por último: {{lastVideo}}</span>

    <v-expansion-panels variant="accordion">
      <v-expansion-panel
          :title="getTitleExpansionPanel(data.data)"
          v-for="(data, j) in arquivos"
          :key="j"
      >
        <template v-slot:text>
          <div v-for="(arquivo, i) in data.videos" :key="i" ref="lista">
            <div style="border: 1px solid white; display: inline-block; border-radius: 5px; margin: 5px 0">
              <div :id="`arquivo-${j}-${i}`" class="btn-video" @click="selecionarVideo(j, i); videoPanel = true">{{getArquivoNome(arquivo.name)}}</div>
              <v-btn :title="`${data.videos[i].name}`" @click="setArquivoSelecionado(j, i); deletePanel = true" icon="mdi-close" variant="text"/>
              <RenomearVideos :index="i" :nome-arquivo="getArquivoNome(arquivo.name)" @renomear="renomearArquivo"/>
            </div>
          </div>
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
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

    <v-dialog v-model="videoPanel">
      <v-card>
        <v-card-title style="padding-top: 40px" :title="arquivoSelecionado">
          {{arquivoSelecionado}}
          <v-btn @click="videoPanel = false" icon="mdi-close" variant="text" style="position: absolute; top: 0; right: 0"/>
        </v-card-title>
        <v-card-text>
          <div id="video" :style="$store.isMobile?'width: 100%':'width: 60%'" style="padding: 10px">
            <video @click="salvarHistorico" v-if="arquivoSelecionado" controls crossorigin="anonymous" width="100%">
              <source :src="`${$baseUrl}/animes/${arquivoSelecionado}`" type="video/mp4">
            </video>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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
    deletePanel: false,
    expansionPanelModel: null,
    videoPanel: false,
    lastVideo: null
  }),
  methods: {
    listarArquivos() {
      this.loading = true;
      this.arquivoSelecionado = null;
      this.removerBackgroundBtns();
      document.title = 'Play Animes';
      this.axios.get('video/listar').then((res) => {
        this.arquivos = res.data.arquivos;
        this.reorganizarArquivos();
      }).finally(() => {
        this.loading = false;
      });
    },
    selecionarVideo(dataIndex, index){
      this.arquivoSelecionado = this.arquivos[dataIndex].videos[index].name;
      document.title = this.arquivoSelecionado.replace('.mp4', '');
      let selecionado = document.querySelector(`#arquivo-${dataIndex}-${index}`);
      this.removerBackgroundBtns();
      selecionado.style.backgroundColor = 'rgb(200, 0, 0)';
      selecionado.style.color = 'white';
    },
    removerBackgroundBtns(){
      for (let j = 0; j < this.arquivos.length; j++) {
        for (let i = 0; i < this.arquivos[i].videos.length; i++) {
          let btn = document.querySelector(`#arquivo-${j}-${i}`);
          if(btn){
            btn.style.backgroundColor = '#b8b8b8';
            btn.style.color = '#343434';
          }
        }
      }
    },
    apagarArquivo(){
      const arquivoSelecionado = this.arquivos[this.arquivoSelecionadoIndex.j].videos[this.arquivoSelecionadoIndex.i].name;
      this.axios.delete(`video/apagar`, {
        data: {
          arquivo: arquivoSelecionado
        }
      }).then((res) => {
        if(res.data.apagar){
          this.arquivos[this.arquivoSelecionadoIndex.j].videos.splice(this.arquivoSelecionadoIndex.i, 1);
        }
      }).finally(() => {
        this.removerBackgroundBtns();
        this.arquivoSelecionado = null;
        this.deletePanel = false;
      })
    },
    setArquivoSelecionado(dataIndex, index){
      this.arquivoSelecionadoIndex = {j: dataIndex, i: index};
    },
    getArquivoNome(arquivo){
      return arquivo.replace('.mp4', '');
    },
    renomearArquivo(nomeArquivo, novoNome){
      for (let j = 0; j < this.arquivos.length; j++) {
        for (let i = 0; i < this.arquivos[j].videos.length; i++) {
          if(this.arquivos[j].videos[i].name === nomeArquivo){
            this.arquivos[j].videos[i].name = novoNome + '.mp4';
          }
        }
      }
    },
    reorganizarArquivos(){
      const listDates = new Set();
      const arrayDates = [];
      for (let i = 0; i < this.arquivos.length; i++) {
        listDates.add(this.arquivos[i].lastModified);
      }
      listDates.forEach((value) => {
        arrayDates.push(value);
      });
      arrayDates.sort((a, b) => new Date(a) - new Date(b));
      arrayDates.reverse();

      const listaVideos = [];

      for (let i = 0; i < arrayDates.length; i++) {
        let obj = {
          data: arrayDates[i],
          videos: []
        }
        for (let j = 0; j < this.arquivos.length; j++) {
          if(this.arquivos[j].lastModified === arrayDates[i]){
            obj.videos.push({
              name: this.arquivos[j].name,
              size: this.arquivos[j].size
            });
          }
        }
        listaVideos.push(obj);
      }

      this.arquivos = listaVideos;
    },
    getTitleExpansionPanel(oldTitle){
      const dataAtual = new Date();
      if(dataAtual.toISOString().slice(0, 10) === oldTitle){
        return 'Hoje';
      }

      const ontem = new Date(dataAtual.getTime() - (24 * 60 * 60 * 1000));
      if(ontem.toISOString().slice(0, 10) === oldTitle){
        return 'Ontem';
      }

      return oldTitle.split('-').reverse().join('/');
    },
    salvarHistorico(){
      if(this.arquivoSelecionado){
        this.lastVideo = String(this.arquivoSelecionado);
        window.localStorage.setItem('lastVideo', this.arquivoSelecionado);
      }
    }
  },
  mounted() {
    this.listarArquivos();
  },
  computed: {
    hasLastVideo(){
      return !!(this.lastVideo && this.lastVideo !== '');
    }
  },
  created() {
    this.lastVideo = window.localStorage.getItem('lastVideo');
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
