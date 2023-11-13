import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import { Review } from ".";
import Tooltip from "react-bootstrap/esm/Tooltip";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Modal from "react-bootstrap/esm/Modal";
import { useState } from "react";
import Form from "react-bootstrap/esm/Form";
import RangeSlider from 'react-bootstrap-range-slider';

export function Reviews () {
    // const columnsPerRow = 2;
    const [modalShow, setModalShow] = useState(false);
    const [stars, setStars] = useState(3);

    return <> 
    <Container className="position-relative" fluid>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews done by me.</Tooltip>}>
            <h1 className="text-center">Reviews</h1>
        </OverlayTrigger>
        <Button className="my-2 position-absolute top-0 end-0" variant="outline-dark" onClick={() => {setModalShow(true); setStars(3);}}><i className="bi bi-plus-circle-fill"/></Button>
        {/* <Row md={columnsPerRow}> 
            {
                reviews.map((review, index) => (
                    <Col key={index}><Review key={index} review={review} /></Col>  
                ))
            }
        </Row> */}
        <Review didSubject={"did:xyz:example"} stars={4} description={"Hello"}/>
    </Container>
    
    <Modal show={modalShow} onHide={() => {setModalShow(false);}}>
        <Form>
            <Modal.Header closeButton>
                <Modal.Title>Add a review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="formDid">
                    <Form.Label><strong>DID subject</strong></Form.Label>
                    <Form.Control type="text" placeholder="Insert a DID" />
                    <Form.Text className="text-muted">
                        Did of the subject of the review.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStars">
                    <Form.Label><strong>Stars</strong></Form.Label>
                    <RangeSlider
                        value={stars}
                        min={0} max={5}
                        onChange={(event)=>setStars(event.target.valueAsNumber)}
                        tooltipPlacement='bottom'
                        tooltip='on'
                        variant='warning'
                    />
                </Form.Group>

            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="dark">Publish review</Button>
            </Modal.Footer>
        </Form>
    </Modal>
    </>;
}