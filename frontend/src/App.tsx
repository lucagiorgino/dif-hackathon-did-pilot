import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

// Hooks:
import { AuthContextProvider, useAuth } from '@/hooks/useAuth';

// Components: 
import { Home, Navigation, Landing, Reviews, Profile, Error } from '@/components';

import { fn } from '@/api/web5API';
import { ErrContextProvider } from './hooks/useError';
import { Col, Container, Row } from 'react-bootstrap';


function Layout() { // TODO: create a sidebar
  return (
    <>
      <ErrContextProvider>
      <AuthContextProvider>
        <Navigation/> 
        <Container className="mt-2" fluid>
            <Row className="justify-content-md-center">
              <Col sm={4} md={6}>
                  <Outlet /> {/* 2️⃣ Render the app routes via the Layout Outlet */}
              </Col>
            </Row>
          <Row className="fixed-bottom">
            <Col className="mx-4 mb-2"><Error/></Col>
          </Row>
        </Container>  
      </AuthContextProvider>
      </ErrContextProvider>
    </>
  );
}

// const ProtectedRoute = (props: {redirectPath: string,  children?: any}) => {
//   const { isAuthenticated } = useAuth();
//   if (!isAuthenticated) {
//     return <Navigate to={props.redirectPath} replace />;
//   }

//   return props.children ? props.children : <Outlet />;
// };

function App() {
  const router = createBrowserRouter([  // 🆕
    { element: <Layout/>,  /* 1️⃣ Wrap your routes in a pathless layout route */
      children: [
        { path: "/", Component: Landing }, 
        { path: "/home", Component: Home }, 
        { path: "/reviews", Component: Reviews },
        { path: "/profile", Component: Profile },
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
