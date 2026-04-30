---
title: "Diferencias entre getByRole, findByRole y waitFor en Testing Library"
description: "Guía práctica para elegir entre getByRole, findByRole, queryByRole, waitFor y otras queries de Testing Library al escribir tests de frontend."
h1: "getByRole, findByRole y waitFor: cuándo usar cada uno"
author: "Díaz"
date: "2026-04-30"
image: "https://diazdavid.es/images/bi8Au.webp"
---

Cuando un test de frontend falla de forma intermitente, muchas veces el problema no está en el componente, sino en cómo estamos buscando los elementos.

En Testing Library no es lo mismo usar `screen.getByRole`, `screen.findByRole`, `screen.queryByRole` o envolver una búsqueda en `waitFor`.

La regla rápida es esta:

| Query        | Espera | Si no encuentra          | Úsala cuando                                           |
| ------------ | ------ | ------------------------ | ------------------------------------------------------ |
| `getBy...`   | No     | Lanza error              | El elemento debe estar ya en pantalla                  |
| `findBy...`  | Sí     | Lanza error tras timeout | El elemento aparecerá después de una acción asíncrona  |
| `queryBy...` | No     | Devuelve `null`          | Quieres comprobar que algo no está                     |
| `waitFor`    | Sí     | Reintenta una aserción   | Esperas un efecto que no es solo encontrar un elemento |

## Empieza por el rol

La query más recomendable suele ser `getByRole` o alguna de sus variantes (`findByRole`, `queryByRole`, `getAllByRole`, etc.).

El motivo es que se acerca a cómo una persona o una tecnología asistiva encuentra la interfaz: botones, enlaces, headings, inputs, diálogos, alertas...

```javascript
screen.getByRole("button", { name: /guardar/i });
screen.getByRole("heading", { name: /perfil/i });
screen.getByRole("link", { name: /volver/i });
```

El segundo argumento, `name`, es clave. Evita buscar "un botón cualquiera" y hace explícita la intención del test.

```javascript
// Peor: puede haber varios botones.
screen.getByRole("button");

// Mejor: describe el botón que usaría una persona.
screen.getByRole("button", { name: /crear cuenta/i });
```

## `getByRole`: para lo que ya existe

`screen.getByRole` es síncrono. Busca una vez y devuelve el elemento si lo encuentra.

Si no lo encuentra, falla inmediatamente. Si encuentra más de una coincidencia, también falla.

```javascript
render(<LoginForm />);

expect(
  screen.getByRole("heading", { name: /iniciar sesión/i }),
).toBeInTheDocument();

await user.click(screen.getByRole("button", { name: /entrar/i }));
```

Úsalo cuando el elemento debería estar disponible justo después del `render` o justo después de una acción que ya ha terminado.

```javascript
const user = userEvent.setup();

render(<Counter />);

await user.click(screen.getByRole("button", { name: /incrementar/i }));

expect(screen.getByRole("status")).toHaveTextContent("1");
```

En este ejemplo no hace falta `findByRole` ni `waitFor` si el click actualiza el estado de forma inmediata.

## `findByRole`: para lo que aparecerá después

`screen.findByRole` es asíncrono. Devuelve una promesa y reintenta la búsqueda hasta que el elemento aparece o se agota el timeout.

Es la opción correcta cuando el DOM cambia después de una promesa, una petición mockeada, un loader o cualquier actualización asíncrona.

```javascript
const user = userEvent.setup();

render(<UserSearch />);

await user.type(screen.getByRole("textbox", { name: /usuario/i }), "ada");
await user.click(screen.getByRole("button", { name: /buscar/i }));

expect(
  await screen.findByRole("heading", { name: /ada lovelace/i }),
).toBeInTheDocument();
```

Internamente, puedes pensar en `findByRole` como una combinación de `getByRole` y `waitFor`.

Por eso esto suele ser innecesario:

```javascript
// Evítalo: findByRole ya espera.
await waitFor(async () => {
  expect(
    await screen.findByRole("alert", { name: /guardado/i }),
  ).toBeInTheDocument();
});
```

Mejor:

```javascript
expect(
  await screen.findByRole("alert", { name: /guardado/i }),
).toBeInTheDocument();
```

## `queryByRole`: para comprobar ausencia

`screen.queryByRole` es síncrono, pero no lanza error cuando no encuentra nada. Devuelve `null`.

Eso lo hace perfecto para afirmar que algo no está en el DOM.

```javascript
render(<Dashboard />);

expect(screen.queryByRole("alert", { name: /error/i })).not.toBeInTheDocument();
```

No uses `getByRole` para comprobar ausencia, porque el propio `getByRole` fallaría antes de llegar al `expect`.

```javascript
// Mal: getByRole lanza error si no encuentra el elemento.
expect(screen.getByRole("alert")).not.toBeInTheDocument();

// Bien.
expect(screen.queryByRole("alert")).not.toBeInTheDocument();
```

## `getAllBy`, `findAllBy` y `queryAllBy`

Cuando esperas más de un elemento, usa las variantes `All`.

```javascript
expect(screen.getAllByRole("listitem")).toHaveLength(3);
```

Las reglas son las mismas:

| Query           | Si no encuentra          | Si encuentra uno o más     |
| --------------- | ------------------------ | -------------------------- |
| `getAllBy...`   | Lanza error              | Devuelve array             |
| `findAllBy...`  | Lanza error tras timeout | Devuelve promesa con array |
| `queryAllBy...` | Devuelve `[]`            | Devuelve array             |

Para ausencia múltiple, `queryAllBy...` suele ser más claro.

```javascript
expect(screen.queryAllByRole("listitem")).toHaveLength(0);
```

## Cuándo usar `waitFor`

`waitFor` sirve para esperar a que una aserción deje de fallar.

No espera porque devuelvas `false`. Reintenta porque dentro se lanza un error, normalmente desde un `expect`.

```javascript
await waitFor(() => {
  expect(api.saveUser).toHaveBeenCalledTimes(1);
});
```

Es útil cuando lo que quieres esperar no es simplemente que aparezca un elemento.

Casos habituales:

- Esperar a que un mock haya sido llamado.
- Esperar a que una función se llame con ciertos argumentos.
- Esperar a que una URL, un store o un estado externo cambie.
- Esperar a que un atributo o texto cambie cuando no tienes una query más directa.

```javascript
await user.click(screen.getByRole("button", { name: /guardar/i }));

await waitFor(() => {
  expect(saveUser).toHaveBeenCalledWith({ name: "Ada" });
});
```

## Cuándo no usar `waitFor`

No uses `waitFor` si una query asíncrona expresa mejor la intención.

```javascript
// Más ruido del necesario.
await waitFor(() => {
  expect(screen.getByRole("alert")).toHaveTextContent(/guardado/i);
});
```

Si la alerta aparece después de la acción, usa `findByRole`:

```javascript
expect(await screen.findByRole("alert")).toHaveTextContent(/guardado/i);
```

Tampoco metas acciones de usuario dentro de `waitFor`.

```javascript
// Mal: la acción puede ejecutarse varias veces.
await waitFor(async () => {
  await user.click(screen.getByRole("button", { name: /guardar/i }));
  expect(await screen.findByRole("alert")).toBeInTheDocument();
});
```

Mejor: ejecuta la acción una vez y espera el resultado.

```javascript
await user.click(screen.getByRole("button", { name: /guardar/i }));

expect(await screen.findByRole("alert")).toBeInTheDocument();
```

## Esperar a que algo desaparezca

Para desapariciones, la alternativa más clara suele ser `waitForElementToBeRemoved`.

```javascript
await waitForElementToBeRemoved(() =>
  screen.queryByRole("status", { name: /cargando/i }),
);
```

También puedes usar `waitFor` con `queryByRole`.

```javascript
await waitFor(() => {
  expect(
    screen.queryByRole("status", { name: /cargando/i }),
  ).not.toBeInTheDocument();
});
```

La diferencia importante es que para desaparición debes usar `queryBy...`, no `getBy...`, porque quieres permitir que el elemento no exista.

## Otras formas de buscar en un test

Testing Library recomienda buscar de la forma más parecida posible a como una persona usa la interfaz.

El orden práctico sería:

1. `getByRole` con `name` para botones, enlaces, headings, diálogos, alerts y la mayoría de elementos interactivos.
2. `getByLabelText` para campos de formulario, especialmente cuando el rol no es suficiente.
3. `getByPlaceholderText` solo si no hay label, aunque el placeholder no debería sustituir al label.
4. `getByText` para textos no interactivos.
5. `getByDisplayValue` para valores actuales de inputs.
6. `getByAltText` para imágenes relevantes.
7. `getByTitle` si el `title` forma parte real de la experiencia.
8. `getByTestId` como último recurso.

Un caso típico: `input type="password"` no tiene rol implícito, así que aquí `getByLabelText` es mejor que intentar forzar `getByRole`.

```javascript
screen.getByLabelText(/contraseña/i);
```

## Limitar la búsqueda con `within`

Si hay elementos repetidos, en vez de usar textos demasiado específicos, puedes acotar la búsqueda a una zona.

```javascript
const row = screen.getByRole("row", { name: /ada lovelace/i });

await user.click(within(row).getByRole("button", { name: /editar/i }));
```

Esto hace que el test diga: "dentro de la fila de Ada, pulsa editar".

## Checklist rápido

Si dudas, decide así:

| Situación                             | Usa                                                |
| ------------------------------------- | -------------------------------------------------- |
| El elemento debe existir ya           | `getByRole`                                        |
| El elemento aparecerá después         | `findByRole`                                       |
| El elemento no debe existir           | `queryByRole`                                      |
| Hay varios elementos                  | `getAllByRole`, `findAllByRole` o `queryAllByRole` |
| Esperas una llamada a un mock         | `waitFor`                                          |
| Esperas que desaparezca un loader     | `waitForElementToBeRemoved`                        |
| Buscas dentro de una sección concreta | `within`                                           |

La idea no es memorizar todas las APIs. La idea es que la query cuente la intención del test: existe ahora, aparecerá después, no debe estar, hay varios o estoy esperando un efecto secundario.
