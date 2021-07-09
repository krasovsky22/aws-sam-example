import AviClient from './avi-client';

interface AlterationApiClient {
  parseAlteration(alteration: string): Promise<object>;
}

class AlterationApi extends AviClient implements AlterationApiClient {
  public parseAlteration<T>(alteration: string) {
    return super.get<T>(alteration, {});
  }
}

const alterationApi = new AlterationApi({ endpoint: 'bio-api/alterations' });
export default alterationApi;
