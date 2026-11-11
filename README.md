# Elasticsearch Movies

Ejemplo sencillo de Elasticsearch con Node.js: un buscador de películas que indexa documentos JSON, busca texto con tolerancia a errores de escritura y agrupa resultados por género.

Usa la versión gratuita de Elasticsearch, ejecutada localmente con Docker.
start-local inicia con una licencia de prueba de 30 días; después pasa a la licencia gratuita Basic. Este ejemplo no usa funciones de pago.

## Qué demuestra

1. Indexar: carga 15 películas desde `data/movies.json` con un mapping explícito.
2. Buscar: consulta de texto completo con analizador en español y tolerancia a errores (`fuzziness`).
3. Agregar: cuenta cuántas películas hay por género.

## Requisitos

- Node.js 20.6 o superior
- Docker Desktop (en Windows, también WSL)

## Instalación

1. Levantar Elasticsearch y Kibana en local (solo para desarrollo):

   ```
   curl -fsSL https://elastic.co/start-local | sh
   ```

   El script crea la carpeta `elastic-start-local`, con un archivo `.env` que contiene la variable `ES_LOCAL_API_KEY`.

2. Instalar dependencias del proyecto:

   ```
   npm install
   ```

3. Crear el archivo `.env` a partir del ejemplo:

   ```
   cp .env.example .env
   ```

   Reemplazar `ELASTIC_API_KEY` con el valor de `ES_LOCAL_API_KEY`.
   Nunca subas el archivo `.env` al repositorio.

## Uso

```
npm run setup
npm run search -- robot
npm run search -- matrx
npm run search -- astronautas
npm run genres
```

Resultados esperados:

- `robot` encuentra WALL-E, Blade Runner y Terminator 2 por su sinopsis.
- `matrx` (con error de escritura) encuentra The Matrix gracias a `fuzziness`.
- `astronautas` encuentra Interstellar y Gravity.
- `genres` muestra el conteo por género.

## Estructura

```
data/movies.json    Datos de ejemplo
src/config.js       Lectura y validación de variables de entorno
src/client.js       Creación del cliente de Elasticsearch
src/indexer.js      Mapping, creación del índice e indexación masiva
src/search.js       Búsqueda de texto y agregación por género
src/index.js        Comandos: setup, search, genres
```

## Notas

- La versión del paquete `@elastic/elasticsearch` debe coincidir con la versión mayor del servidor.
- La configuración de `start-local` no es segura para producción.
