//Importación de dependencias
import express from 'express';
import chalk from 'chalk';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import axios from 'axios';

//Creamos una constante app que le asignamos el método express

const app = express();

// Usamos moment para obtener la hora local
moment.locale('es');

//Levantamos un puerto para que el servidor sea escuchado
app.listen(3000, () => {
    console.log('Servidor levantado en el puerto 3000')
})

//Se crea una ruta usuarios
app.get('/usuarios', (req, res) => {

   //1. El registro de los usuarios debe hacerse con la API Random User usando axios para consultar la data
    axios.get('https://randomuser.me/api/') 
    .then( function(respuesta){
        const filtrados = usuariosfiltrados(respuesta.data.results[0])
               
        res.send(filtrados)
        //imprimir por la consola lista de usuarios con fondo blanco y texto azul
        console.log(chalk.blue.bgWhite(filtrados))

        
    })
    .catch( function(error){
        console.log(error)
    })
}) 

//función usuariosfiltrados para crear lista con los usuarios

let usuarios = [];
const usuariosfiltrados = (data) => {
    const {gender, name: {first, last}} = data;
    usuarios.push({gender, first, last, id: uuidv4().slice(0,6), date: moment().format('MMMM DD YYYY, h:mm:ss a')});
    const [mujeres, hombres] = _.partition(usuarios, u => u.gender === 'female');
 

    let plantilla = `
    <h3>Mujeres:</h3>
    <ol>
    ${mujeres.map(m => `<li>Nombre:${m.first} - Apellido: ${m.last} - ID: ${m.id} - Timestamp: ${m.date}</li>`).join('')}
    </ol>

    <h3>Hombres:</h3>
    <ol>
    ${hombres.map(h => `<li>Nombre: ${h.first} - Apellido: ${h.last} - ID: ${h.id} - Timestamp: ${h.date}</li>`).join('')}
    </ol>
    `

    return plantilla;
}


