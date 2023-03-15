exports.responseHelper = (res, status, data, message) => {
  const resStatus = status ? 200 : 400;
  const validRes = {
    status_code: resStatus,
    data,
    message,
  };
  res.status(200).send(validRes);
};
