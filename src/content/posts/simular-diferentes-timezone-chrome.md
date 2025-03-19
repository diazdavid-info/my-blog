---
title: "Simular diferentes timezone en el navegador Chrome"
description: "Si necesitas simular diferentes timezones, puedes hacerlo de una forma muy fácil en Chrome."
h1: "Simular diferentes timezone en el navegador Chrome"
author: "Díaz"
date: "2025-03-17"
image: "https://cdn.diazdavid.es/timezone-chrome/simular-timezone-chrome.webp"
---

Cuando tu aplicación wbe está siendo usada desde diferentes partes del mundo, es posible que necesites cambiar el timezone de
tu navegador para ver como se comporta en diferentes usos horarios.

Afortunadamente, en Chrome hay una forma muy sencilla de poder simular diferentes timezones.

## Abrir las herramientas de desarrollo

Chrome, en sus herramientas de desarrollo, incorpora un un sensor de geolocalización que permite cambiarlo.

Para ello, abrimos las herramientas de desarrollo, después le damos al menú de los tres puntos, le damos a "more tools" y
por ultimo le damos a "Sensors".

![Abrir sensors en las herramientas de desarrollo](https://cdn.diazdavid.es/timezone-chrome/sensor-herramientas-desarrollo.webp)

## Configurar diferentes localizaciones

Una vez que estamos en la parte de "Sensors", ya podemos cambiar a nuestro gusto la localización del listado que viene
predefinido o crear una nueva localización.

![Configurar sensor con diferente localización](https://cdn.diazdavid.es/timezone-chrome/configurar-sensor.webp)

## Comprobar nueva configuración

Si queremos comprobar si el sensor nos está funcionando correctamente, podemos ejecutar en la consola el siguiente comando:

```javascript
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
```

Y debería darnos un resultado similar a:

![Test para comprobar que funciona la nueva localización](https://cdn.diazdavid.es/timezone-chrome/comprobar-que-funciona-el-nuevo-timezone.webp)
