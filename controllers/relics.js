const getRelics = async (req, res, db) => {
  await db.find({}).toArray()
  .then(response => res.json(response))
}

module.exports = {
  getRelics,
}