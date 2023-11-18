import { Reviews } from ".";
import { useEffect, useState } from "react";
import RangeSlider from 'react-bootstrap-range-slider';
import { useWeb5 } from "@/hooks/useWeb5";
import { DidReview } from "@/types/types";
import { Button, Container, Tooltip, OverlayTrigger, Modal, Form, Row, Spinner } from "react-bootstrap";
import didPilotReviewAPI from "@/api/didPilotReview";
import dwnConnectorAPI from "@/api/dwnConnector";

export function ReviewsPage () {
    const [modalShow, setModalShow] = useState(false);
    const [stars, setStars] = useState(3);
    const [subjectDid, setSubjectDid] = useState("");
    const [description, setDescription] = useState("");
    const {web5, userDid, web5Loading} = useWeb5();
    const [loading, setLoading] = useState(false);
    const [publishingLoading, setPublishingLoading] = useState(false);


    // get reviews from the DWN
    const [reviews, setReviews] = useState<DidReview[]>([]);

    const getReviewsFromDWN = async () => {
        if (web5 && userDid) {
            setLoading(true);
            const { reviews } = await didPilotReviewAPI.getReviewsByAuthor(web5, userDid);
            
            console.log("Results: ", reviews);
            
            setReviews(reviews);
            setLoading(false);
        } 
    }

    const handlePublish = async (event: React.FormEvent) => {
        event.preventDefault();
        if (web5 && userDid) {
            setPublishingLoading(true);

            const review = {
                subjectDid: subjectDid,
                stars: stars,
                description: description
            };
            const record = await didPilotReviewAPI.createReview(web5, review);
    
            // send data to the DWN instantly
            if (record) await dwnConnectorAPI.sendRecord(record, userDid);

            setPublishingLoading(false);
            setModalShow(false);
            getReviewsFromDWN();
        }
    }

    useEffect(() => {
        getReviewsFromDWN();
    }, [web5, userDid])
     
    return <> 
    <Container className="position-relative" fluid>
        <div  className="text-center">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews done by me.</Tooltip>}>
                <h1>Your Reviews</h1>
            </OverlayTrigger>
        </div>
        <Button className="my-2 position-absolute top-0 end-0" variant="outline-dark" onClick={() => {setModalShow(true); setStars(3);}}><i className="bi bi-plus-circle-fill"/></Button>

        <p className="text-center">Contribute to the network and write a review. Reviews that you wrote: </p>

        {!loading && !web5Loading ?
        <Reviews reviews={reviews}/>
        : 
        <Row className="justify-content-center mt-4">
            <Spinner animation="border" variant="warning"/>
        </Row>
        }
    </Container>
    
    <Modal show={modalShow} onHide={() => {setModalShow(false);}}>
        <Form onSubmit={handlePublish}>
            <Modal.Header closeButton>
                <Modal.Title>Add a review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="formDid">
                    <Form.Label><strong>DID subject</strong></Form.Label>
                    <Form.Control type="text" placeholder="Insert a DID" onChange={(e) => setSubjectDid(e.target.value)} required/>
                    <Form.Text className="text-muted">
                        Did of the subject of the review.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStars">
                    <Form.Label><strong>Stars</strong></Form.Label>
                    <RangeSlider
                        value={stars}
                        min={1} max={5}
                        onChange={(event)=>setStars(event.target.valueAsNumber)}
                        tooltipPlacement='bottom'
                        tooltip='on'
                        variant='warning'
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label><strong>Description</strong></Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={(e) => setDescription(e.target.value)} required/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="dark" type="submit">
                { publishingLoading ? <Spinner animation="border" variant="warning" size="sm"/> :"Publish review" }
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
    </>;
}