---
title: "getByRole, findByRole y waitFor en Testing Library sin pelearte con el DOM"
description: "Guía práctica para elegir entre getByRole, findByRole, queryByRole, waitFor y otras queries de Testing Library sin crear tests frágiles."
h1: "getByRole, findByRole y waitFor: cuándo usar cada uno"
author: "Díaz"
date: "2026-04-30"
image: "https://cdn.diazdavid.es/testing-library/getbyrole-findbyrole-waitfor-testing-library.webp"
---

Si alguna vez has arreglado un test que fallaba de forma intermitente metiendo un `waitFor` "por si acaso", este post te interesa. A mí me ha pasado más veces de las que me gustaría admitir, y casi siempre el problema era el mismo: estaba usando la query equivocada.

Cuando un test de frontend falla de vez en cuando, lo normal es sospechar del componente. Pero muchas veces el fallo está en cómo buscamos los elementos del DOM. Testing Library ofrece varias queries y cada una sirve para una situación distinta: comprobar que algo ya está en pantalla, esperar a que aparezca o asegurarnos de que no existe.

Esta tabla resume las diferencias, y el resto del post explica cada caso con ejemplos:

| Query        | Espera | Si no encuentra             | Cuándo usarla                                   |
| ------------ | ------ | --------------------------- | ----------------------------------------------- |
| `getBy...`   | No     | Lanza error                 | El elemento ya debe estar en pantalla           |
| `findBy...`  | Sí     | Lanza error tras el timeout | El elemento aparecerá tras una acción asíncrona |
| `queryBy...` | No     | Devuelve `null`             | Quieres comprobar que algo no está              |
| `waitFor`    | Sí     | Reintenta la aserción       | Esperas algo que no es encontrar un elemento    |

## Por qué usar getByRole y no otra query

Antes de entrar en las diferencias, una recomendación general: siempre que puedas, busca los elementos por su rol con `getByRole` o alguna de sus variantes (`findByRole`, `queryByRole`, `getAllByRole`...).

El motivo es que los roles se parecen mucho a cómo una persona, o un lector de pantalla, encuentra las cosas en la interfaz: botones, enlaces, encabezados, campos de texto... Si un test puede encontrar un elemento por su rol, suele ser buena señal de que el HTML está bien construido.

```javascript
screen.getByRole("button", { name: /guardar/i });
screen.getByRole("heading", { name: /perfil/i });
screen.getByRole("link", { name: /volver/i });
```

El segundo argumento, `name`, es importante. Sin él estás buscando "un botón cualquiera", y en cuanto haya dos botones en pantalla el test fallará.

```javascript
// Puede haber varios botones y el test fallará
screen.getByRole("button");

// Mejor: busca el botón concreto que el usuario pulsaría
screen.getByRole("button", { name: /crear cuenta/i });
```

## getByRole: el elemento ya está en pantalla

`screen.getByRole` es síncrono: busca el elemento una sola vez. Si no lo encuentra, lanza un error y el test falla en ese momento. Si encuentra más de uno, también falla.

Úsalo cuando el elemento debería existir justo después del `render` o de una acción que ya ha terminado.

```javascript
render(<LoginForm />);

expect(
  screen.getByRole("heading", { name: /iniciar sesión/i }),
).toBeInTheDocument();

await user.click(screen.getByRole("button", { name: /entrar/i }));
```

Por ejemplo, si un click actualiza el estado de forma inmediata, no necesitas esperar nada:

```javascript
const user = userEvent.setup();

render(<Counter />);

await user.click(screen.getByRole("button", { name: /incrementar/i }));

expect(screen.getByRole("status")).toHaveTextContent("1");
```

Aquí no hace falta ni `findByRole` ni `waitFor`. Añadir esperas donde no las hay solo mete ruido y hace que el test parezca más complicado de lo que es.

## findByRole: el elemento aparecerá después

`screen.findByRole` es asíncrono: devuelve una promesa y reintenta la búsqueda hasta que el elemento aparece o se agota el timeout (un segundo por defecto).

Es la opción correcta cuando el DOM cambia después de algo asíncrono: una petición HTTP, una promesa, un loader que tarda en resolverse...

```javascript
const user = userEvent.setup();

render(<UserSearch />);

await user.type(screen.getByRole("textbox", { name: /usuario/i }), "ada");
await user.click(screen.getByRole("button", { name: /buscar/i }));

expect(
  await screen.findByRole("heading", { name: /ada lovelace/i }),
).toBeInTheDocument();
```

Internamente puedes pensar en `findByRole` como un `getByRole` envuelto en un `waitFor`. Por eso no tiene sentido combinarlos:

```javascript
// Redundante: findByRole ya espera por sí solo
await waitFor(async () => {
  expect(await screen.findByRole("alert")).toHaveTextContent(/guardado/i);
});

// Suficiente
expect(await screen.findByRole("alert")).toHaveTextContent(/guardado/i);
```

## queryByRole: el elemento no debe estar

`screen.queryByRole` es síncrono como `getByRole`, pero con una diferencia: si no encuentra nada devuelve `null` en lugar de lanzar un error.

Esto lo convierte en la única opción válida para comprobar que algo no está en el DOM:

```javascript
render(<Dashboard />);

expect(screen.queryByRole("alert")).not.toBeInTheDocument();
```

Si intentas hacer esta comprobación con `getByRole`, el error saltará antes de llegar al `expect`:

```javascript
// Mal: getByRole lanza un error si no encuentra el elemento
expect(screen.getByRole("alert")).not.toBeInTheDocument();

// Bien
expect(screen.queryByRole("alert")).not.toBeInTheDocument();
```

## Las variantes getAllBy, findAllBy y queryAllBy

Cuando esperas más de un elemento, usa las variantes `All`, que devuelven un array:

```javascript
expect(screen.getAllByRole("listitem")).toHaveLength(3);
```

Se comportan igual que sus versiones individuales: `getAllByRole` lanza un error si no encuentra nada, `findAllByRole` espera, y `queryAllByRole` devuelve un array vacío, lo que resulta útil para comprobar ausencias múltiples:

```javascript
expect(screen.queryAllByRole("listitem")).toHaveLength(0);
```

## Cuándo usar waitFor

`waitFor` ejecuta un callback una y otra vez hasta que deja de lanzar errores o se agota el timeout. Como un `expect` que falla lanza un error, en la práctica sirve para esperar a que una aserción se cumpla.

```javascript
await waitFor(() => {
  expect(api.saveUser).toHaveBeenCalledTimes(1);
});
```

Su sitio está en las esperas que no consisten en encontrar un elemento:

- Que un mock haya sido llamado, o llamado con ciertos argumentos.
- Que cambie una URL, un store o cualquier estado externo al DOM.
- Que cambie un atributo o un texto cuando no tienes una query más directa.

```javascript
await user.click(screen.getByRole("button", { name: /guardar/i }));

await waitFor(() => {
  expect(saveUser).toHaveBeenCalledWith({ name: "Ada" });
});
```

## Cuándo no usar waitFor

Si lo que esperas es que aparezca un elemento, usa `findBy...` en lugar de `waitFor`. Hacen lo mismo, pero `findBy...` lo dice más claro:

```javascript
// Funciona, pero hay una forma más directa
await waitFor(() => {
  expect(screen.getByRole("alert")).toHaveTextContent(/guardado/i);
});

// Mejor
expect(await screen.findByRole("alert")).toHaveTextContent(/guardado/i);
```

Y sobre todo, no metas acciones de usuario dentro del callback. Como `waitFor` puede ejecutarlo varias veces, podrías acabar haciendo click varias veces sin darte cuenta:

```javascript
// Mal: el click puede ejecutarse varias veces
await waitFor(async () => {
  await user.click(screen.getByRole("button", { name: /guardar/i }));
  expect(await screen.findByRole("alert")).toBeInTheDocument();
});

// Bien: la acción una vez, y después la espera
await user.click(screen.getByRole("button", { name: /guardar/i }));
expect(await screen.findByRole("alert")).toBeInTheDocument();
```

## Esperar a que un elemento desaparezca

Para esperar a que algo desaparezca, por ejemplo un spinner de carga, Testing Library incluye `waitForElementToBeRemoved`:

```javascript
await waitForElementToBeRemoved(() => screen.queryByRole("status"));
```

También puedes conseguir lo mismo con `waitFor` y `queryByRole`:

```javascript
await waitFor(() => {
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
```

Fíjate en que en ambos casos se usa `queryByRole` y no `getByRole`. Tiene sentido: queremos permitir que el elemento no exista. Con `getByRole`, el test fallaría justo cuando la pantalla hace lo que esperábamos.

## Qué hacer cuando el rol no es suficiente

No todos los elementos se pueden encontrar por rol. El caso típico es el `input type="password"`, que no tiene rol implícito. Para los campos de formulario, `getByLabelText` es una buena alternativa:

```javascript
screen.getByLabelText(/contraseña/i);
```

La documentación de Testing Library recomienda un orden de prioridad para las queries, de más a menos parecido a cómo un usuario percibe la página: primero `getByRole` y `getByLabelText`, después `getByPlaceholderText`, `getByText`, `getByDisplayValue`, `getByAltText` y `getByTitle`, y como último recurso `getByTestId`, que no se corresponde con nada que el usuario pueda ver.

## Acotar la búsqueda con within

Cuando hay elementos repetidos, por ejemplo un botón de editar en cada fila de una tabla, en lugar de inventar textos rebuscados puedes acotar la búsqueda a una zona concreta con `within`:

```javascript
const row = screen.getByRole("row", { name: /ada lovelace/i });

await user.click(within(row).getByRole("button", { name: /editar/i }));
```

El test queda muy fácil de leer: dentro de la fila de Ada, pulsa el botón de editar.

## Conclusión

No hace falta memorizar todas las queries. Basta con tener clara la pregunta que responde cada una: `getByRole` para lo que ya existe, `findByRole` para lo que aparecerá, `queryByRole` para lo que no debe estar y `waitFor` para los efectos que no son elementos del DOM.

La próxima vez que un test te falle de forma intermitente, antes de añadir un `waitFor` "por si acaso", revisa qué query estás usando. Lo más probable es que la solución sea cambiarla por la que de verdad describe lo que esperas de la pantalla.
