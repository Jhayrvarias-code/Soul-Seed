import { api } from "../api/axios";

export interface Photo {
  _id: string;
  url: string;
  isAvatar: boolean;
}

export const uploadPhoto = async (file: File): Promise<Photo[]> => {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await api.post("/photos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.photos;
};

export const deletePhoto = async (photoId: string): Promise<Photo[]> => {
  const res = await api.delete(`/photos/${photoId}`);
  return res.data.photos;
};

export const setAvatar = async (photoId: string): Promise<Photo[]> => {
  const res = await api.patch(`/photos/avatar/${photoId}`);
  return res.data.photos;
};
