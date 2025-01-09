import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET); // Replace with your Cloudinary upload preset

      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`, { // Replace with your Cloudinary URL
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      imageUrl = data.secure_url;
    }

    onEditPost({ ...post, title, content, imageUrl, imageComment });
    setEditingPost(null); // Close the edit form after saving
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
          maxLength="25" // Set max length for title
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Content"
          modules={{
            toolbar: [
              [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
              [{size: []}],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, 
               {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image', 'video'],
              ['clean']                                         
            ],
            clipboard: {
              matchVisual: false,
            },
          }}
          formats={[
            'header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image', 'video'
          ]}
          bounds={'.edit-post'}
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
          maxLength="50" // Set max length for image comment
        />
        <div className="button-group">
          <button type="submit">Save</button>
          <button type="button" className="cancel-button" onClick={() => setEditingPost(null)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;