<template>
  <div class="vh-100 d-flex justify-content-center align-items-center bg-dark">
    <div class="col-md-4 bg-white p-4 rounded d-flex flex-column" style="max-height: 80vh;">
      <div v-if="!showExecuteButton">
        <div class="mb-3">
          <input type="text" class="form-control" v-model="incomingDirectory" placeholder="Incoming Directory" />
        </div>
        <div class="mb-3">
          <input type="text" class="form-control" v-model="destinationDirectory" placeholder="Destination Directory" />
        </div>
        <button class="btn btn-dark mb-3" @click="submitDirectories" :disabled="!canSubmit">Submit</button>
      </div>
      <!-- Scrollable area for file names -->
      <div class="mb-3" style="flex-grow: 1; border: 1px; font-size: 12px; line-height: 18px; overflow: auto;"
        v-show="showFileNames">
        <div v-for="(name, index) in editableFileNames" :key="index" class="mb-2">
          <input type="text" class="form-control" v-model="editableFileNames[index].proposedFileName" />
        </div>
      </div>
      <button class="btn btn-dark" @click="executeRenaming" v-if="showExecuteButton">Execute Renaming</button>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ApiService from './Api/api';

export default {
  data() {
    return {
      incomingDirectory: '',
      destinationDirectory: '',
      editableFileNames: [],
      showFileNames: false
    };
  },
  computed: {
    ...mapState(['proposedFileNames']),
    canSubmit() {
      return this.incomingDirectory.trim() && this.destinationDirectory.trim();
    },
    showExecuteButton() {
      return this.showFileNames;
    }
  },
  methods: {
    ...mapMutations(['setDirectories', 'setProposedFileNames', 'setConfirmedChanges']),

    submitDirectories() {
      this.setDirectories({
        incoming: this.incomingDirectory,
        destination: this.destinationDirectory
      });

      ApiService.getProposedFileNames(this.incomingDirectory, this.destinationDirectory)
        .then(response => {
          this.editableFileNames = response.data.map(item => ({ ...item }));
          this.showFileNames = true;
        })
        .catch(error => {
          console.error('API error:', error.response.data);
        });
    },
    executeRenaming() {
      const changes = this.editableFileNames.map(item => {
        const originalFullPath = `${this.incomingDirectory}\\${item.originalFileName}`;
        const newFullPath = `${this.destinationDirectory}\\${item.proposedFileName}`;

        return {
          OriginalFilePath: originalFullPath,
          NewFilePath: newFullPath,
          OriginalFileName: item.originalFileName,
          NewFileName: item.proposedFileName
        };
      });

      this.setConfirmedChanges(changes);

      ApiService.executeRenaming(changes)
        .then(response => {
          console.log('Renaming executed successfully', response);
          this.showFileNames = false;
          this.$store.commit('resetState');
        })
        .catch(error => {
          console.error('Error executing renaming', error);
        });
    }
  }
};
</script>

<style>
body {
  background-color: black;
  font-size: small;
}
</style>
