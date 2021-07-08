import { handler } from './hello';

describe('hello handler', () => {
  it('should say hello', async () => {
    const result = await handler({ pathParameters: { alteration: 'TP53%20NM_000546%20p.Y107H%20c.319T>C' } });
    expect(result).toMatchSnapshot();
  });
});
