export function filterOutNullUndefine(params) {
  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null) {
      delete params[key];
    }
  });
  return params;
}