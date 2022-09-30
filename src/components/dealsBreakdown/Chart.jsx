import React, { useEffect } from 'react';
import {
  map,
  range,
  hierarchy,
  schemeTableau10,
  InternSet,
  scaleOrdinal,
  select,
  create,
  pack,
} from 'd3';

const BubbleChart = (
  data,
  {
    name = ([x]) => x, // alias for label
    value = ([, y]) => y, // given d in data, returns a quantitative size
    // label = name, // given d in data, returns text to display on the bubble
    label = value,
    group, // given d in data, returns a categorical value for color
    title, // given d in data, returns text to show on hover
    link, // given a node d, its link (if any)
    linkTarget = '_blank', // the target attribute for links, if any
    width = 640, // outer width, in pixels
    height = width, // outer height, in pixels
    padding = 3, // padding between circles
    margin = 1, // default margins
    marginTop = margin, // top margin, in pixels
    marginRight = margin, // right margin, in pixels
    marginBottom = margin, // bottom margin, in pixels
    marginLeft = margin, // left margin, in pixels
    groups, // array of group names (the domain of the color scale)
    colors = schemeTableau10, // an array of colors (for groups)
    fill = '#ccc', // a static fill color, if no group channel is specified
    fillOpacity = 0.7, // the fill opacity of the bubbles
    stroke, // a static stroke around the bubbles
    strokeWidth, // the stroke width around the bubbles, if any
    strokeOpacity, // the stroke opacity around the bubbles, if any
  } = {}
) => {
  // Compute the values.
  const D = map(data, (d) => d);
  const V = map(data, value);
  const G = group == null ? null : map(data, group);
  const I = range(V.length).filter((i) => V[i] > 0);

  // Unique the groups.
  if (G && groups === undefined) groups = I.map((i) => G[i]);
  groups = G && new InternSet(groups);

  // Construct scales.
  const color = G && scaleOrdinal(groups, colors);

  // Compute labels and titles.
  const L = label == null ? null : map(data, label);
  const T = title === undefined ? L : title == null ? null : map(data, title);

  // Compute layout: create a 1-deep hierarchy, and pack it.
  const root = pack()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .padding(padding)(hierarchy({ children: I }).sum((i) => V[i]));

  const svg = create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-marginLeft, -marginTop, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .attr('fill', 'currentColor')
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'middle');

  const leaf = svg
    .selectAll('a')
    .data(root.leaves())
    .join('a')
    .attr(
      'xlink:href',
      link == null ? null : (d, i) => link(D[d.data], i, data)
    )
    .attr('target', link == null ? null : linkTarget)
    .attr('transform', (d) => `translate(${d.x},${d.y})`);

  leaf
    .append('circle')
    .attr('stroke', stroke)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-opacity', strokeOpacity)
    .attr('fill', G ? (d) => color(G[d.data]) : fill == null ? 'none' : fill)
    .attr('fill-opacity', fillOpacity)
    .attr('r', (d) => d.r);

  if (T) leaf.append('title').text((d) => T[d.data]);

  if (L) {
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    leaf
      .append('clipPath')
      .attr('id', (d) => `${uid}-clip-${d.data}`)
      .append('circle')
      .attr('r', (d) => d.r);

    leaf
      .append('text')
      .attr(
        'clip-path',
        (d) => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`
      )
      .selectAll('tspan')
      .data((d) => `${L[d.data]}`.split(/\n/g))
      .join('tspan')
      .attr('font-weight', 'bold')
      .attr('font-size', (d, i) => {
        const k = Math.min(2, (d.length + 7) / 3);
        return i ? `${k}em` : `${k + 1}em`;
      })
      .attr('color', 'white')
      .attr('x', 0)
      .attr('y', (d, i, D) => `${i - D.length / 2 + 0.85}em`)
      .attr('fill-opacity', 1)
      .text((d) => d);
  }

  return Object.assign(svg.node(), { scales: { color } });
};

const Chart = ({ breakdownData }) => {
  useEffect(() => {
    const svg = select('#chart');
    svg.selectAll('*').remove();
    const data = breakdownData;
    const chart = BubbleChart(data, {
      width: svg.attr('width'),
      height: svg.attr('height'),
      value: (d) => d.value,
      group: (d) => d.group,
      name: (d) => d.name,
      colors: ['#092ace', '#f2c94c', '#ed4c78'],
      fillOpacity: 1,
    });
    svg.node().appendChild(chart);
  }, [breakdownData]);

  return <svg id="chart" width="350" height="350" />;
};

export default Chart;
