---
title: 'Como debbugear un proyecto de React con IntelliJ'
author: 'Díaz'
date: '2024-12-30'
image: 'https://cdn.diazdavid.es/debug-react-intellij/debugger-react-intellij.webp'
---

Arrancamos nuestro proyecto de React con el comando:
```bash
npm run dev
```

Abrimos Intellij, hacemos doble shift y buscamos: **Edit Configurations**
![Pantalla donde podemos buscar la configuración del debug](https://cdn.diazdavid.es/debug-react-intellij/buscar-config.webp)

Ahora añadimos una nueva configuración del tipo **JavaScript Debug**
![Pantalla donde creamos una nueva configuración del tipo JavaScript Debug](https://cdn.diazdavid.es/debug-react-intellij/crear-javascript-debug.webp)

Le ponemos un **nombre** y le configuramos la **URL** y el **puerto** de nuestro proyecto
![Pantalla donde añadimos las configuraciones de nuestro proyecto](https://cdn.diazdavid.es/debug-react-intellij/configurar-run.webp)
