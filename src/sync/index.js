require('dotenv').config();
const axios = require('axios');
const { COUNTRY_API } = process.env;
const { Country } = require('../db');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

//This Function request all countries to the API 
const getAllCountries = async () => {
    const success = await Country.findAll();
    // console.log(COUNTRY_API, DB_PASSWORD)
    //If all countries are already into DB
    if (success.length > 0) return 'DB already loaded';

    //Otherwise, request all data to the API
    else {
        const allCountries = await axios.get(`${COUNTRY_API}/all`); //GET request to Country API
        let info = []; //New array to save the response request fix

        await allCountries.data.forEach(country => {
            info.push({
                'id': country.cca3,
                'name': country.name.common,
                'imgFlag': country.flags[0],
                'continent': country.region,
                'capital':
                    country.capital ? country.capital[0] : 'no se encontro',
                'subregion': country.subregion,
                'area': country.area,
                'population': country.population,
                'latlng': country.latlng
            })
        }); //This added all countries to New Array
        // console.log(info);
        await Country.bulkCreate(info);//This create all rows into DB with all countries Data
        return 'All countries added into DB successful';
    }
}

module.exports = {getAllCountries};