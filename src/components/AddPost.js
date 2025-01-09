import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AddPost.css';
import axios from 'axios';

function AddPost({ onAddPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageComment, setImageComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentLength, setContentLength] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !imageComment) {
      alert('All fields are required.');
      return;
    }
    setLoading(true);
    let imageUrl = '';
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET); // Use environment variable for Cloudinary upload preset
      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
          formData
        ); // Use environment variable for Cloudinary URL
        imageUrl = response.data.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please check your Cloudinary credentials.');
        setLoading(false);
        return;
      }
    }
    onAddPost({ title, content, imageUrl, imageComment });
    setTitle('');
    setContent('');
    setImageFile(null);
    setImageComment('');
    setLoading(false);
  };

  const handleContentChange = (value) => {
    setContent(value);
    setContentLength(value.replace(/<[^>]*>/g, '').length); // Remove HTML tags and count characters
  };

  return (
    <div className="add-post">
      <h2>Add Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          maxLength="25" // Set max length for title
          required
        />
        <ReactQuill
          value={content}
          onChange={handleContentChange}
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
          bounds={'.add-post'}
        />
        <div className="content-length">
          {contentLength}/250
        </div>
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />
        <input
          type="text"
          value={imageComment}
          onChange={(e) => setImageComment(e.target.value)}
          placeholder="Image Comment"
          maxLength="50" // Set max length for image comment
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Add Post'}
        </button>
      </form>
    </div>
  );
}

export default AddPost;