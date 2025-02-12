---
title: "Cómo comprimir y descomprimir con tar"
description: "En este post, aprenderemos a usar tar para comprimir y descomprimir archivos."
h1: "Cómo usar tar para comprimir y descomprimir archivos"
author: "Díaz"
date: "2025-02-12"
image: "https://cdn.diazdavid.es/compress-tar/post-comprimir-descomprimir-tar.webp"
---

## Comprimir con tar
Para crear un archivo .tar.gz (comprimido con gzip) que incluya varios directorios,
puedes usar el comando tar en Linux/macOS o WSL (Windows Subsystem for Linux). Aquí está la sintaxis básica:

```bash
tar -czvf nombre_del_archivo.tar.gz directorio1 directorio2 directorio3 ...
```

Explicación de los parámetros:
- -c: Crear un nuevo archivo.
- -z: Comprimir el archivo con gzip (para que termine en .tar.gz).
- -v: Modo verbose (muestra el progreso en la terminal, opcional).
- -f: Especifica el nombre del archivo de salida.

### Ejemplo 1: Directorios en la misma ubicación
Si tienes tres directorios (dir1, dir2, dir3) y quieres comprimirlos en un archivo backup.tar.gz:

```bash
tar -czvf backup.tar.gz dir1 dir2 dir3
```

### Ejemplo 2: Usar patrones (wildcards)
Si los directorios siguen un patrón (ej: project-2023, project-2024):

```bash
tar -czvf proyectos.tar.gz project-*
```

### Ejemplo 3: Directorios en rutas diferentes
Si los directorios están en rutas distintas:

```bash
tar -czvf archivo_comprimido.tar.gz /ruta/al/dir1 /otra/ruta/dir2
```

### Verificar el archivo creado
Para listar el contenido del .tar.gz sin descomprimirlo:

```bash
tar -tzvf archivo_comprimido.tar.gz
```

### Notas importantes

- Orden de los parámetros: El nombre del archivo (-f) debe ir inmediatamente después de la opción -f.
- Excluir archivos/directorios: Si necesitas excluir elementos, usa --exclude=nombre.
- Compresión alternativa: Usa -j en lugar de -z para comprimir con bzip2 (genera .tar.bz2).

### Ejemplo avanzado (excluyendo un subdirectorio):

```bash
tar -czvf backup.tar.gz --exclude="dir1/no_deseado" dir1 dir2
```

## Descomprimir con tar
Para descomprimir un archivo .tar.gz, utiliza el comando tar con los parámetros adecuados. 
Aquí te explico cómo hacerlo:

### Comando básico para descomprimir
```bash
tar -xzvf archivo.tar.gz
```

Explicación de los parámetros:
- -x: Extraer el contenido del archivo.
- -z: Descomprimir con gzip (requerido para .tar.gz).
- -v: Modo verbose (muestra los archivos al descomprimirlos, opcional).
- -f: Especifica el nombre del archivo a descomprimir.

### Ejemplo 1: Descomprimir en el directorio actual
```bash
tar -xzvf backup.tar.gz
```

Esto extraerá todos los archivos y directorios en la ubicación donde estés ejecutando el comando.

### Ejemplo 2: Descomprimir en un directorio específico
Si quieres que los archivos se extraigan en una carpeta concreta (ej: ~/documentos/backup):

```bash
tar -xzvf backup.tar.gz -C ~/documentos/backup
```

El parámetro -C indica el directorio de destino.

### Ejemplo 3: Listar contenido sin descomprimir
Para ver qué contiene el archivo antes de extraerlo:

```bash
tar -tzvf backup.tar.gz
```

### Notas importantes
- Orden de los parámetros: El -f debe ir seguido del nombre del archivo (igual que al comprimir).
- Permisos: Asegúrate de tener permisos de escritura en el directorio de destino.
- Archivos con rutas absolutas: Si el .tar.gz fue creado con rutas absolutas (ej: /etc/archivo), al descomprimirlo podría sobrescribir archivos del sistema. Usa -C para evitar esto.

### Otros formatos de compresión:
- .tar.bz2 (compresión con bzip2):
```bash
tar -xjvf archivo.tar.bz2
```
(usa -j en lugar de -z).

- .tar.xz (compresión con xz):

```bash
tar -xJvf archivo.tar.xz
```

### ¿Y si solo es un .gz (sin .tar)?
Si es un único archivo comprimido con gzip (ej: archivo.txt.gz), descomprime con:

```bash
gzip -d archivo.txt.gz
```
