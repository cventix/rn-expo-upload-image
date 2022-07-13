import axios from 'axios';

export class UploadService {
  public static async uploadImage(imageURI: string) {
    const formData: FormData = new FormData();
    formData.append('image', imageURI);
    return axios.post('https://jsonplaceholder.typicode.com/posts', formData);
  }
}
