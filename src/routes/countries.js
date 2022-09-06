require('dotenv').config();
const { Router } = require('express');
const { Op } = require('sequelize');
const { Country, TurisActivity, conn } = require('../db');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();


router.get('', async (req, res) => {
    // await getAllCountries();
    const countriesDB = await Country.findAll();
    const { name } = req.query;

    try {
        if (name) {
            const country = await Country.findAll({
                where: {
                    name: {
                        [Op.startsWith]: name.toUpperCase()
                    }
                }
            });
            return res.status(200).json(country);

        } else {
            return res.status(200).json(countriesDB);
        }
    }
    catch (err) {
        return res.status(400).json(`Ocurrio un error: ${err}`);
    }
}); // This route returns all countries from DB or the country with the name receive from query

router.get('/order/:type', async (req, res) => {

    const { type } = req.params;
    const { para } = req.query;

    res.status(201).json(await Country.findAll({
        order: [
            [`${para}`, type]]
    }))
});

router.get('/order/season/:name', async (req, res) => {

    const { name } = req.params;

    res.status(201).json(await Country.findAll({
        include: [{
            model: TurisActivity,
            where: { season: name }
        }]
    }));
});

router.get('/:countryId', async (req, res) => {
    // await getAllCountries();
    const countryId = req.params.countryId.toUpperCase();

    if (countryId.length > 3) return res.status(400).send(`The country Id mustn't have more than 3 letters`)
    try {
        const country = await Country.findByPk(
            countryId,
            { include: TurisActivity }
        );

        return (
            country
                ?
                res.status(201).json(country)
                :
                res.status(404).json(`The country Id: ${countryId} is wrong`)
        )
    }
    catch (err) {
        res.send(err);
    }
});


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
