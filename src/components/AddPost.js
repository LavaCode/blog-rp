import React, { useState, useRef } from 'react';
import './AddPost.css';
import axios from 'axios';

function AddPost({ onAddPost }) {
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageComment, setImageComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentLength, setContentLength] = useState(0);
  const contentRef = useRef(null); // Ref for contentEditable div

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = contentRef.current.innerText; // Get content from contentEditable

    if (!title || !content || !imageComment) {
      alert('All fields are required.');
      return;
    }

    setLoading(true);
    let imageUrl = '';
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
          formData
        );
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
    setImageFile(null);
    setImageComment('');
    setLoading(false);
    setContentLength(0); // Reset content length
  };

  // Handle content change with character limit
  const handleContentChange = () => {
    const content = contentRef.current.innerText;
    setContentLength(content.length);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  // Apply formatting to contentEditable
  const applyFormatting = (command, value = null) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0); // Get the current range

    document.execCommand(command, false, value); // Apply formatting command

    // After formatting, restore the selection to the same position
    const newRange = document.createRange();
    newRange.setStart(range.startContainer, range.startOffset);
    newRange.setEnd(range.endContainer, range.endOffset);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };

  return (
    <div className="add-post">
      <h2>Add Post</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          maxLength="25"
          required
        />
        
        {/* Toolbar */}
        <div className="toolbar">
          <button type="button" onClick={() => applyFormatting('bold')}>B</button>
          <button type="button" onClick={() => applyFormatting('italic')}>I</button>
          <button type="button" onClick={() => applyFormatting('underline')}>U</button>
        </div>

        {/* ContentEditable Field */}
        <div
          contentEditable
          ref={contentRef}
          className="content-editable"
          onInput={handleContentChange}
          placeholder="Content (max 250 characters)"
          spellCheck="true"
        >
          {/* content will be handled via DOM */}
        </div>
        <div className="content-length">
          {contentLength}/250
        </div>

        {/* File Input */}
        <label htmlFor="file-input" className="file-label">
          Attach File
        </label>
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          required
        />
        {imageFile && <p className="file-name">Attached: {imageFile.name}</p>}

        {/* Image Comment Input */}
        <input
          type="text"
          value={imageComment}
          onChange={(e) => setImageComment(e.target.value)}
          placeholder="Image Comment"
          maxLength="50"
          required
        />
        
        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Add Post'}
        </button>
      </form>
    </div>
  );
}

export default AddPost;
