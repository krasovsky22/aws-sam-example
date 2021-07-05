import { APIGatewayProxyResult } from 'aws-lambda';
import logger from '../utils/logger';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  logger.info(`time to say 'hello'`);
  return { body: JSON.stringify({ message: 'hello world blah blah' }), statusCode: 200 };
};
