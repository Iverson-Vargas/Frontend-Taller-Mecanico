# 🚗 Frontend - Taller Mecánico

Interfaz de usuario intuitiva diseñada para la gestión eficiente de un taller mecánico.

## Instrucciones de instalación

1. Clona este repositorio en tu máquina local.
2. Abre una terminal en la carpeta raíz del proyecto.
3. Ejecuta el siguiente comando para instalar las dependencias necesarias:

```
npm install
```

## Tecnologías utilizadas

Este proyecto fue creado utilizando las siguientes tecnologías:

- **Vite**: Para la configuración inicial del proyecto.
- **React**: Para la construcción de la interfaz de usuario.
- **Yarn**: Como gestor de paquetes durante la creación del proyecto.
- **Tailwind CSS**: Para el diseño y estilos de la aplicación.

## Comandos Git

A continuación, se detallan los comandos básicos de Git que se utilizan en este proyecto:

- **`git clone <url-del-repositorio>`**: Clona el repositorio en tu máquina local.
- **`git pull`**: Descarga los últimos cambios del repositorio remoto.
- **`git checkout <nombre-de-la-rama>`**: Cambia a la rama especificada.
- **`git branch <nombre-de-la-rama>`**: Crea una nueva rama.
- **`git add .`**: Agrega los cambios realizados al área de preparación (staging area).
- **`git commit -m "mensaje"`**: Crea un commit con los cambios agregados.
- **`git push origin <nombre-de-la-rama>`**: Sube los cambios de la rama local al repositorio remoto.
- **`git merge <nombre-de-la-rama>`**: Fusiona los cambios de una rama a la rama actual.
- **`git branch -d <nombre-de-la-rama>`**: Elimina una rama local.

## Flujo de trabajo con ramas

En este proyecto, trabajamos con dos ramas principales:

1. **`main`**: Es la rama principal y estable del proyecto.
2. **`desarrollo`**: Es la rama donde se realizan los desarrollos y pruebas antes de fusionar los cambios a la rama principal.

### Pasos para realizar una modificación:

1. Posiciónate en la rama de desarrollo:

   ```bash
   git checkout desarrollo
   ```

2. Crea una nueva rama para realizar tus cambios:

   ```bash
   git checkout -b <nombre-de-tu-rama>
   ```

3. Realiza las modificaciones necesarias en tu rama.

4. Agrega los cambios al área de preparación y crea un commit:

   ```bash
   git add .
   git commit -m "Descripción de los cambios realizados"
   ```

5. Sube los cambios al repositorio remoto:

   ```bash
   git push origin <nombre-de-tu-rama>
   ```

6. Cambia a la rama de desarrollo:

   ```bash
   git checkout desarrollo
   ```

7. Fusiona los cambios de tu rama a la rama de desarrollo:

   ```bash
   git merge <nombre-de-tu-rama>
   ```

8. Una vez que los cambios han sido fusionados correctamente, elimina la rama que creaste:

   ```bash
   git branch -d <nombre-de-tu-rama>
   ```

Este flujo de trabajo asegura que la rama principal (`main`) se mantenga estable y que los desarrollos se realicen de manera ordenada.

¡Gracias por usar nuestra aplicación para la gestión de talleres mecánicos!
