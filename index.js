const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var request = require("request");

// URL con contenido JSON de contagiados
var url = "https://www.datos.gov.co/resource/gt2j-8ykr.json";

// Soporte para bodies codificados en jsonsupport.
app.use(bodyParser.json());
// Soporte para bodies codificados
app.use(bodyParser.urlencoded({ extended: true }));

//consumimos datos de la URL
app.get("/contagiados", function (req, res) {
    request(
        {
            url: url,
            json: false,
        },
        (error, response, body) => {
            if (!error && response.statusCode == 200) {
                contagiados = JSON.parse(body);

                // filtrar contagiado por rango de edad y genero
                data_filtrada = {
                    masculino: {
                        "0-20": obtener_rangoEdad_genero(contagiados, "M", 0, 20),
                        "20-40": obtener_rangoEdad_genero(contagiados, "M", 20, 40),
                        "40 o mas": obtener_rangoEdad_genero(contagiados, "M", 40),
                    },
                    femenino: {
                        "0-20": obtener_rangoEdad_genero(contagiados, "F", 0, 20),
                        "20-40": obtener_rangoEdad_genero(contagiados, "F", 20, 40),
                        "40 o mas": obtener_rangoEdad_genero(contagiados, "F", 40),
                    },
                };
                // Escribimos la respuesta JSON en navegador.
                res.send(data_filtrada);
            }
        }
    );
});

function obtener_rangoEdad_genero(contagiados, genero, minEdad, maxEdad) {
    if (minEdad == 40) {
        return contagiados.filter((contagiado) => parseInt(contagiado.edad) >= minEdad && contagiado.sexo == genero);
    }

    return contagiados.filter(
        (contagiado) =>
            parseInt(contagiado.edad) >= minEdad && parseInt(contagiado.edad) < maxEdad && contagiado.sexo == genero
    );
}

app.use(express.static(__dirname + "/public/"));

app.listen("3000", function () {
    console.log("Servidor web corriendo..");
});
