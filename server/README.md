## Database Setup and Management

### 🚀 Setup Instructions

#### Start Docker

-   Start Docker containers with `docker-compose up -d`

#### Log in to pgAdmin

-   Open pgAdmin at `localhost:5050`
-   Log in with `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` from `.env`

#### Register the PostgreSQL Server

-   Right-click `Servers -> Register -> Server`
-   General Tab:
    -   **Name**: Add a custom name for the database
-   Connection Tab:
    -   **Host name/address**: `postgres` (corresponds to service name in docker-compose.yml)
    -   **Port**: `5432` (default PostgreSQL port)
    -   **Username**: `POSTGRES_USER` from `.env` file
    -   **Password**: `POSTGRES_PASSWORD` from `.env` file
-   Save the configuration

### ⚙️ Managing Migrations

**Generate**: `npm run migration:generate src/migration/name_of_migration`

**Run**: `npm run migration:run`

**Revert**: `npm run migration:revert`

> [!IMPORTANT]
>
> ## Intellectual Property
>
> This project is my intellectual property, **_Mihaiu Sorin-Ionut_**, and it is designed for educational and reference purposes. It showcases the application of design patterns in a practical context, demonstrating how even a simple game can be architecturally complex and thoughtfully structured. For more information on permissible use, please refer to the LICENSE file in this repository.
