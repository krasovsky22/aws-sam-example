import AviClient, { ResponseType } from './avi-client';

interface BayesDelApiClient {
  getData<T>(gene: string, chromosome: number, start: number, ref: string, alt: string): Promise<ResponseType<T>>;
}

class BayesDelApi extends AviClient implements BayesDelApiClient {
  getData<T>(gene: string, chromosome: number, start: number, ref: string, alt: string) {
    return super.get<T>({ params: { gene, chromosome, start, ref, alt } });
  }
}

const bayesDelApi = new BayesDelApi({ endpoint: 'bayesdel-no-allele-frequencies' });

export default bayesDelApi;
