import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { uploadPhoto, deletePhoto, setAvatar } from "@/services/photoService";

import { updateUserProfile } from "@/services/userService";
import { cn } from "@/utils/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  user: any;
  onSuccess: (updatedUser: any) => void;
}

const ALL_INTERESTS = [
  "Coding",
  "Music",
  "Travel",
  "Gaming",
  "Fitness",
  "Movies",
  "Reading",
  "Food",
  "Photography",
  "Sports",
];

const MAX_BIO_LENGTH = 150;

export default function EditProfileModal({
  open,
  onClose,
  user,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    interests: [] as string[],
  });

  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Sync user data
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        interests: user.interests || [],
      });

      setPhotos(user.photos || []);
    }
  }, [user]);

  // Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "bio") {
      if (value.length > MAX_BIO_LENGTH) return; // block overflow
    }

    setForm({ ...form, [name]: value });
  };

  // Upload photo
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const updatedPhotos = await uploadPhoto(file);
      setPhotos(updatedPhotos);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  // Delete photo
  const handleDelete = async (photoId: string) => {
    try {
      const updatedPhotos = await deletePhoto(photoId);
      setPhotos(updatedPhotos);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Set avatar
  const handleSetAvatar = async (photoId: string) => {
    try {
      const updatedPhotos = await setAvatar(photoId);
      setPhotos(updatedPhotos);

      onSuccess({
        ...user,
        photos: updatedPhotos,
      });
    } catch (err) {
      console.error("Avatar update failed", err);
    }
  };

  // Toggle interest
  const handleToggleInterest = (interest: string) => {
    const isSelected = form.interests.includes(interest);

    if (isSelected) {
      // REMOVE
      setForm({
        ...form,
        interests: form.interests.filter((i) => i !== interest),
      });
    } else {
      // LIMIT CHECK
      if (form.interests.length >= 5) {
        alert("You can only select up to 5 interests");
        return;
      }

      // ADD
      setForm({
        ...form,
        interests: [...form.interests, interest],
      });
    }
  };

  // Submit
  const handleSubmit = async () => {
    try {
      const updatedUser = await updateUserProfile({
        ...form,
        interests: form.interests,
      });

      onSuccess({
        ...updatedUser,
        photos, // ensure UI sync
      });

      onClose();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl bg-background dark:bg-brand-tertiary text-brand-foreground">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        {/* PHOTO GRID */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-black dark:text-white">
            Photos
          </p>

          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div
                key={photo._id}
                className="relative group rounded-lg overflow-hidden"
              >
                <img src={photo.url} className="h-24 w-full object-cover" />

                {/* Avatar badge */}
                {photo.isAvatar && (
                  <span className="absolute bottom-1 left-1 text-xs bg-black text-white px-1 rounded">
                    Main
                  </span>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-1 transition">
                  <button
                    onClick={() => handleSetAvatar(photo._id)}
                    className="text-xs bg-white rounded px-1"
                  >
                    Set Main
                  </button>

                  <button
                    onClick={() => handleDelete(photo._id)}
                    className="text-xs bg-red-500 text-white rounded px-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {/* Upload Slot */}
            <label className="h-24 flex items-center justify-center border-2 border-solid rounded-lg cursor-pointer text-black dark:text-white">
              {uploading ? "Uploading..." : "Add Photo"}
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-3 mt-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="First Name"
          />

          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Last Name"
          />
          <div className="space-y-1">
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell something about yourself..."
              rows={3}
              className="w-full border p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Select Interests (max 5)
              </p>
              {/* Character Counter */}
              <div className="text-right text-xs text-gray-500">
                {form.bio.length}/{MAX_BIO_LENGTH}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map((interest) => {
                const isSelected = form.interests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted/60 text-foreground hover:bg-muted",
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-gray-500">
              {form.interests.length}/5 selected
            </p>
          </div>
        </div>

        <Button className="w-full mt-4" onClick={handleSubmit}>
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
