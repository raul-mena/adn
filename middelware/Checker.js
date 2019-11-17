const BitacoraModel = require('../models/Bitacora');

const checkAdn = (req, res, next) => {
    // try {
    const { adn } = req.body;
    //validate required paramenter
    if (!Array.isArray(adn)) {
        throw ('invalid payload')
    }
    //find element if exist one
    BitacoraModel.find({ adn: adn.join() }, (err, docs) => {
        if (docs.length) {
            const adnResult = docs[0];
            if (adnResult.mutation) {
                return res.status(403).send({ adnResult })
            } else {
                return res.status(200).send({ adnResult })
            }
        }
        next();
    });
}

module.exports = { checkAdn }