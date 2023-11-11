import './App.css';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

// Hooks:
import { AuthContextProvider, useAuth } from '@/hooks/useAuth';

// Components: 
import { Home, Navigation, Landing, Reviewer, Subject } from '@/components';

import { fn } from '@/api/web5API';


function Layout() { // TODO: create a sidebar
  return (
    <>
        <AuthContextProvider>
            <Navigation/>
              <h1 className="text-3xl font-bold underline">
                Hello world!
                <button onClick={fn}></button>
              </h1>           
              <Outlet /> {/* 2️⃣ Render the app routes via the Layout Outlet */}
        </AuthContextProvider>
    </>
  );
}

const ProtectedRoute = (props: {redirectPath: string,  children?: any}) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={props.redirectPath} replace />;
  }

  return props.children ? props.children : <Outlet />;
};

function App() {
  const router = createBrowserRouter([  // 🆕
    { element: <Layout/>,  /* 1️⃣ Wrap your routes in a pathless layout route */
      children: [
        { path: "/", Component: Landing }, 
        { path: "/home", Component: Home }, 
        { path: "/reviewer", Component: Reviewer },
        { path: "/subject", Component: Subject },
        // { element: <ProtectedRoute redirectPath="/" />,
        //   children: [
        //     { path: "/some-protected-route", element: <SomeProtectedComponent> },
        //   ]
        // },
      ]
    },
    { path:"*", Component: () => <h1>404</h1> }
  ]);

  return <RouterProvider router={router} />;
} 

export default App;
