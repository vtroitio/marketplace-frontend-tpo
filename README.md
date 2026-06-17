# SKINDEX Marketplace Frontend - TPO Grupo 7

Frontend del sistema Marketplace desarrollado como Trabajo Práctico Obligatorio para la materia Aplicaciones Interactivas en UADE.

SKINDEX está desarrollado con **React + Vite + Tailwind CSS**, un marketplace de moda geek.

## Integrantes

| Alumno                  | LU      | Mail UADE                    |
|-------------------------|---------|------------------------------|
| Garcia, Matias Nicolas  | 1184534 | <matiasngarcia@uade.edu.ar>  |
| Giulietti, Juan Manuel  | 1199949 | <jgiulietti@uade.edu.ar>     |
| Rodriguez, Tobias       | 1177362 | <tobiarodriguez@uade.edu.ar> |
| Troitiño, Valentin Blas | 1205019 | <vtroitino@uade.edu.ar>      |

## Requisitos previos

Antes de instalar el proyecto, asegurate de tener instalado:

- [Node.js](https://nodejs.org/es/download)

Podés verificarlo ejecutando:

```bash
node -v
npm -v
```

Ahora se deben instalar las dependencias:

```bash
npm install
```

## Uso

Para levantar el servidor local:

```bash
npm run dev
```

Luego abrir en el navegador la URL que indique la terminal, normalmente:

```bash
http://localhost:5173
```

## Estructura del proyecto
```
src/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   └── icons/
├── pages/
├── App.jsx
├── main.jsx
└── index.css
```

### Componentes principales
- `components/ui`: componentes reutilizables como botones, links, inputs y selects.
- `components/layout`: componentes de estructura general como navbar, footer y contenedores.
- `components/icons`: iconos SVG utilizados en la interfaz.
- `pages`: pantallas principales del sitio.
- `index.css`: estilos globales, configuración de Tailwind y tokens visuales del design system.

### Componentes de UI

El proyecto cuenta con una serie de componentes reutilizables dentro de `src/components/ui`. Estos componentes permiten mantener una interfaz consistente, evitar repetir clases de Tailwind en muchas partes del código y facilitar cambios generales de diseño.

### `Button`

Componente utilizado para acciones principales, secundarias o de texto.

Permite manejar variantes visuales mediante la prop `variant`.

```jsx
<Button>Comprar</Button>

<Button variant="outline">
  Ver detalle
</Button>

<Button variant="text">
  Cancelar
</Button>
````

Variantes disponibles:

* `primary`: botón principal con fondo sólido.
* `outline`: botón con borde y fondo transparente.
* `text`: botón simple sin fondo, pensado para acciones secundarias.

También permite recibir contenido interno mediante `children`, por lo que se pueden incluir textos, iconos o ambos:

```jsx
<Button>
  <span>Continuar</span>
  <RightArrowIcon />
</Button>
```

---

### `AppLink`

Componente utilizado para enlaces de navegación o acciones que llevan a otra sección.

Recibe el contenido como `children`, lo que permite usar texto solo o texto acompañado de iconos.

```jsx
<AppLink to="#">
  AppLink
</AppLink>
```

Con icono:

```jsx
<AppLink variant="underline" to="#">
  <span>Ver más</span>
  <RightArrowIcon />
</AppLink>
```

Variantes disponibles:

* `primary`: link normal.
* `underline`: link subrayado.

El componente usa `inline-flex`, por lo que el texto y los iconos quedan alineados en la misma línea.

---

### `Logo`

Componente utilizado para mostrar la marca `SKINDEX`.

```jsx
<Logo />
```
---

### `Input`

Componente reutilizable para campos de entrada.

Este componente mantiene el estilo visual definido en el design system y se comporta como un `<input>` nativo de HTML, por lo que puede recibir props como `type`, `placeholder`, `value`, `onChange`, `required`, `disabled`, entre otras.

```jsx
<Input
  label="Nombre"
  type="text"
  placeholder="Ingresá tu nombre"
/>
```

Además, incluye comportamiento especial para campos de contraseña: cuando `type="password"`, el componente muestra automáticamente un botón con icono para alternar entre mostrar y ocultar la contraseña.

```jsx
<Input
  label="Contraseña"
  type="password"
  placeholder="Ingresá tu contraseña"
/>
```

Prop disponible:
* `label`: Para cambiar el texto del label
---

### `Textarea`

Componente utilizado para campos de texto largo.

Mantiene el mismo estilo visual que el `Input`, pero con mayor altura.

```jsx
<Textarea
  label="Descripción"
  placeholder="Escribí una descripción"
/>
```

Se usa para formularios donde el usuario necesita ingresar contenido más extenso.

---

### `Select`

Componente reutilizable para campos de selección.

Este componente mantiene el estilo visual definido en el design system y se comporta como un `<select>` nativo de HTML. Recibe opciones mediante `children`, por lo que las opciones se definen usando elementos `<option>`.

```jsx
<Select
  label="Categoría"
  placeholder="Seleccionar categoría"
  value={category}
  onChange={(event) => setCategory(event.target.value)}
>
  <option value="remeras">Remeras</option>
  <option value="buzos">Buzos</option>
  <option value="accesorios">Accesorios</option>
</Select>
```

El componente agrega automáticamente una opción inicial:

```jsx
<option value="" disabled hidden>
  {placeholder}
</option>
```

Esto permite mostrar un placeholder al inicio, pero evita que quede disponible como opción seleccionable.

Para saber qué opción seleccionó el usuario, se usa event.target.value dentro del onChange:

```jsx
<Select
  label="Talle"
  placeholder="Seleccionar talle"
  value={size}
  onChange={(event) => setSize(event.target.value)}
>
  <option value="s">S</option>
  <option value="m">M</option>
  <option value="l">L</option>
  <option value="xl">XL</option>
</Select>
```
Prop disponible:
* `label`: Para cambiar el texto del label

### `Toast`

Componente utilizado para mostrar notificaciones temporales en la interfaz.

Desde cualquier componente dentro de la aplicación, se puede usar el hook `useToast`:

```jsx
import { useToast } from "../toast/ToastContext.jsx";

export function HowToUseToasts() {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success("Operación realizada correctamente")}>
        Mostrar éxito
      </button>

      <button onClick={() => toast.error("Ocurrió un error")}>
        Mostrar error
      </button>

      <button onClick={() => toast.warning("Revisá los datos ingresados")}>
        Mostrar advertencia
      </button>

      <button onClick={() => toast.info("Información importante")}>
        Mostrar información
      </button>
    </div>
  );
}
```

Métodos disponibles:

* `toast.success(message, options)`: muestra una notificación de éxito.
* `toast.error(message, options)`: muestra una notificación de error.
* `toast.warning(message, options)`: muestra una advertencia.
* `toast.info(message, options)`: muestra una notificación informativa.
* `toast.showToast(options)`: permite crear un toast personalizado.
* `toast.removeToast(id)`: permite cerrar un toast manualmente.

También se pueden pasar opciones adicionales como `title` y `duration`:

```jsx
toast.success("Producto publicado", {
  title: "Éxito",
  duration: 3000,
});
```

Si se quiere que el toast no se cierre automáticamente, se puede usar:

```jsx
toast.info("Este mensaje queda fijo", {
  duration: Infinity,
});
```

