const width = 510;
const height = 100;
const margin = 25;

const constants = {
  //The actual drawing area
  width,
  height,

  //Margin around actual drawing area.
  margin,

  //Final image size
  svgWidth: width + margin * 2,
  svgHeight: height + margin * 2,

  graphHeight: 50, // Height of the heatmap colored image area.
  graphicOffset: 35, //Space between top of image and colored drawing area. Leave room for title and score label.
  axisOffset: 5, // the space between the bottom axis and the colored image area.
  axisHeight: 30, //Height of the axis
  cornerRadius: 15, //Corner rounding
  extraLength: 2, //A tiny offset that is used on the score line.

  colors: { green: '#5AE655', yellow: '#DEE558', red: '#E44A50' },
};

export default constants;
