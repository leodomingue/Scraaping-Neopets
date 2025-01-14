// Descargar dependencias
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL de la pagina a scrapear
const url = "https://items.jellyneo.net/item/63354/";

// Funcion asincronica que scrapea
async function scrapeData() {
    try {
      // Obtener HTML DE LA URL
      const { data } = await axios.get(url);

      // Cargar el HTML DE LA PAGINA
      const $ = cheerio.load(data);

      // En este div se encuentra toda la informacion
      const principalTargetDiv = $('div.row .large-9.small-12.columns.content-wrapper');
      
      if (principalTargetDiv){
        //Busco el Nombre del objeto (es un H1)
        const h1 = principalTargetDiv.find('h1').text().trim();
        if (h1) {
            console.log('Nombre del objeto:', h1); // Muestra el texto del h1 en la consola
        } else {
            console.log('No se encontró un elemento h1 dentro del div especificado.');
        }
        
        //Buscamos la imagen, el precio actual y la descripcion del objeto

        //IMAGEN Y CATEGORIA
        
        const firstSecondaryTargetDiv =  principalTargetDiv.find('div.large-3.push-2.small-12.columns');
        if (firstSecondaryTargetDiv){
            //Imagen
            const imgElement = firstSecondaryTargetDiv.find('p.text-center img');
            if (imgElement){
                const imgSrc = imgElement.attr('src');
                console.log('Ruta de la imagen', imgSrc);
            } else{
                console.log("No se encontró imagen")
            }

            //Categoria
            const liCategory = firstSecondaryTargetDiv.find('ul.small-block-grid-2.large-block-grid-1.no-padding li:nth-of-type(2)');
            const category = liCategory.find('a').text().trim();
            if (category){
                console.log("Categoria del objeto:",category);
            }
            else{
                console.log("No se encontro la categoria del objeto");
            }

        } else{
            console.log("No se encontró el div de las caracteristicas y precio")
        }


        //DESCRIPCION Y PRECIO ACTUAL
        const secondSecondaryTargetDiv = principalTargetDiv.find('div.large-7.push-2.small-12.columns');

        if(secondSecondaryTargetDiv){
            //Descripcion
            const description = secondSecondaryTargetDiv.find("p").first().find('em').text().trim();
            if (description){

                console.log("Descripcion:",description);
            }else{
                console.log("No se encontró descripcion");
            }

            //Precio actual (Puede ser NC o neopuntos)

            //Si es NeoCash
            if (secondSecondaryTargetDiv.find("h3.entry-profile-header").text().split(' ')[0] === "DescriptionNeocash"){
                const price = secondSecondaryTargetDiv.find("div.row .small-4.columns.text-center p strong.nc-text").text().trim();
                if (price){
                    console.log("Precio:",price)
                } else{
                    console.log("No se encontro precio")
                }
            } else{
                //Si son Neopuntos
                const price = secondSecondaryTargetDiv.find('div.pricing-row-container .price-row').text().split(' ')[0] + " " + secondSecondaryTargetDiv.find('div.pricing-row-container .price-row').text().split(' ')[1]
                if (price){
                    console.log("Precio:", price)
                }else{
                    console.log("No se encontró precio");
                }
            }


        }else{
            console.log("No se encontró el div de la descripcion y el precio");
        }


      }else{
        //Si no existe el div
        console.log('No se encontró el div especificado.')

      }

    } catch (error) {
      console.error(error.message);
    }
  }


scrapeData();