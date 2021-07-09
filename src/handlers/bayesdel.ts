import {
  logger,
  createSvgResponse,
  getAlterationFromEvent,
  AlterationApi,
  createNaSvg,
  getRefAlt,
  BayesDelApi,
  BayesDelHeatMap,
  hasBayesDelScore,
} from '@utils';

import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

type BioApiResponseData = {
  chromosome: number;
  genomic_position: number;
  gene: string;
  orientation: string;
  original_nucleotide: string;
  replacement_nucleotide: string;
};

type BayesdelResponseData = {
  score: string;
  lower_threshold: number;
  upper_threshold: number;
};

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const alteration = getAlterationFromEvent(event);
  logger.info(`Processing alteration ${alteration}`);

  const scale = event?.queryStringParameters?.scale ?? 1;
  logger.info(`Scale is ${scale}`);

  try {
    //parse alteration first
    const { success, message, data } = await AlterationApi.parseAlteration<BioApiResponseData>(alteration);
    if (!success) {
      logger.error('Unable to fetch bio-api data: ' + message);
      return createSvgResponse(createNaSvg(message ?? 'Unknown Error'), 206);
    }

    const { chromosome, genomic_position, gene } = data;
    const { ref, alt } = getRefAlt(data);

    // check if has bayesdel score
    logger.info('Checking if eligible for bayesdel image');
    if (!hasBayesDelScore({ ...data })) {
      logger.error('Doesnt have bayesdel score');
      return createSvgResponse(createNaSvg('Doesnt have bayesdel score'), 206);
    }

    //fetch from bayesdel api
    logger.info('Fetching bayesdel data');
    const {
      success: bayesdelSuccess,
      message: bayesdelMessage,
      data: bayesdelScore,
    } = await BayesDelApi.getData<BayesdelResponseData>(gene, chromosome, genomic_position, ref, alt);

    if (!bayesdelSuccess) {
      logger.error('Unable to fetch bayesdel data: ' + bayesdelMessage);
      return createSvgResponse(createNaSvg(bayesdelMessage ?? 'Unknown Error'), 206);
    }

    const { score, lower_threshold, upper_threshold } = bayesdelScore;
    //generate svg
    const svg = new BayesDelHeatMap({ score: +score, lower_threshold, upper_threshold }).render();

    return createSvgResponse(svg, 200);
  } catch (e) {
    return createSvgResponse(createNaSvg(e.message ?? 'Unknown Error'), 206);
  }
};
