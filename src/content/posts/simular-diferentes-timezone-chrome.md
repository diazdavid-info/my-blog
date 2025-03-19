---
title: "Simular diferentes timezone en el navegador Chrome"
description: "Si necesitas simular diferentes timezones, puedes hacerlo de una forma muy fácil en Chrome."
h1: "Simular diferentes timezone en el navegador Chrome"
author: "Díaz"
date: "2025-03-17"
image: "https://cdn.diazdavid.es/timezone-chrome/simular-timezone-chrome.webp"
---

Cuando tu aplicación web es utilizada en distintas partes del mundo, es posible que necesites cambiar la zona horaria del 
navegador para verificar su comportamiento en diferentes husos horarios.

Afortunadamente, Chrome ofrece una forma sencilla de simular distintos timezones.

## Abrir las herramientas de desarrollo

Chrome incluye un sensor de geolocalización dentro de sus herramientas de desarrollo, el cual permite cambiar la zona horaria.

Para acceder a esta opción:

1. Abre las herramientas de desarrollo (F12 o Ctrl + Shift + I).
2. Haz clic en el menú de los tres puntos.
3. Ve a "More tools" (Más herramientas).
4. Selecciona "Sensors" (Sensores).

![Abrir sensors en las herramientas de desarrollo](https://cdn.diazdavid.es/timezone-chrome/sensor-herramientas-desarrollo.webp)

## Configurar diferentes localizaciones

En la sección "Sensors", puedes seleccionar una ubicación predefinida o crear una nueva con la zona horaria deseada.

![Configurar sensor con diferente localización](https://cdn.diazdavid.es/timezone-chrome/configurar-sensor.webp)

## Comprobar nueva configuración

Para verificar que el cambio se ha aplicado correctamente, ejecuta el siguiente comando en la consola de desarrollo:

```javascript
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
```

Deberías ver un resultado similar a este, reflejando la nueva configuración:

![Test para comprobar que funciona la nueva localización](https://cdn.diazdavid.es/timezone-chrome/comprobar-que-funciona-el-nuevo-timezone.webp)
