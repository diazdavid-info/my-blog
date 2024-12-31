---
title: 'Cómo configurar el debug de un proyecto React con IntelliJ'
author: 'Díaz'
date: '2024-12-30'
image: 'https://cdn.diazdavid.es/debug-react-intellij/debugger-react-intellij.webp'
---

En este post, aprenderemos a configurar el entorno de depuración para un proyecto de React utilizando IntelliJ IDEA. 
Este proceso nos permitirá depurar nuestro código de manera eficiente, añadiendo breakpoints y analizando el flujo de ejecución de nuestra aplicación.

## Paso 1: Arrancar el proyecto de React

Primero, debemos iniciar nuestro proyecto de React. Para ello, ejecutamos el siguiente comando en la terminal:
```bash
npm run dev
```
Esto arrancará el servidor de desarrollo y nos proporcionará la URL y el puerto donde se ejecuta nuestra aplicación (por ejemplo, http://localhost:3000).

## Paso 2: Abrir las configuraciones en IntelliJ IDEA
Abrimos IntelliJ IDEA, presionamos **doble Shift** para abrir la barra de búsqueda y escribimos: **Edit Configurations**
![Pantalla donde podemos buscar la configuración del debug](https://cdn.diazdavid.es/debug-react-intellij/buscar-config.webp)

## Paso 3: Crear una nueva configuración de depuración
En la ventana de configuraciones, añadimos una nueva configuración del tipo **JavaScript Debug.**
![Pantalla donde creamos una nueva configuración del tipo JavaScript Debug](https://cdn.diazdavid.es/debug-react-intellij/crear-javascript-debug.webp)

A continuación:
1. Asignamos **un nombre** a la configuración (por ejemplo, "Debug").
2. Configuramos **la URL y el puerto** de nuestro proyecto. Por ejemplo, si nuestra aplicación corre en http://localhost:3000, esa será la URL que debemos especificar.

![Pantalla donde añadimos las configuraciones de nuestro proyecto](https://cdn.diazdavid.es/debug-react-intellij/configurar-run.webp)

## Paso 4: Ejecutar la depuración
Una vez configurado, ya estamos listos para iniciar el proceso de depuración.
1. Volvemos a presionar doble Shift y buscamos: **Run.**
2. Seleccionamos la opción de **Debug** que hemos creado previamente.

![Pantalla donde añadimos las configuraciones de nuestro proyecto](https://cdn.diazdavid.es/debug-react-intellij/seleccionar-debug.webp)

## Paso 5: Añadir breakpoints y depurar
Cuando seleccionemos la opción de Debug, se abrirá una ventana en el navegador que hayamos configurado (por defecto, Chrome).
Ahora podemos añadir breakpoints directamente en nuestro código y analizar el flujo de ejecución.
![Pantalla donde añadimos las configuraciones de nuestro proyecto](https://cdn.diazdavid.es/debug-react-intellij/resultado-final.webp)

## Conclusión
Con estos pasos, tendrás configurado el entorno de depuración para tu proyecto React en IntelliJ IDEA.
Esto te permitirá identificar errores, optimizar tu código y mejorar la experiencia de desarrollo.
Si encuentras algún problema durante el proceso, revisa que la URL y el puerto coincidan con los de tu servidor de desarrollo.
