const notFound = (req, res) =>
  res.status(404).send({ msg: "Rute tidak ditemukan" });

module.exports = notFound;
