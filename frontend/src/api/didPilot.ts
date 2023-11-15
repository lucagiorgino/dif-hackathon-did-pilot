import { 
    Protocol, 
    ProtocolsConfigureRequest, 
    ProtocolsQueryRequest, 
    Record, 
    RecordsQueryRequest, 
    Web5 
} from '@web5/api';

const writeDWN = async (web5: Web5, data: object) => {
    const { record } = await web5.dwn.records.create({
        data,
        message: {
          dataFormat: 'application/json',
        },
    });
    return record;
}

const readDWN = async (web5: Web5, recordId: string) => {
    const { record } = await web5.dwn.records.read({
        message: {
            filter: {
              recordId: recordId
            }
          } 
    })
    return record;
}

const updateDWN = async (web5: Web5, recordId: string, data: string) => {
    const record = await readDWN(web5, recordId);
    const { status } = await record.update({
        data
    });
    return status;
}

const deleteDWN = async (web5: Web5, recordId: string) => {
    const record = await readDWN(web5, recordId);
    const deleteResult = await record.delete();
    return deleteResult;
}

const queryRecordsDWN = async (web5: Web5, query: RecordsQueryRequest) => {
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

const queryProtocolsDWN = async (web5: Web5, query: ProtocolsQueryRequest) => {
    const { protocols } = await web5.dwn.protocols.query({
        ...query
    });
    return protocols;
}

const createProcotolDWN = async (web5: Web5, protocol: ProtocolsConfigureRequest) => {
    const response = await web5.dwn.protocols.configure({
        ...protocol
    });
    return response;
}

// if recipient == userDid then it sends record to user's DWN, otherwise it sends record to another party DWN
const sendRecordDWN = async (record: Record, recipient: string) => {
    const { status } = await record.send(recipient);
    return status;
}

// if recipient == userDid then it sends protocol to user's DWN, otherwise it sends record to another party DWN
const sendProtocolDWN = async (protocol: Protocol, recipient: string) => {
    const { status } = await protocol.send(recipient);
    return status;
}



const API = { writeDWN, readDWN, updateDWN, deleteDWN, queryRecordsDWN, queryProtocolsDWN, createProcotolDWN, sendRecordDWN, sendProtocolDWN };
export default API;