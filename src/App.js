import React, { useState, useEffect } from 'react';
import './App.css';
import PostList from './components/PostList';
import AddPost from './components/AddPost';
import Ticker from './components/Ticker';
import Post from './components/Post'; // Import the Post component
import Parse from 'parse/dist/parse.min.js';

Parse.initialize(process.env.REACT_APP_BACK4APP_APP_ID, process.env.REACT_APP_BACK4APP_REST_API_KEY); 
Parse.serverURL = "https://parseapi.back4app.com/";

function App() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isModerator, setIsModerator] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const Post = Parse.Object.extend('Post');
      const query = new Parse.Query(Post);
      try {
        const results = await query.find();
        const parsedPosts = results.map(post => ({
          id: post.id,
          title: post.get('title'),
          content: post.get('content'),
          imageUrl: post.get('imageUrl'),
          imageComment: post.get('imageComment'),
        }));
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Error while fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 1) {
      const interval = setInterval(() => {
        setCurrentPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [posts]);

  const handleLogin = () => {
    const storedUsername = process.env.REACT_APP_USERNAME;
    const storedPassword = process.env.REACT_APP_PASSWORD;

    setUsername('');
    setPassword('');

    if (username === storedUsername && password === storedPassword) {
      setIsModerator(true);
      setShowLoginModal(false);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleAddPost = async (post) => {
    const Post = Parse.Object.extend('Post');
    const newPost = new Post();
    newPost.set('title', post.title);
    newPost.set('content', post.content);
    newPost.set('imageUrl', post.imageUrl);
    newPost.set('imageComment', post.imageComment);

    try {
      const result = await newPost.save();
      setPosts([...posts, { id: result.id, ...post }]);
    } catch (error) {
      console.error('Error while adding post:', error);
    }
  };

  const handleEditPost = async (updatedPost) => {
    const Post = Parse.Object.extend('Post');
    const query = new Parse.Query(Post);

    try {
      const post = await query.get(updatedPost.id);
      post.set('title', updatedPost.title);
      post.set('content', updatedPost.content);
      post.set('imageUrl', updatedPost.imageUrl);
      post.set('imageComment', updatedPost.imageComment);

      const result = await post.save();
      setPosts(posts.map(p => (p.id === updatedPost.id ? { id: result.id, ...updatedPost } : p)));
      setEditingPost(null);
    } catch (error) {
      console.error('Error while editing post:', error);
    }
  };

  const handleRemovePost = async (id) => {
    const Post = Parse.Object.extend('Post');
    const query = new Parse.Query(Post);

    try {
      const post = await query.get(id);
      await post.destroy();
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error while removing post:', error);
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        RAPENBURG PLAZA
        {isModerator && (
          <button className="logout-button" onClick={() => setIsModerator(false)}>
            Logout
          </button>
        )}
      </div>
      <div className="sub-header">
        NEWS BOARD
      </div>
      <div className="main-content">
        {isModerator ? (
          <>
            <div className="add-post-container">
              <AddPost onAddPost={handleAddPost} />
            </div>
            <div className="post-container logged-in">
              <PostList
                posts={posts}
                setEditingPost={setEditingPost}
                onEditPost={handleEditPost}
                onRemovePost={handleRemovePost}
                isModerator={isModerator}
              />
            </div>
          </>
        ) : (
          posts.length > 0 && (
            <div className="post-container">
              <Post
                post={posts[currentPostIndex]}
                setEditingPost={setEditingPost}
                onRemovePost={() => { }}
                isModerator={isModerator}
              />
            </div>
          )
        )}
      </div>

      {showLoginModal && !isModerator && (
        <div className="modal">
          <div className="modal-content">
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => setShowLoginModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="ticker-container">
        <Ticker onClick={!isModerator ? () => setShowLoginModal(true) : null} />  
      </div>
    </div>
  );
}

export default App;