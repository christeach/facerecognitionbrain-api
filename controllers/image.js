const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "4ac7deb7249b4351a05ec2a377aa0070"
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("unable to work with api"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to get any entries"));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};
