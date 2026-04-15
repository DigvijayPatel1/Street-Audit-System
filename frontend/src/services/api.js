import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const respons = await API.post("/predict", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return respons.data;
}