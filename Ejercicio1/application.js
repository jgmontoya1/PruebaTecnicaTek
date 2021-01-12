// Carga de modulos necesarios y creación de nueva aplicacion.
var express = require("express"); 
var app = express();
var bodyParser = require('body-parser');
var request = require("request");

// URL con con informacion de contagiados.
var url = "https://www.datos.gov.co/resource/gt2j-8ykr.json"

// estructura de datos a usar
data_filtrada = {
    masculino: {
        '0-20': [],
        '20-40': [],
        '40 o mas': []
    },
    femenino: {
        '0-20': [],
        '20-40': [],
        '40 o mas': []
    }
}

// Soporte para bodies codificados en jsonsupport.
app.use(bodyParser.json());
// Soporte para bodies codificados
app.use(bodyParser.urlencoded({ extended: true })); 
 
// Consumimos datos de la URL: https://www.datos.gov.co/resource/gt2j-8ykr.json
app.get('/contagiados', function(req, res) {
	request({
	    url: url,
	    json: false
	}, (error, response, body) => {
	    if (!error && response.statusCode === 200) {
            // Convert JSON to javascript object
            contagiados = JSON.parse(body)
            contagiados.forEach(clasificar_contagiados);  

	    	// Pintamos la respuesta JSON en navegador.
	        res.send(data_filtrada) 
	    }
	})
});

function clasificar_contagiados (contagiado) {
    switch (contagiado.sexo) {
        case 'F':
            clasificar_en_edades(contagiado, 'femenino');
            break;

        case 'M':
            clasificar_en_edades(contagiado, 'masculino');
            break;

        default:
            break;
    }
}

function clasificar_en_edades(contagiado, sexo) {
    if (contagiado.edad >= 0 && contagiado.edad < 20) {
        data_filtrada[sexo]['0-20'].push(contagiado)
    } else if (contagiado.edad >= 20 && contagiado.edad < 40) {
        data_filtrada[sexo]['20-40'].push(contagiado)
    } else {
        data_filtrada[sexo]['40 o mas'].push(contagiado)
    }
}
  
var server = app.listen(8888, () => {
    console.log('Corriendo server..'); 
});