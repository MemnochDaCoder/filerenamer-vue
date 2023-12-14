import { createStore } from 'vuex';

export default createStore({
  state: {
    incomingDirectory: '',
    destinationDirectory: '',
    proposedFileNames: [],
    confirmedChanges: []
  },
  mutations: {
    setDirectories(state, { incoming, destination }) {
      state.incomingDirectory = incoming;
      state.destinationDirectory = destination;
    },
    setProposedFileNames(state, fileNames) {
      state.proposedFileNames = fileNames;
    },
    setConfirmedChanges(state, changes) {
      state.confirmedChanges = changes;
    },
    resetState(state) {
      state.proposedFileNames = [];
      state.confirmedChanges = [];
    }
  }
});
