<template>
  <v-btn :title="$props.nomeArquivo" @click="abrirRenomearDialog" icon="mdi-pencil" variant="text" color="info"/>
  <v-dialog :model-value="dialog" persistent width="auto">
    <v-card width="300px">
      <v-card-title>
        <span class="text-h5">Renomear arquivo</span>
        <v-btn :disabled="loading" @click="closeRenomearDialog" style="position: absolute; top: 0; right: 0" icon="mdi-close" variant="text"/>
      </v-card-title>
      <v-card-text>
        <v-text-field :disabled="loading" v-model="novoNome" label="Novo nome" variant="outlined" autofocus/>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="loading" @click="closeRenomearDialog" color="info" prepend-icon="mdi-cancel">Cancelar</v-btn>
        <v-spacer/>
        <v-btn @click="renomearArquivo" :loading="loading" color="success" append-icon="mdi-content-save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "RenomearVideos",
  data: () => ({
    dialog: false,
    loading: false,
    novoNome: '',
    txtField: null
  }),
  methods: {
    closeRenomearDialog(){
      this.dialog = false;
      this.novoNome = '';
    },
    abrirRenomearDialog(){
      this.dialog = true;
      this.novoNome = this.$props.nomeArquivo;
    },
    renomearArquivo(){
      this.loading = true;
      this.axios.put('video/renomear', {
        nomeArquivo: this.$props.nomeArquivo + '.mp4',
        novoNome: this.novoNome
      }).then((res) => {
        if(res.data.renomear){
          this.$emit('renomear', this.$props.nomeArquivo + '.mp4', this.novoNome);
          this.closeRenomearDialog();
        }
      }).catch((e) => {
        console.log(e);
      }).finally(() => {
        this.loading = false;
      });
    }
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    nomeArquivo: {
      type: String,
      required: true
    }
  },
  emits: ['renomear']
}
</script>

<style scoped>

</style>