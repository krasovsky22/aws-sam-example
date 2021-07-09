import constants from './constants';

import { axisBottom, format, scaleLinear } from 'd3';
// @ts-ignore
import * as D3Node from 'd3-node';
import { AxisScale } from 'd3-axis';

const {
  axisHeight,
  axisOffset,
  colors,
  cornerRadius,
  extraLength,
  graphHeight,
  graphicOffset,
  margin,
  svgHeight,
  svgWidth,
  width,
} = constants;

export interface HeatMapProps {
  title: string;
  subtitle: string;
  domain: number[];
  stops?: number[];
  score?: number;
}

class HeatMap {
  protected domain: number[];
  protected stops: number[];
  protected title: string;
  protected subtitle: string;
  protected score: number;

  public constructor({ title, subtitle = '', domain, stops = [0, 50, 100], score }: HeatMapProps) {
    this.domain = domain;
    this.stops = stops;
    this.title = title;
    this.subtitle = subtitle;

    if (score) {
      this.score = score;
    }
  }

  scale() {
    return scaleLinear().domain(this.domain).range([0, width]);
  }

  gradientBackground(svg: D3Node) {
    const { green, red, yellow } = colors;
    const { stops } = this;

    const linearGradient = svg.append('defs').append('linearGradient').attr('id', 'linear-gradient');

    linearGradient.append('stop').attr('offset', `${stops[0]}%`).attr('stop-color', green);

    linearGradient.append('stop').attr('offset', `${stops[1]}%`).attr('stop-color', yellow);

    linearGradient.append('stop').attr('offset', `${stops[2]}%`).attr('stop-color', red);

    svg
      .append('rect')
      .attr('y', graphicOffset)
      .attr('width', width)
      .attr('height', graphHeight)
      .attr('rx', cornerRadius)
      .attr('ry', cornerRadius)
      .style('fill', 'url(#linear-gradient)');
  }

  scoreLineLabel(svg: D3Node, scale: Function) {
    const { score } = this;

    svg
      .append('text')
      .attr('x', scale(score) - 15)
      .attr('y', 27)
      .style('font-size', '14px')
      .style('font-family', 'sans-serif')
      .text(parseFloat(`${score}`).toFixed(2));

    svg
      .append('line')
      .attr('x1', scale(score))
      .attr('x2', scale(score))
      .attr('y1', graphicOffset - extraLength)
      .attr('y2', graphicOffset + graphHeight + extraLength)
      .style('stroke', 'white')
      .style('stroke-linecap', 'round')
      .style('stroke-width', 6);

    svg
      .append('line')
      .attr('x1', scale(score))
      .attr('x2', scale(score))
      .attr('y1', graphicOffset - extraLength)
      .attr('y2', graphicOffset + graphHeight + extraLength)
      .style('stroke-linecap', 'round')
      .style('stroke', 'black')
      .style('stroke-width', 4);
  }

  titleAndSubtitle(svg: D3Node) {
    const { title, subtitle } = this;

    svg
      .append('text')
      .attr('x', width / 2 - title.length * 5)
      .attr('y', 10)
      .style('font-weight', '400')
      .style('font-size', '17px')
      .style('font-family', 'sans-serif')
      .text(title);

    svg
      .append('text')
      .attr('x', 20)
      .attr('y', graphHeight + graphicOffset + axisOffset + axisHeight)
      .style('font-size', '11px')
      .style('font-family', 'sans-serif')
      .text(subtitle);
  }

  axis(svg: D3Node, scale: AxisScale<any>) {
    const tickLength = 5;
    const [start, stop] = scale.domain();
    const sign = start > stop ? -1 : 1;
    const tickStep = Math.ceil((Math.abs(stop - start) * 100) / tickLength) / 100;
    const tickValues = Array(tickLength)
      .fill(start)
      .map((val, i) => val + tickStep * (i * sign))
      .concat(stop);
    const axis = axisBottom(scale).scale(scale).tickFormat(format('.2f')).tickValues(tickValues);

    svg
      .append('g')
      .attr('transform', `translate(0, ${graphHeight + graphicOffset + axisOffset})`)
      .call(axis);
  }
  //Override this method to fetch any extra data and set the score.
  preRender() {
    return true;
  }
  //Override this method to do the actual drawing.
  render() {
    if (!this.preRender()) {
      return false;
    }
    const d3n = new D3Node();
    const svg = d3n.createSVG(svgWidth, svgHeight).append('g').attr('transform', `translate(${margin},${margin})`);

    const scale = this.scale();

    this.axis(svg, scale);

    this.gradientBackground(svg);

    this.titleAndSubtitle(svg);

    this.scoreLineLabel(svg, scale);

    return d3n.svgString();
  }
}

export default HeatMap;
