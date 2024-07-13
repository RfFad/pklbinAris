const {getPatients} =  require('../models/pasienModel.js');


const antrianPasien = async (req,res) => {
    try {
        const patients = await getPatients();
        res.render('antrian/index',{
            patients
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}
module.exports = {antrianPasien}