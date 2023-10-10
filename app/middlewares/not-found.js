const notFound = (req, res) =>
  res.status(404).send({ msg: "yaaahahah" });

module.exports = notFound;
