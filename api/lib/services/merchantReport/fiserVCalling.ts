import axios from 'axios';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

const hostname = process.env.FISERV_HOST_NAME;
const secret = process.env.FISERV_SECRET || '';
const key = process.env.FISERV_KEY || '';
export class FiserVCall {
  async callFiserVApi(requestBody: any, path: string) {
    // requestBody = {

    const ClientRequestId = uuidv4();
    const time = new Date().getTime();
    const rawSignature =
      key + ClientRequestId + time + JSON.stringify(requestBody);
    let computedHash: any = CryptoJS.algo.HMAC.create(
      CryptoJS.algo.SHA256,
      secret.toString()
    );
    computedHash.update(rawSignature);

    computedHash = computedHash.finalize();
    const computedHmac = CryptoJS.enc.Base64.stringify(computedHash);

    try {
      const { data, status } = await axios.post(
        `https://${hostname}${path}`,
        requestBody,
        {
          headers: {
            'Client-Request-Id': ClientRequestId,
            'Api-Key': key,
            Timestamp: time,
            Authorization: computedHmac,
            'Auth-Token-Type': 'HMAC',
          },
        }
      );
      return data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return error.message;
      } else {
        return 'An unexpected error occurred';
      }
    }
  }
}
