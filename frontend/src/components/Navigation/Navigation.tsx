import { useWeb5 } from "@/hooks/useWeb5";
import { removeCenterCharacter } from "@/utils";
import { Badge, Container, Nav, Navbar, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Navigation () {

    const {userDid} = useWeb5();

    return (
    <Navbar sticky="top" bg="dark" variant="dark" expand="md">
        <Container fluid>
            <Navbar.Brand as={Link} to="/"><i className="bi bi-bookmark-star-fill me-2"></i>DID Pilot</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                    <Nav.Link as={Link} to="/home" className='mx-2'>Home</Nav.Link>
                    <Nav.Link as={Link} to="/reviews" className='mx-2'>Reviews</Nav.Link>
                    <Nav.Link as={Link} to="/profile" className='mx-2'>Profile</Nav.Link>
                </Nav>  
            </Navbar.Collapse>
            <Nav className="justify-content-end">
                {userDid ?  <Badge bg="light" text="dark"> {removeCenterCharacter(userDid, 30)}</Badge> : <Spinner  size="sm" animation="border" variant="light" />}
            </Nav>
        </Container>
    </Navbar>
    );
}