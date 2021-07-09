import { APIGatewayEvent } from 'aws-lambda';

export const getAlterationFromEvent = (event: APIGatewayEvent) => {
  let { alteration } = event.pathParameters;

  // If a c & p dot is not provided just add a junk one so we can get a response from api.
  // (Used in non variant specific Exon Image)
  if (['p.', 'c.', 'r.'].every((dot) => !alteration.includes(dot))) {
    alteration += ' c.1T>C';
  }

  //clean up alteration string
  return alteration.replace(/\?/g, '%3F').replace(/\+/g, '%2B');
};

export const createSvgResponse = (svg: string, statusCode: number) => ({
  body: svg,
  statusCode: statusCode,
  headers: {
    // Set the content type to the correct Mime type
    'Content-Type': 'image/svg+xml',
  },
});
