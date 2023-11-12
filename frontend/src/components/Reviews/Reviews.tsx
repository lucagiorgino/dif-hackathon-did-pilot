import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Review } from ".";
import Tooltip from "react-bootstrap/esm/Tooltip";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";

export function Reviews () {
    return <> 
    <Container className="position-relative" fluid>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews done by me.</Tooltip>}>
            <h1 className="text-center">Reviews</h1>
        </OverlayTrigger>
        <Button className="my-2 position-absolute top-0 end-0" variant="outline-dark"><i className="bi bi-plus-circle-fill"/></Button>
        <Review didSubject={"did:xyz:example"} stars={4} description={"Hello"}/>
    </Container>
    </>;
}