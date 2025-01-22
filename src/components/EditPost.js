import React, { useState } from 'react';
import './EditPost.css';

function EditPost({ post, onEditPost, setEditingPost }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageFile, setImageFile] = useState(null);
  const [imageComment, setImageComment] = useState(post.imageComment || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = post.imageUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append(
        'upload_preset',
        process.env.REACT_APP_CLOUDINARY_PRESET
      );

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );
        const data = await response.json();
        imageUrl = data.secure_url;
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    const updatedPost = {
      ...post,
      title,
      content,
      imageUrl,
      imageComment,
    };

    onEditPost(updatedPost);
  };

  return (
    <div className="edit-post">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <input
          type="text"
          value={imageComment}
          onChange={(e) => setImageComment(e.target.value)}
          placeholder="Image Comment"
        />
        <div className="button-group">
          <button type="submit">Save</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setEditingPost(null)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
