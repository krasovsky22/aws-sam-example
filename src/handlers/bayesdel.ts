import * as data from '../utils/data.json';

import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import logger from '../utils/logger';

export const handler = async (event: APIGatewayEvent & EventType): Promise<APIGatewayProxyResult> => {
  logger.info(event.pathParameters.alteration);
  return { body: JSON.stringify({ message: data }), statusCode: 200 };
};
