require('dotenv').config();
const { Router } = require('express');
const axios = require('axios');
const { COUNTRY_API, DB_PASSWORD } = process.env;
const { TurisActivity, CountryActivity, Country } = require('../db');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

router.get('/', async (req, res)=>{
    res.status(201).json(await TurisActivity.findAll({include: Country}));
});

// router.get('/season/:name', async(req, res)=>{

//     const {name} = req.params;

//     res.status(201).json(await TurisActivity.findAll({
//         where: {
//             season: name,
//         },
//         include: ['Country']
//     }))
// });

router.post('/', async (req, res) => {
    const { name, difficulty, duration, season } = req.body;
    let countries = req.body.countries.map(e => e.toUpperCase());
    const activityName = await TurisActivity.findOne({ where: { name: name.toUpperCase() } });

    try {

        if (!name || !difficulty || !duration || !season) return res.status(400).send('You should complete all parameters');

        //If the activity has been already created 
        if (activityName) {
            const result = [];
            const countryAct = await CountryActivity.findAll({
                where: {
                    TurisActivityId: activityName.id
                },
                attributes: ['countryId']
            });
            const countriesIds = countryAct.map(e => e.countryId)
            countries.forEach(e => {
                let same = countriesIds.find(f => f === e)
                if (!same) result.push(e);
            })

            if (result.length > 0) {
                result.length == 1
                    ? await activityName.addCountry(result[0])
                    : await activityName.addCountries(result)
                return res.status(201).send('Activity modification successfull');
            }
            else return res.status(400).send(`${name} has been already created`);
        }

        //Otherwise, we should create a new activity
        const activity = await TurisActivity.create({
            name,
            difficulty,
            duration,
            season
        })

        if (countries.length == 1) {
            await activity.addCountry(countries[0])
        } else {
            await activity.addCountries(countries)
        }
        return res.status(200)
        .json(activity)
    }
    catch (err) {
        res.send(err);
    }
});

router.delete('/delete/:id', async(req, res)=>{
    const {id} = req.params;
    const act = await TurisActivity.findByPk(id);
    await act.destroy();
    res.status(201).send('Eliminado con exito');
})

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;