# Twenty CRM Service

Twenty is a modern, open-source CRM (Customer Relationship Management) platform designed to help you manage your customer relationships effectively.

## Prerequisites

- **PostgreSQL Database**: Twenty requires a PostgreSQL database. You need to have the `TWENTY_DATABASE_URL` environment variable set in your system.
- **Docker & Docker Compose**: Make sure both are installed and up-to-date.
- **RAM**: At least 2GB of RAM recommended.

## Quick Start

### 1. Configure the Service

```bash
# Generate a secure APP_SECRET
openssl rand -base64 32

# Edit the .env file and add the generated secret
# The TWENTY_DATABASE_URL will be read from your environment
```

### 2. Start the Service

```bash
# Using shell function (after chezmoi apply)
twenty-start

# Or using docker-compose
docker-compose up -d

# Or using task
task -g services:start:twenty
```

### 3. Access Twenty

Open your browser and navigate to: http://localhost:3000

## Configuration

### Required Environment Variables

- **TWENTY_DATABASE_URL**: Must be set in your environment. Format: `postgres://username:password@host:port/database`
- **APP_SECRET**: Generate with `openssl rand -base64 32` and add to `.env` file

### Optional Configuration

#### External Access

To access Twenty from outside localhost, update in `.env`:

```bash
SERVER_URL=https://your-domain.com
REACT_APP_SERVER_BASE_URL=https://your-domain.com
```

#### Google OAuth

To enable Google authentication:

1. Set up OAuth in Google Cloud Console
2. Update `.env`:
   ```bash
   AUTH_GOOGLE_ENABLED=true
   AUTH_GOOGLE_CLIENT_ID=your_client_id
   AUTH_GOOGLE_CLIENT_SECRET=your_client_secret
   AUTH_GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   ```

#### Email Configuration

For SMTP email sending:

```bash
EMAIL_DRIVER=smtp
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-app-password
EMAIL_FROM_ADDRESS=your-email@gmail.com
```

## Management Commands

```bash
# Start the service
twenty-start
task -g services:start:twenty

# Stop the service
twenty-stop
task -g services:stop:twenty

# Restart the service
twenty-restart
task -g services:restart:twenty

# View logs
twenty-logs
twenty-logs -f  # Follow logs
task -g services:logs:twenty

# Access container shell
docker exec -it twenty sh

# Rebuild after configuration changes
docker-compose down
docker-compose up -d --build
```

## Data Persistence

- **Database**: Uses the PostgreSQL database specified in `TWENTY_DATABASE_URL`
- **File Storage**: Stored in `./data/storage/`
- **Uploads**: Stored in `./data/uploads/`
- **Redis Cache**: Stored in Docker volume `redis_data`

## Backup

```bash
# Backup uploaded files and storage
tar -czf twenty-backup-$(date +%Y%m%d).tar.gz data/

# Database backup (adjust connection details)
pg_dump $TWENTY_DATABASE_URL > twenty-db-backup-$(date +%Y%m%d).sql
```

## Troubleshooting

### Container won't start

1. Check APP_SECRET is set: `grep APP_SECRET .env`
2. Verify TWENTY_DATABASE_URL: `echo $TWENTY_DATABASE_URL`
3. Check logs: `docker-compose logs twenty`

### Database connection issues

1. Ensure PostgreSQL is running and accessible
2. Verify database credentials in TWENTY_DATABASE_URL
3. Check network connectivity to database host

### Redis connection issues

1. Check Redis container status: `docker-compose ps redis`
2. View Redis logs: `docker-compose logs redis`

### Performance issues

1. Ensure at least 2GB RAM available
2. Check Redis is running properly
3. Monitor container resources: `docker stats`

## SSL/HTTPS Setup

For production use, set up a reverse proxy (nginx, Caddy, Traefik) with SSL termination. Twenty requires HTTPS for certain features like clipboard API.

## Updates

```bash
# Pull latest image
docker-compose pull

# Restart with new image
docker-compose down
docker-compose up -d
```

## Resources

- Official Documentation: https://twenty.com/developers
- GitHub Repository: https://github.com/twentyhq/twenty
- Community Support: https://discord.gg/twenty