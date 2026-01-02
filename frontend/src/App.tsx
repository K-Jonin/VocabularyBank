import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/login/Login';
import { Error } from './pages/error/Error';
import { NotFound } from './pages/error/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* レイアウトなしのルート */}
        <Route path='/error' element={<Error />} />
        <Route path='/404' element={<NotFound />} />

        {/* レイアウトありのルート */}
        <Route
          path='/*'
          element={
            <Layout>
              <Routes>
                {/* ログインページ: ログイン済みの場合は単語リストへリダイレクト */}
                <Route
                  path='/login'
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />

                <Route
                  path='/'
                  element={
                    <ProtectedRoute>
                      <></>
                    </ProtectedRoute>
                  }
                />

                <Route path='*' element={<Navigate to='/404' replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
