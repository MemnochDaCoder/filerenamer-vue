import axios from 'axios';

const API_URL = 'http://localhost:5114';

export default {
  getProposedFileNames(sourceDirectory, destinationDirectory) {
    return axios.get(`${API_URL}/RenameFiles/GetProposedFilenames`, {
      params: { sourceDirectory: sourceDirectory, destinationDirectory: destinationDirectory }
    });
  },
  executeRenaming(changes) {
    return axios.post(`${API_URL}/RenameFiles/ExecuteRenaming`, changes);
  }
};
