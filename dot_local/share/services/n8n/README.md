# n8n Service

n8n is a workflow automation tool that allows you to connect various services and automate tasks.

## Quick Start

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

## Access

Open your browser and navigate to: http://localhost:5678

## Configuration

1. Copy `.env.example` to `.env`
2. Adjust settings as needed
3. Restart the service if you make changes

### Important Settings

- **Authentication**: Set `N8N_BASIC_AUTH_ACTIVE=true` and configure username/password for production
- **Database**: Default uses SQLite. For production, consider PostgreSQL
- **Encryption Key**: Generate one for credential encryption in production

## Data Persistence

- Workflows and credentials are stored in `./data`
- Files are stored in `./files`

## Useful Commands

```bash
# Backup data
tar -czf n8n-backup-$(date +%Y%m%d).tar.gz data/

# Update to latest version
docker-compose pull
docker-compose up -d

# View container status
docker-compose ps
```

## Integration

n8n can integrate with hundreds of services including:
- APIs and Webhooks
- Databases
- Cloud services
- Communication tools
- And many more

## Documentation

- Official Docs: https://docs.n8n.io/
- Community Forum: https://community.n8n.io/