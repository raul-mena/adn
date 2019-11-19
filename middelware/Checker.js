const BitacoraModel = require('../models/Bitacora');
const redis = require('../redis');


const checkAdn = (req, res, next) => {
    try {
        const { adn } = req.body;
        //validate required paramenter
        if (!Array.isArray(adn)) {
            throw ('invalid payload')
        }
        //find element if exist one on redis
        client.get(adn.join(), (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            }
            if (result) {
                if (result.mutation) {
                    return res.status(403).send({ adnResult, message: 'ok' })
                } else {
                    return res.status(200).send({ adnResult, message: 'ok' })
                }
            } else {
                //find element if exist one on db
                BitacoraModel.find({ adn: adn.join() }, (err, docs) => {
                    if (docs.length) {
                        const adnResult = docs[0];
                        if (adnResult.mutation) {
                            return res.status(403).send({ adnResult, message: 'ok' })
                        } else {
                            return res.status(200).send({ adnResult, message: 'ok' })
                        }
                    }
                    next();
                });
            }
        });

    } catch (error) {
        res.status(500).send({ error });
    }
}


module.exports = { checkAdn }