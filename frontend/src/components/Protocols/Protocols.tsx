import didPilotProtocolAPI from "@/api/didPilotProtocol";
import { useWeb5 } from "@/hooks/useWeb5";
import { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger, Row, Spinner } from "react-bootstrap";
import { reviewProtocolDefinition } from "../../protocols/review/review.protocol";
import { Protocol } from "@web5/api";

export function Protocols() {
  const { web5, userDid, web5Loading } = useWeb5();
  const [loading, setLoading] = useState(false);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [protocolInstallationError, setProtocolInstallationError] = useState<string | null>(null);

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
            setProtocolInstallationError(JSON.stringify(e));
        }
        setLoading(false);
    }
  }

  useEffect(() => {
    getProtocolsFromDWN();
  }, [web5, userDid]);

  return (
    <>
      <div className="text-center">
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>These are the reviews that I received.</Tooltip>}
        >
          <h1>Protocols</h1>
        </OverlayTrigger>
      </div>

      <p className="text-center">
        To be able to use this application and communicate with the rest of the
        network you have to install these protocols on your DWN
      </p>

      <Row lg={1} xl={2} className="g-2">
        <h2>DIDPilot Review Protocol</h2>
        <div>
          <textarea
            className="form-control"
            value={JSON.stringify(reviewProtocolDefinition, null, 2)}
            readOnly
          />
        </div>
        <button onClick={handleProtocolInstallation()}>Install this protocol on your DWN</button>
        {protocolInstallationError && (
          <div className="alert alert-danger" role="alert">
            {protocolInstallationError}
          </div>
        )}
      </Row>

      {!loading && !web5Loading ? (
        <>
          {protocols.length > 0 ? (
            <Row lg={1} xl={2} className="g-2">
              <h3>You have the correct protocol installed!</h3>
              {protocols.map((protocol, index) => (
                <div key={index}>
                  <textarea
                    className="form-control"
                    value={JSON.stringify(protocol.definition, null, 2)}
                    readOnly
                  />
                </div>
              ))}
            </Row>
          ) : (
            <Row className="justify-content-center mt-4">
              <span className="text-center">No protocols found.</span>
            </Row>
          )}
        </>
      ) : (
        <Row className="justify-content-center mt-4">
          <Spinner animation="border" variant="warning" />
        </Row>
      )}
    </>
  );
}
