import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

// Hooks:
// import { AuthContextProvider } from '@/hooks/useAuth';
import { Web5ContextProvider } from '@/hooks/useWeb5';

// Components: 
import { Home, Navigation, Landing, ReviewsPage, Profile, Error } from '@/components';

// import { fn } from '@/api/web5API';
import { ErrContextProvider } from './hooks/useError';
import { Col, Container, Row } from 'react-bootstrap';


function Layout() {
  return (
    <>
      <ErrContextProvider>
      <Web5ContextProvider>
      {/* <AuthContextProvider> */}
        <Navigation/> 
        <Container className="mt-2 h-100" fluid>
          <Row className="justify-content-center">
            <Col md={6}>
                <Outlet /> {/* 2️⃣ Render the app routes via the Layout Outlet */}
            </Col>
          </Row>
          <Row className="fixed-bottom">
            <Col className="mx-4 mb-2"><Error/></Col>
          </Row>
        </Container>  
      {/* </AuthContextProvider> */}
      </Web5ContextProvider>
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
        { path: "/reviews", Component: ReviewsPage },
        { path: "/profile", Component: Profile },
        // { element: <ProtectedRoute redirectPath="/" />,
        //   children: [
        //     { path: "/some-protected-route", element: <SomeProtectedComponent> },
        //   ]
        // },
      ]
    },
    { path:"*", Component: () => <h1 className='position-absolute top-50 start-50 translate-middle'>404 Page not Found</h1> }
  ]);

  return <RouterProvider router={router} />;
} 

export default App;
