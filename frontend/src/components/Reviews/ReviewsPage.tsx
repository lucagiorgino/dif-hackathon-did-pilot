import { Interaction, Reviews } from ".";
import { useEffect, useState } from "react";
import { useWeb5 } from "@/hooks/useWeb5";
import { DidInteraction, ReviewTuple } from "@/types/types";
import { Container, Tooltip, OverlayTrigger, Row, Spinner, Button, Modal, Form, Alert, Badge } from "react-bootstrap";
import didPilotTEDReviewAPI from "@/api/didPilotTEDReview";
import { useError } from "@/hooks/useError";

export function ReviewsPage () {
    
    const {web5, userDid, web5Loading} = useWeb5();
    const {setError} = useError();

    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [proof, setProof] = useState("stub_proof");
    const [recipientDid, setRecipientDid] = useState("");
    const [publishingLoading, setPublishingLoading] = useState(false);
    const [interactionsLoading, setInteractionsLoading] = useState(false);


    // get reviews from the DWN
    const [reviews, setReviews] = useState<ReviewTuple[]>([]);
    const [interactions, setInteractions] = useState<DidInteraction[]>([]);

    const handlePublish = async (event: React.FormEvent) => {
        event.preventDefault();

        if (web5 && userDid) {
            setPublishingLoading(true);

            try {
                const {record, interaction} = await didPilotTEDReviewAPI.createInteraction(web5, recipientDid, proof);
                console.log("Interaction: ", interaction);
                console.log("Record", record);
            } catch (err) {
                if (err instanceof Error) setError(err);
            }
            
            setPublishingLoading(false);
            setModalShow(false);
            setTrigger(!trigger);
        }
    }

    useEffect(() => {

        const getPendingInteractionsFromDWN = async () => {
            if (web5 && userDid) {
                setInteractionsLoading(true);
                const interactions = await didPilotTEDReviewAPI.getPendingInteractions(web5, userDid);
                // console.log("Interactions: ", interactions);

                setInteractions(interactions);
                setInteractionsLoading(false);
            } 
        }

        const getReviewsFromDWN = async () => {
            if (web5 && userDid) {
                setLoading(true);
                const { teds: tedReviews } = await didPilotTEDReviewAPI.getTEDReviewsByAuthor(web5, userDid);
                
                const reviews: ReviewTuple[] = [];
                for(const tedReview of tedReviews) {
                    const r = didPilotTEDReviewAPI.extractReviewFromTED(tedReview, userDid);
                    if (r) {
                        reviews.push({ted: tedReview, review: r});
                    } else {
                        console.log("Err", r);
                    }
                }
                
                setReviews(reviews);
                setLoading(false);
            } 
        }

        getPendingInteractionsFromDWN();
        getReviewsFromDWN();
    }, [trigger, web5, userDid])
     
    return <> 
    <Container className="position-relative" fluid>
        <div  className="text-center">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews done by me.</Tooltip>}>
                <h1>Your Reviews</h1>
            </OverlayTrigger>
        </div>
        <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="button-tooltip">Create a stub interaction!</Tooltip>}
        >
            <Button className="my-2 position-absolute top-0 end-0" variant="outline-danger" onClick={() => {setModalShow(true);}}>
                <i className="bi bi-plus-circle-fill"/>
            </Button>
        </OverlayTrigger>
        <Row>
            <h4 className="my-auto">Pending interactions <Badge bg="warning" text="dark">{interactions.length}</Badge></h4>
            <Row className="mb-5 p-2 g-2 flex-row flex-nowrap shadow bg-body rounded"
                style={{overflowX: "auto"}}
            >   {!interactionsLoading ?
                <>{interactions.length>0 && interactions.map((interaction, index) => (
                    <Interaction
                        key={index} 
                        interaction={interaction}
                        trigger={trigger}
                        setTrigger={setTrigger}
                    />
                ))}</>
                :
                <Row className="justify-content-center">
                    <Spinner animation="border" variant="warning"/>
                </Row>}
            </Row>
        </Row>

        <h4 className="my-auto">Reviews</h4>
        <p className="text-center">Contribute to the network and write a review. Reviews that you wrote: </p>

        {!loading && !web5Loading ?
        <><Reviews reviews={reviews} /></>
        : 
        <Row className="justify-content-center mt-4">
            <Spinner animation="border" variant="warning"/>
        </Row>
        }
    </Container>
    
    <Modal show={modalShow} onHide={() => {setModalShow(false);}}>
        <Form onSubmit={handlePublish}>
        <Modal.Header closeButton>
                <Modal.Title>Add a stub interaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="formDid">
                    <Form.Label><strong>DID recipient</strong></Form.Label>
                    <Form.Control type="text" placeholder="Insert a DID" onChange={(e) => setRecipientDid(e.target.value)} />
                    <Form.Text className="text-muted">
                        Did of the other party of the interaction.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formProof">
                    <Form.Label><strong>Interaction proof</strong></Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Insert the proof" value={proof} onChange={(e) => setProof(e.target.value)} />
                    <Form.Text className="text-muted">
                        Proof that the interaction has occured.
                    </Form.Text>
                </Form.Group>
                <Alert variant="danger">
                    This form is intended for demonstration purposes. An interaction refers to an event that takes place between two parties outside of the platform. Upon completion of the interaction, the parties publish an interaction record on the DWN. The proof included in the interaction record is generated at the conclusion of the interaction and serves to verify that the interaction has indeed occurred. An example of such proof could be a multisignature executed by both parties.
                </Alert>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="dark" type="submit">
                { publishingLoading ? <Spinner animation="border" variant="warning" size="sm"/> :"Publish stub interaction" }
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
    
    </>;
}