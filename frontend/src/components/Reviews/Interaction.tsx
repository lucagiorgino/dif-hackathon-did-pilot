import didPilotTEDReviewAPI from "@/api/didPilotTEDReview";
// import dwnConnectorAPI from "@/api/dwnConnector";
import { useError } from "@/hooks/useError";
import { useWeb5 } from "@/hooks/useWeb5";
import { DidInteraction } from "@/types/types";
import { useState } from "react";
import { Button, Form, Modal, OverlayTrigger, Spinner, Stack, Toast, Tooltip } from "react-bootstrap";
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
    const [subjectDid, setSubjectDid] = useState(
      props.interaction.author == userDid ? 
        props.interaction.recipient : 
        props.interaction.author
    );
    const [description, setDescription] = useState("");
    const [interactionModalShow, setInteractionModalShow] = useState(false);
    const [idCopied, setIdCopied] = useState(false);
    const [authorCopied, setAuthorCopied] = useState(false);
    const [recipientCopied, setRecipientCopied] = useState(false);
    

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
                subjectDid: subjectDid,
                stars: stars,
                description: description  
              },
              subjectDid,
              props.interaction.recordId,
              props.interaction.contextId
            );
            console.log("new review:", await record?.data.json());
            // send data to the DWN instantly
            // if (record) await dwnConnectorAPI.sendRecord(record, subjectDid);
          } catch (err) {
            if (err instanceof Error) setError(err);
          }
          setPublishingLoading(false);
          setModalShow(false);
          props.setTrigger(!props.trigger);
      }
    }

    const handleDelete = async () => {
      if (web5 && userDid) {

        let res = await didPilotTEDReviewAPI.deleteInteraction(web5, props.interaction.recordId);
        console.log("Delete:", res);
        props.setTrigger(!props.trigger);
      }
    }

    return <>  
      <Toast className="mx-1 my-auto">
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Pending</strong>
            <small>{props.interaction.createdDate}</small> 
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="button-tooltip">Create a review!</Tooltip>}
            >
              <Button className="ms-2" size="sm" variant="outline-dark" onClick={() => {setModalShow(true); setStars(3);}}>
                <i className="bi bi-plus-circle-fill"/>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="button-tooltip">Show interaction details</Tooltip>}
            >
              <Button className="ms-2" size="sm" variant="outline-dark" onClick={() => {setInteractionModalShow(true)}}>
                <i className="bi bi-info-lg"/>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="button-tooltip">Remove from pending interactions!</Tooltip>}
            >
              <Button className="ms-2" size="sm" variant="outline-dark" onClick={handleDelete}>
                <i className="bi bi-trash-fill"/>
              </Button>
            </OverlayTrigger>
          </Toast.Header>
      </Toast>

      <Modal show={interactionModalShow} onHide={() => {setInteractionModalShow(false);}}>
        <Modal.Header closeButton>
          <Modal.Title>Interaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>

            <label className="fw-bold">Id: </label>
            <div>
            <Stack direction="horizontal" gap={3}>
              <p className="text-truncate my-auto">{props.interaction.recordId}</p>
              <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip">{idCopied ? "Copied!" : "Copy"}</Tooltip>} onExited={()=>setIdCopied(false)}>
                <Button className="my-auto" size="sm" variant="outline-dark" onClick={() => {navigator.clipboard.writeText(props.interaction.recordId); setIdCopied(true);}}>
                  <i className="bi bi-copy"/>
                </Button>
              </OverlayTrigger>
            </Stack>  
            </div><br/>

            <label className="fw-bold">Author: </label>
            <div>
            <Stack direction="horizontal" gap={3}>
              <p className="text-truncate my-auto">{userDid == props.interaction.author ? <strong className="text-warning">(you) </strong> : ""}{props.interaction.author}</p>
              <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip">{authorCopied ? "Copied!" : "Copy"}</Tooltip>} onExited={()=>setAuthorCopied(false)}>
                  <Button className="my-auto" size="sm" variant="outline-dark" onClick={() => {navigator.clipboard.writeText(props.interaction.author); setAuthorCopied(true);}}>
                    <i className="bi bi-copy"/>
                  </Button>
                </OverlayTrigger>
            </Stack> 
            </div><br/>

            <label className="fw-bold">Recipient: </label>
            <div>
            <Stack direction="horizontal" gap={3}>
              <p className="text-truncate my-auto">{userDid == props.interaction.recipient ? <strong className="text-warning">(you) </strong> : ""}{props.interaction.recipient}</p>
              <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip">{recipientCopied ? "Copied!" : "Copy"}</Tooltip>} onExited={()=>setRecipientCopied(false)}>
                  <Button className="my-auto" size="sm" variant="outline-dark" onClick={() => {navigator.clipboard.writeText(props.interaction.recipient); setRecipientCopied(true);}}>
                    <i className="bi bi-copy"/>
                  </Button>
                </OverlayTrigger>
            </Stack>
            </div><br/>

            <label className="fw-bold">Created Date: </label><p className="text-truncate">{props.interaction.createdDate}</p>
            <label className="fw-bold">Proof: </label><p className="text-truncate">{props.interaction.proof}</p>
        </Modal.Body>
        
      </Modal>

      <Modal key="publishReviewModal" show={modalShow} onHide={() => {setModalShow(false);}}>
        <Form onSubmit={handlePublish}>
            <Modal.Header closeButton>
                <Modal.Title>Add a review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="formDid">
                    <Form.Label><strong>DID subject</strong></Form.Label>
                    <Form.Control 
                    type="text"
                    placeholder="Insert a DID"
                    onChange={(e) => setSubjectDid(e.target.value)}
                    value={
                      props.interaction.author === userDid ? 
                        props.interaction.recipient : 
                        props.interaction.author
                    }
                    required
                    />
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