# Taller – API de Personajes Marvel con NestJS

Realizado por: Andrés Felipe Rodriguez Acosta - 202322292 y Sofía Garzón Mariño - 202413102

## Instalación y ejecución:

### 1. Iniciar PostgreSQL con Docker: Desde la carpeta principal del proyecto se debe abrir Docker Desktop y esperar a que esté funcionando. Después, se ejecuta: docker compose up -d
La primera vez que se ejecuta este comando, Docker crea el contenedor de PostgreSQL y carga las tablas teams y characters junto con los datos iniciales que están en db/init.sql. Y para comprobar que el contenedor está funcionando correctamente, se puede ejecutar: docker compose ps

### 2. Configurar la conexión a la base de datos: Una vez esté funcionando PostgreSQL, se entra a la carpeta donde se encuentra el proyecto de NestJS: cd marvel-characteres
Después, se debe crear .env a partir del archivo .env.example que está en la carpeta principal. Se puede hacer con el siguiente comando: powershell
Copy-Item ..\.env.example .\.env

### 3. Instalar las dependencias: Antes de iniciar la aplicación, se deben instalar las librerías necesarias para ejecutar la API: npm ci

### 4. Ejecutar la aplicación: Cuando las dependencias estén instaladas y PostgreSQL esté funcionando, se puede iniciar el servidor de NestJS con: npm run start:dev
Después de que inicie de forma correcta, la API estará disponible en: http://localhost:3000
