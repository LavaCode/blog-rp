import React from 'react';
import './PostList.css';

function PostList({ posts, setEditingPost, onRemovePost, isModerator }) {
  return (
    <div className="post-list-container">
      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-row">
            <span className="post-title">{post.title}</span>
            {isModerator && (
              <div className="button-group">
                <button className="edit-button" onClick={() => setEditingPost(post)}>Edit</button>
                <button className="delete-button" onClick={() => onRemovePost(post.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;