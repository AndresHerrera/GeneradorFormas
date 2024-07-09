# Generador Formas

Lee un archivo Excel con columnas de latitud, longitud, distancia y forma para generar un archivo GeoJSON con las cordenadas de la forma especificada (circulo, triangulo, pentágono, octágono) son las categorías que definen el numero de nodos con los  cuales se construye el archivo de salida resultante.

La distancia se debe proporcionar en metros y las coordenadas en grados decimales

**Formas disponibles**

* circulo 20 nodos
* octágono 8 nodos
* pentágono 5 nodos
* triangulo 3 nodos


## INSTALL DEPENDENCIES
```console 
npm install xlsx
```

## RUN 

```console
node index.js
```