import { constructAPIGwEvent } from '../helpers';
import { handler } from '../../src/handlers/bayesdel';

describe('hello handler', () => {
  it('should say hello', async () => {
    const event = constructAPIGwEvent(
      {},
      {
        httpMethod: 'GET',
        pathParameters: { alteration: 'TP53%20NM_000546%20p.Y107H%20c.319T>C' },
      },
    );
    const result = await handler(event);
    expect(result).toMatchSnapshot();
  });
});
