export const createNaSvg = (error = ''): string => {
  const err = error.trim().replace(/"/, "'");
  return `<svg xmlns='http://www.w3.org/2000/svg' height='20' width='40'>
    <text data-error='${err}' x='0' y='16' font-family='Verdana' font-size='16'>N/A</text>
  </svg>`;
};
