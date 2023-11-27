import { Web5 } from "@web5/api";
import dwnConnectorAPI from "./dwnConnector"
import { reviewProtocolDefinition } from "../protocols/review/review.protocol";

const installProtocol = async (
  web5: Web5, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protocolDefinition: any,
  ownerDid: string,
) => {
  const { protocol, status } = await dwnConnectorAPI.createProcotol(web5, {
    message: {
      definition: protocolDefinition,
    },
  });
  console.log('status: ', status);
  await protocol?.send(ownerDid);

  return status;
}

const installReviewProtocol = async (
  web5: Web5,
  ownerDid: string,
) => {
  return await installProtocol(web5, reviewProtocolDefinition, ownerDid);
}

const getProtocolsByURI = async (
  web5: Web5, 
  protocolURI: string,
) => {
  const { protocols, status } = await dwnConnectorAPI.queryProtocols(web5, {
    message: {
      filter: {
        protocol: protocolURI,
      },
    },
  });
  console.log('status: ', status);
  return protocols;
}

const didPilotProtocolAPI = { installProtocol, getProtocolsByURI, installReviewProtocol };
export default didPilotProtocolAPI;