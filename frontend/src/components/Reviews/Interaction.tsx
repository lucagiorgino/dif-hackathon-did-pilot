import didPilotTEDReviewAPI from "@/api/didPilotTEDReview";
import dwnConnectorAPI from "@/api/dwnConnector";
import { useError } from "@/hooks/useError";
import { useWeb5 } from "@/hooks/useWeb5";
import { DidInteraction } from "@/types/types";
import { useState } from "react";
import { Button, Form, Modal, OverlayTrigger, Spinner, Toast, Tooltip } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

export function Interaction(props: {
  interaction: DidInteraction,
  trigger: boolean,
  setTrigger: (arg0: boolean) => void
}) {

    const {web5, userDid} = useWeb5();
    const {setError} = useError();
    const [publishingLoading, setPublishingLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [stars, setStars] = useState(3);
    const [subjectDid, setSubjectDid] = useState("");
    const [description, setDescription] = useState("");

    const handlePublish = async (event: React.FormEvent) => {
      event.preventDefault();
      if (web5 && userDid) {
          setPublishingLoading(true);
          try{
          
            const record = await didPilotTEDReviewAPI.createTEDReview(
              web5, 
              userDid, 
              "0.0.1", 
              {
                subjectDid: userDid,
                stars: stars,
                description: description  
              },
              subjectDid,
              props.interaction.recordId,
              props.interaction.contextId
            );
            console.log("ee:", record);
            // send data to the DWN instantly
            if (record) await dwnConnectorAPI.sendRecord(record, userDid);
          } catch (err) {
            if (err instanceof Error) setError(err);
          }
          setPublishingLoading(false);
          setModalShow(false);
          props.setTrigger(!props.trigger);
      }
    }
    // TODO: modify cratedDate
    return <>  
      <Toast className="mx-1">
          <Toast.Header closeButton={false}>
            <strong className="me-auto">{props.interaction.recipient ? props.interaction.recipient : props.interaction.author}</strong>
            <small>{props.interaction.createdDate}</small> 
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="button-tooltip">Create a review!</Tooltip>}
            >
              <Button className="ms-2" size="sm" variant="outline-dark" onClick={() => {setModalShow(true); setStars(3);}}>
                <i className="bi bi-plus-circle-fill"/>
              </Button>
            </OverlayTrigger>
          </Toast.Header>
      </Toast>

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
    </>
}