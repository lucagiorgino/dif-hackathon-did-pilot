import { Reviews } from ".";
import { useEffect, useState } from "react";
import RangeSlider from 'react-bootstrap-range-slider';
import { useWeb5 } from "@/hooks/useWeb5";
import API from "@/api/didPilot";
import { DidReview } from "@/types/types";
import { Button, Container, Tooltip, OverlayTrigger, Modal, Form, Row, Spinner } from "react-bootstrap";

export function ReviewsPage () {
    const [modalShow, setModalShow] = useState(false);
    const [stars, setStars] = useState(3);
    const [subjectDid, setSubjectDid] = useState("");
    const [description, setDescription] = useState("");
    const {web5, userDid} = useWeb5();
    const [loading, setLoading] = useState(false);

    // get reviews from the DWN
    const [reviews, setReviews] = useState<DidReview[]>([]);

    const getReviewsFromDWN = async () => {
        if (web5 && userDid) {
            setLoading(true);
            const { parsedRecords, records } = await API.queryRecordsDWN(
                web5,
                {
                    from: userDid,
                    message: {
                        filter: {
                            dataFormat: "application/json",
                        }
                    }
                }
            );
            console.log("reviews: ", parsedRecords);
            console.log("records: ", records);
            if (parsedRecords)
                setReviews(parsedRecords);
            setLoading(false);
        } 
    }

    const handlePublish = async () => {
        if (web5 && userDid) {
            setLoading(true);
            const record = await API.writeDWN(
                web5, 
                {
                    subjectDid: subjectDid,
                    stars: stars,
                    description: description
                }
            )

            // send data to the DWN instantly
            await API.sendRecordDWN(record!, userDid)

            console.log("record data: ", await record?.data.json())
            console.log("record author: ", record?.author)
            setLoading(false);
        }
    }

    useEffect(() => {
        getReviewsFromDWN();
    }, [web5, userDid])
     
    return <> 
    <Container className="position-relative" fluid>
        <p  className="text-center">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews done by me.</Tooltip>}>
                <h1>Your Reviews</h1>
            </OverlayTrigger>
        </p>
        <Button className="my-2 position-absolute top-0 end-0" variant="outline-dark" onClick={() => {setModalShow(true); setStars(3);}}><i className="bi bi-plus-circle-fill"/></Button>

        <p className="text-center">Contribute to the network and write a review. Reviews that you wrote: </p>

        {!loading ?
        <Reviews reviews={reviews}/>
        : 
        <Row className="justify-content-center mt-4">
            <Spinner animation="border" variant="warning"/>
        </Row>
        }
    </Container>
    
    <Modal show={modalShow} onHide={() => {setModalShow(false);}}>
        <Form>
            <Modal.Header closeButton>
                <Modal.Title>Add a review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="formDid">
                    <Form.Label><strong>DID subject</strong></Form.Label>
                    <Form.Control type="text" placeholder="Insert a DID" onChange={(e) => setSubjectDid(e.target.value)} />
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
                    <Form.Control as="textarea" rows={3} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="dark" onClick={
                    () => {
                        handlePublish()
                            .then(() => {
                                setModalShow(false);
                                getReviewsFromDWN();
                            })
                    }
                }>
                    Publish review
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
    </>;
}