import React, { useState } from 'react';
import Post from './Post';
import EditPost from './EditPost';
import './PostList.css';

function PostList({ posts, onEditPost, onRemovePost, isModerator }) {
  const [editingPost, setEditingPost] = useState(null);

  return (
    <div className="post-list-container">
      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-row">
            <span className="post-title">{post.title}</span>
            {isModerator && (
              <div className="button-group">
                <button
                  className="edit-button"
                  onClick={() => setEditingPost(post)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => onRemovePost(post.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Render EditPost when a post is being edited */}
      {editingPost && (
        <EditPost
          post={editingPost}
          onEditPost={updatedPost => {
            onEditPost(updatedPost); // Update the post
            setEditingPost(null); // Close the editor
          }}
          setEditingPost={setEditingPost}
        />
      )}
    </div>
  );
}

export default PostList;
