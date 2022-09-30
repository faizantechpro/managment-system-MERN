const ParseSequelizeResponse = (response: any) => {
  return JSON.parse(JSON.stringify(response));
};
export default ParseSequelizeResponse;
