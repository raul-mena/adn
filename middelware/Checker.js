const BitacoraModel = require('../models/Bitacora');

const checkAdn = async(req, res, next) => {
    try {
        const { adn } = req.body;
        //validate required paramenter
        if (!Array.isArray(adn)) {
            throw ('invalid payload')
        }
        const adnResult = await BitacoraModel.find({ adn: adn.join() });

        if (adnResult) {
            if (adnResult.mutation) {
                return res.status(200).send({ message: 'OK', adnResult })
            } else {
                return res.status(403).send({ message: 'mutaion', adnResult })
            }
        }
    } catch (error) {
        return res.status(500).send({ error });
    } finally {
        next();
    }
}

module.exports = { checkAdn }