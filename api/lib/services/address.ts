import axios from 'axios';

const addressUrl =
  process.env.GEOCODE_GOOGLE_API ||
  'https://maps.googleapis.com/maps/api/place/autocomplete/json?components=country:us';

export class AddressService {
  async getGoogleAddress({ address }: any) {
    const geoCodeResponse = await axios.get(addressUrl, {
      params: {
        input: address,
        key: process.env.GEOCODE_GOOGLE_APIKEY,
      },
    });

    const locations = geoCodeResponse.data.predictions.map((result: any) => ({
      ...result,
      name: result.description,
    }));

    return locations;
  }
}
