import { Routes, Route } from 'react-router-dom';
import './App.css';
import BlogFeed from './pages/blog/blog-feed';
import Login from './pages/auth/login';
// import SignUp from './pages/auth/signup';
import { useAuthStore } from './store/auth';
import AddBlog from './pages/blog/add-blog';


function App() {
  const isAuth = useAuthStore(state => state.isAuth);

  if (isAuth) {
    return (
      <Routes>
        <Route path="/" element={<BlogFeed />} />
        <Route path="/add-blog" element={<AddBlog />} />
        <Route path="/edit-blog" element={<AddBlog />} />
        <Route path="*" element={<BlogFeed />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/signup" element={<SignUp />} /> */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
