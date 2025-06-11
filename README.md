# Bookea - Sistema de Gestión de Turnos

Bookea es una aplicación web para la gestión de turnos y reservas, diseñada para dos tipos de clientes:
- Clubes deportivos (pádel, fútbol, tenis, etc.)
- Comercios (peluquerías, centros de estética, etc.)

## Características

### Para Dueños de Negocios
- Panel de administración
- Gestión de servicios/canchas
- Configuración de horarios
- Gestión de turnos
- Visualización de agenda

### Para Clientes
- Visualización de disponibilidad
- Reserva de turnos
- Gestión de datos personales
- Confirmación de reservas

## Tecnologías Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)
- React

## Requisitos Previos

- Node.js 18 o superior
- PostgreSQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/bookea?schema=public"
```

4. Inicializar la base de datos:
```bash
npx prisma migrate dev
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
  ├── app/              # Rutas y páginas de la aplicación
  ├── components/       # Componentes reutilizables
  ├── lib/             # Utilidades y configuraciones
  └── types/           # Definiciones de tipos TypeScript
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles. 