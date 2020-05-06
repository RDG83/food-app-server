const clarifai = require("clarifai");

const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_KEY
});

const handleApiCall = (req, res) => {
    app.models
        .predict("bd367be194cf45149e75f01d59f77ba7", req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db.select("*")
        .from("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => {
            res.json(entries[0]);
        }).catch(err => {
            res.status(400).json('unable to find entries');
        })
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}