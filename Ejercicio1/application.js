// Carga de modulos necesarios y creación de nueva aplicacion.
var express = require("express"); 
var app = express();
var bodyParser = require('body-parser');
var request = require("request");

// URL con contenido JSON demostrativo.
var url = "https://www.datos.gov.co/resource/gt2j-8ykr.json"

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

            // filtrar contagiado por tango de edad y genero 
            data_filtrada = {
                masculino: {
                    '0-20': obtener_rangoEdad_genero(contagiados, 0, 20, "M"),
                    '20-40': obtener_rangoEdad_genero(contagiados, 20, 40, "M"),
                    '40 o mas': obtener_rangoEdad_genero(contagiados, 40, "M")
                },
                femenino: {
                    '0-20': obtener_rangoEdad_genero(contagiados, 0, 20, "F"),
                    '20-40': obtener_rangoEdad_genero(contagiados, 20, 40, "F"),
                    '40 o mas': obtener_rangoEdad_genero(contagiados, 40, "F")
                }
            }   

	    	// Pintamos la respuesta JSON en navegador.
	        res.send(data_filtrada) 
	    }
	})
});

function obtener_rangoEdad_genero (contagiados, minEdad, maxEdad, genero) {
    if (minEdad == 40) {
        return contagiados.filter(
            contagiado => parseInt(contagiado.edad) >= minEdad && contagiado.sexo == genero
        );
    }

    return (
        contagiados.filter(
            contagiado => (parseInt(contagiado.edad) >= minEdad && parseInt(contagiado.edad) < maxEdad) && 
                        contagiado.sexo == genero
        )
    );
}
  
var server = app.listen(8888, () => {
    console.log('Corriendo server..'); 
});