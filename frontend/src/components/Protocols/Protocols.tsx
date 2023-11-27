import didPilotProtocolAPI from "@/api/didPilotProtocol";
import { useWeb5 } from "@/hooks/useWeb5";
import { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger, Row, Spinner, Button, FloatingLabel, Form } from "react-bootstrap";
import { reviewProtocolDefinition } from "../../protocols/review/review.protocol";
import { Protocol } from "@web5/api";
import { useError } from "@/hooks/useError";

export function Protocols() {
  const { web5, userDid, web5Loading } = useWeb5();
  const [loading, setLoading] = useState(false);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const { setError } = useError();

  const getProtocolsFromDWN = async () => {
    if (web5 && userDid) {
      setLoading(true);
      const protocols = await didPilotProtocolAPI.getProtocolsByURI(
        web5,
        reviewProtocolDefinition.protocol
      );
      console.log("Results: ", protocols);

      setProtocols(protocols);
      setLoading(false);
    }
  };

  const handleProtocolInstallation = () => async () => {
    if (web5 && userDid) {
      setLoading(true);
      try {
        const status = await didPilotProtocolAPI.installProtocol(
          web5,
          reviewProtocolDefinition,
          userDid,
        );
        console.log("Results: ", status);
  
        getProtocolsFromDWN();
      } catch (e) {
        console.log("Error: ", e);
        setError(JSON.stringify(e));
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    getProtocolsFromDWN();
  }, [web5, userDid]);

  return <>
    <div className="text-center">
      <OverlayTrigger placement="bottom" overlay={<Tooltip>This page is used to install the DID Pilot protocol.</Tooltip>}>
        <h1>Protocols</h1>
      </OverlayTrigger>
    </div>

    <p className="text-center">
      To be able to use this application and communicate with the rest of the
      network you need to have installed this protocol on your DWN.
    </p>

    <Row className="g-2">
      <FloatingLabel controlId="floatingTextareaProtocol" label="DID Pilot Review Protocol">
        <Form.Control
          as="textarea"
          value={JSON.stringify(reviewProtocolDefinition, null, 3)}
          style={{ height: '300px' }}
          readOnly
        />
      </FloatingLabel>

      {!loading && !web5Loading ?  
        <>  
        { protocols.length > 0 ?
          <span className="text-center">You already have the protocol installed!</span>
          : <>
            <Button variant="dark" onClick={handleProtocolInstallation()}>Install this protocol on your DWN</Button>
            <span className="text-center">No installed protocol found.</span>
            </>
        }
        </>
      :
        <Row className="justify-content-center mt-4">
          <Spinner animation="border" variant="warning" />
        </Row>
      }
    </Row>
  </>;
}
