import React from 'react';
import './Post.css';

function Post({ post, setEditingPost, onRemovePost, isModerator }) {
  return (
    <div className="post">
      {isModerator && (
        <div className="button-overlay">
          <button className="edit-button" onClick={() => setEditingPost(post)}>
            Edit
          </button>
          <button className="delete-button" onClick={() => onRemovePost(post.id)}>
            Delete
          </button>
        </div>
      )}
      <h2 className="post-title">{post.title}</h2>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      {post.imageUrl && (
        <div className="post-image">
          <img src={post.imageUrl} alt={post.title} />
          {post.imageComment && (
            <p className="image-comment">{post.imageComment}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Post;