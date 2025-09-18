# Plane Service

Plane is an open-source project management tool that helps teams track issues, plan sprints, and manage product roadmaps.

## Quick Start

1. Run the setup script:
   ```bash
   ./setup.sh
   ```

2. Configure environment variables in `.env` file (if needed)

3. Start the service:
   ```bash
   task services:start:plane
   ```

4. Access Plane at: http://localhost:8082

## Architecture

This deployment includes:
- **plane-web**: Frontend application
- **plane-space**: Public space for sharing updates
- **plane-admin**: Admin interface
- **plane-api**: Backend API server
- **plane-worker**: Background job processor
- **plane-beat-worker**: Scheduled task runner
- **plane-db**: PostgreSQL database
- **plane-redis**: Redis cache
- **plane-proxy**: Nginx proxy for routing

## Configuration

### Basic Settings
- Port: 8082 (configurable via `PLANE_PORT`)
- Default URL: http://localhost:8082
- Admin setup: Available on first access

### Optional Features
- **Email**: Configure SMTP settings in `.env` for notifications
- **Storage**: Configure S3 or compatible storage for file uploads
- **OpenAI**: Add API key for AI-powered features
- **OAuth**: Enable social login providers

## Management Commands

### Using Task
```bash
# Start service
task services:start:plane

# Stop service
task services:stop:plane

# Restart service
task services:restart:plane

# View logs
task services:logs:plane

# View specific container logs
task services:logs -- plane plane-api -f
```

### Using Docker Compose
```bash
# Start all containers
docker compose up -d

# Stop all containers
docker compose down

# View logs
docker compose logs -f

# Access database
docker compose exec plane-db psql -U plane -d plane

# Access API shell
docker compose exec plane-api python manage.py shell
```

## Data Persistence

Data is stored in:
- `./pgdata/` - PostgreSQL database
- `./redisdata/` - Redis cache
- `./uploads/` - User uploaded files

## Troubleshooting

### Service won't start
- Check port 8082 is not in use: `lsof -i :8082`
- Check Docker resources: `docker system df`
- Review logs: `task services:logs:plane`

### Database connection issues
- Ensure plane-db container is running: `docker ps | grep plane-db`
- Check database logs: `docker compose logs plane-db`

### Performance issues
- Increase Docker memory allocation
- Consider external database for production use
- Configure Redis maxmemory policy

## Security Notes

⚠️ **For production use:**
1. Change `SECRET_KEY` in `.env` file
2. Use external database with backups
3. Configure SSL/TLS (use reverse proxy)
4. Set up proper email authentication
5. Enable and configure OAuth if needed
6. Regular backups of pgdata and uploads

## Resources

- [Official Documentation](https://docs.plane.so)
- [GitHub Repository](https://github.com/makeplane/plane)
- [Community Forum](https://community.plane.so)