//TODO:
import { Web5 } from '@web5/api';

export const fn = async () => {
    console.log("Start fn");
    const { did: aliceDid } = await Web5.connect();
    console.log("did", aliceDid);
}
