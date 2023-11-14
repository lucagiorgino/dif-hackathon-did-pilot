
import { 
    Protocol, 
    ProtocolsConfigureRequest, 
    ProtocolsQueryRequest, 
    Record, 
    RecordsQueryRequest, 
    Web5 
} from '@web5/api';

export const fn = async () => {
    console.log("Start fn");
    const { did: aliceDid } = await Web5.connect();
    console.log("did", aliceDid);
}

export const writeDWN = async (web5: Web5, data: string) => {
    const { record } = await web5.dwn.records.create({
        data,
        message: {
          dataFormat: 'text/plain',
        },
    });
    return record;
}

export const readDWN = async (web5: Web5, recordId: string) => {
    const { record } = await web5.dwn.records.read({
        message: {
            filter: {
              recordId: recordId
            }
          } 
    })
    return record;
}

export const updateDWN = async (web5: Web5, recordId: string, data: string) => {
    const record = await readDWN(web5, recordId);
    const { status } = await record.update({
        data
    });
    return status;
}

export const deleteDWN = async (web5: Web5, recordId: string) => {
    const record = await readDWN(web5, recordId);
    const deleteResult = await record.delete();
    return deleteResult;
}

export const queryRecordsDWN = async (web5: Web5, query: RecordsQueryRequest) => {
    const { records } = await web5.dwn.records.query({
        ...query
    });
    return records;
}

export const queryProtocolsDWN = async (web5: Web5, query: ProtocolsQueryRequest) => {
    const { protocols } = await web5.dwn.protocols.query({
        ...query
    });
    return protocols;
}

export const createProcotolDWN = async (web5: Web5, protocol: ProtocolsConfigureRequest) => {
    const response = await web5.dwn.protocols.configure({
        ...protocol
    });
    return response;
}

// if recipient == userDid then it sends record to user's DWN, otherwise it sends record to another party DWN
export const sendRecordDWN = async (record: Record, recipient: string) => {
    const { status } = await record.send(recipient);
    return status;
}

// if recipient == userDid then it sends protocol to user's DWN, otherwise it sends record to another party DWN
export const sendProtocolDWN = async (protocol: Protocol, recipient: string) => {
    const { status } = await protocol.send(recipient);
    return status;
}
