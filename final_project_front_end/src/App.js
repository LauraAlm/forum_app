import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LogInPage from './pages/LogInPage';
import AuthPage from './pages/AuthPage';
import { Restore } from './pages/RestorePassword';
import ForumPage from './pages/ForumPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import CategoryCreationPage from './pages/CategoryCreationPage';
import SubcategoryListPage from './pages/SubcategoryListPage';
import SubcategoryCreationPage from './pages/SubcategoryCreationPage';
import SubcategoryPage from './pages/SubcategoryPage';

function App() {
  return (
    <div className='p-50'>
      <BrowserRouter>
        <Routes>
          <Route index element={<AuthPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LogInPage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/restorePassword' element={<Restore />} />

          <Route
            path='/forum/:categoryTitle/:subcategoryId'
            element={<SubcategoryPage />}
          />
          <Route
            path='/forum/:categoryTitle'
            element={<SubcategoryListPage />}
          />
          <Route path='/forum' element={<ForumPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/chat' element={<ChatPage />} />

          <Route path='/createCategory' element={<CategoryCreationPage />} />
          <Route
            path='/createSubcategory/:categoryTitle'
            element={<SubcategoryCreationPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
