import { 
  Protocol, 
  ProtocolsConfigureRequest, 
  ProtocolsQueryRequest, 
  Record, 
  RecordUpdateOptions, 
  RecordsCreateRequest, 
  RecordsQueryRequest, 
  RecordsReadRequest, 
  Web5 
} from '@web5/api';

const writeRecord = async (web5: Web5, request: RecordsCreateRequest) => {
  const { record } = await web5.dwn.records.create({
    ...request
  });
  return record;
}

const readRecord = async (web5: Web5, request: RecordsReadRequest) => {
  const { record } = await web5.dwn.records.read({
    ...request
  })
  return record;
}

const updateRecord = async (web5: Web5, readRequest: RecordsReadRequest, update: RecordUpdateOptions) => {
  const record = await readRecord(web5, readRequest);
  const { status } = await record.update({
      ...update
  });
  return status;
}

const deleteRecord = async (web5: Web5, readRequest: RecordsReadRequest) => {
  const record = await readRecord(web5, readRequest);
  const deleteResult = await record.delete();
  return deleteResult;
}

// TODO: this function assumes that all records are json, but it should be able to handle other data formats as well
const queryRecords = async (web5: Web5, query: RecordsQueryRequest) => {
  const { records } = await web5.dwn.records.query({
      ...query
  });
  const parsedRecords = [];
  if (records) {
    for (const record of records) {
      parsedRecords.push(await record.data.json());
    }
  }
  return { records, parsedRecords };
}

// TODO: this function is not tested yet
const queryProtocols = async (web5: Web5, query: ProtocolsQueryRequest) => {
  const { protocols, status } = await web5.dwn.protocols.query({
      ...query
  });
  return {
    protocols,
    status,
  };
}

// TODO: this function is not tested yet
const createProcotol = async (web5: Web5, protocol: ProtocolsConfigureRequest) => {
  const response = await web5.dwn.protocols.configure({
      ...protocol
  });
  return response;
}

// if recipient == userDid then it sends record to user's , otherwise it sends record to another party 
const sendRecord = async (record: Record, recipient: string) => {
  const { status } = await record.send(recipient);
  return status;
}

// TODO: this function is not tested yet
// if recipient == userDid then it sends protocol to user's , otherwise it sends record to another party 
const sendProtocol = async (protocol: Protocol, recipient: string) => {
  const { status } = await protocol.send(recipient);
  return status;
}

const dwnConnectorAPI = { writeRecord, readRecord, updateRecord, deleteRecord, queryRecords, queryProtocols, createProcotol, sendRecord, sendProtocol };
export default dwnConnectorAPI;