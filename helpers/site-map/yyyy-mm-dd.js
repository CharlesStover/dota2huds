const yyyyMmDd = date => {
  const month = date.getMonth();
  const day = date.getDate();
  return (
    date.getFullYear().toString() + '-' +
    (month < 10 ? '0' + month : month.toString()) + '-' +
    (day < 10 ? '0' + day : day.toString())
  );
};

module.exports = yyyyMmDd;
