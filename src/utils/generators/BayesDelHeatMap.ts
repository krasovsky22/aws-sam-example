import HeatMap from '@utils/generators/HeatMap';
import constants from './constants';

// @ts-ignore
import * as D3Node from 'd3-node';

interface SvgRenderer {
  render(): string;
}

const { colors, graphicOffset, graphHeight, cornerRadius, width, extraLength, svgWidth, svgHeight, margin } = constants;

interface BayesDelHeatMapProps {
  lower_threshold: number;
  upper_threshold: number;
  score: number;
}

class BayesDelHeatMap extends HeatMap implements SvgRenderer {
  private thresholds: number[];

  public constructor(props: BayesDelHeatMapProps) {
    const { lower_threshold, upper_threshold, ...rest } = props;
    super({ ...rest, domain: [-1, 1], title: 'BayesDel', subtitle: '' });

    this.thresholds = [lower_threshold, upper_threshold];
  }

  private thresholdLines(svg: D3Node, scale: Function) {
    const { thresholds } = this;

    [0, 1].forEach((i) =>
      svg
        .append('line')
        .attr('x1', scale(thresholds[i]))
        .attr('x2', scale(thresholds[i]))
        .attr('y1', graphicOffset - extraLength)
        .attr('y2', graphHeight + graphicOffset + extraLength)
        .style('stroke', 'black')
        .style('stroke-width', '2')
        .style('stroke-dasharray', '5,5'),
    );
  }

  private bayesDelColors(svg: D3Node, scale: Function) {
    const { green, red, yellow } = colors;
    const { thresholds } = this;

    svg
      .append('rect')
      .attr('x', cornerRadius)
      .attr('y', graphicOffset)
      .style('fill', green)
      .attr('height', graphHeight)
      .attr('width', scale(thresholds[0]));

    svg
      .append('rect')
      .attr('x', scale(thresholds[0]))
      .attr('width', scale(thresholds[1]) - scale(thresholds[0]))
      .style('fill', yellow)
      .attr('y', graphicOffset)
      .attr('height', graphHeight);

    svg
      .append('rect')
      .attr('x', scale(thresholds[1]))
      .attr('width', width - scale(thresholds[1]) - cornerRadius)
      .style('fill', red)
      .attr('y', graphicOffset)
      .attr('height', graphHeight);
  }

  private bayesDelStaticText(svg: D3Node, scale: Function) {
    const { thresholds } = this;
    const textSize = 14;
    const halfSize = textSize / 2;
    const benignText = 'Tolerated';
    const pathogenicText = 'Deleterious';
    const yOffset = graphicOffset + (graphHeight / 2 + halfSize);

    svg
      .append('text')
      .attr('x', cornerRadius + (scale(thresholds[0]) / 2 - (benignText.length / 2) * halfSize))
      .attr('y', yOffset)
      .style('font-size', `${textSize}px`)
      .style('font-family', 'sans-serif')
      .text(benignText);

    svg
      .append('text')
      .attr(
        'x',
        scale(thresholds[1]) +
          ((width - scale(thresholds[1]) - cornerRadius) / 2 - (pathogenicText.length / 2) * halfSize),
      )
      .attr('y', yOffset)
      .style('font-size', `${textSize}px`)
      .style('font-family', 'sans-serif')
      .text(pathogenicText);
  }

  public render(): string {
    const d3n = new D3Node();
    const svg = d3n.createSVG(svgWidth, svgHeight).append('g').attr('transform', `translate(${margin},${margin})`);

    const scale = this.scale();

    this.axis(svg, scale);

    this.gradientBackground(svg);

    this.bayesDelColors(svg, scale);

    this.bayesDelStaticText(svg, scale);

    this.thresholdLines(svg, scale);

    this.titleAndSubtitle(svg);

    this.scoreLineLabel(svg, scale);

    return d3n.svgString();
  }
}

export default BayesDelHeatMap;
