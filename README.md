# 📖 Apostolado Cardeal Newman

> Plataforma digital para disseminação de conteúdo católico e apoio à conversão de ex-protestantes.

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)]()
[![License](https://img.shields.io/badge/license-Private-blue)]()

---

## 🎯 Sobre o Projeto

O **apostoladonewman.com.br** é um website que fornece uma plataforma completa para:

- 📝 Gerenciamento de artigos, testemunhos e biblioteca
- 👥 Sistema de autenticação e perfis de usuário
- 📚 Catálogo de livros e recursos
- ✉️ Sistema de contato e contribuições

### Arquitetura

- **Backend**: Strapi 5.23.0 (Headless CMS)
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: PostgreSQL 16
- **Cache**: React Query

---

## ✨ Features

### 🔒 Segurança

- ✅ XSS Protection (DOMPurify)
- ✅ Rate Limiting (5 req/15min)
- ✅ Strong Password Policy (8+ chars, complexity)
- ✅ JWT Authentication
- ✅ Role-based Access Control
- ✅ Helmet.js Security Headers
- ✅ HTTPS/SSL Support

### ⚡ Performance

- ✅ Lazy Loading & Code Splitting
- ✅ Database Indexes
- ✅ API Response Caching
- ✅ Optimized Images & Assets
- ✅ Gzip Compression

### 🏗️ DevOps

- ✅ Docker & Docker Compose
- ✅ CI/CD with GitHub Actions
- ✅ Automated Backups
- ✅ Health Check Endpoints
- ✅ Structured Logging (Winston)

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm >= 6.0.0

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/seu-usuario/ApostoladoCardealNewman.git
cd ApostoladoCardealNewman
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- Database credentials
- JWT secrets
- CORS origins

3. **Install dependencies**

```bash
# Backend
npm install

# Frontend
cd frontend && npm install
```

4. **Run database migrations**

```bash
npm run db:migrate
```

5. **Start development servers**

```bash
# Backend (Terminal 1)
npm run develop

# Frontend (Terminal 2)
cd frontend && npm run dev
```

Access:

- Frontend: http://localhost:5173
- Backend API: http://localhost:1337
- Admin Panel: http://localhost:1337/admin

---

## 🐳 Docker Deployment

### Quick Deploy

```bash
# Copy environment file
cp .env.example .env

# Edit .env with production values
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check health
curl http://localhost/health
```

### Services

- **PostgreSQL**: Port 5432
- **Backend**: Port 1337
- **Frontend**: Port 80

---

## 📦 Available Commands

### Backend

```bash
npm run develop          # Development mode
npm run start           # Production mode
npm run build           # Build Strapi admin
npm run db:migrate      # Run database migrations

# Backups
npm run backup:db       # Backup database
npm run backup:uploads  # Backup uploaded files
npm run backup:all      # Complete backup
```

### Frontend

```bash
cd frontend
npm run dev            # Development mode
npm run build          # Production build
npm run lint           # Run linter
npm run preview        # Preview production build
```

### Docker

```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f [service]  # View logs
docker-compose restart [service]  # Restart service
```

---

## 📁 Project Structure

```
.
├── frontend/              # React Application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utility functions
│   ├── Dockerfile
│   └── nginx.conf
│
├── src/                   # Strapi Backend
│   ├── api/              # Content Types & Controllers
│   ├── middlewares/      # Custom middlewares
│   ├── extensions/       # Plugin extensions
│   └── utils/            # Utility functions
│
├── database/             # Database migrations
│   └── migrations/
│
├── scripts/              # Automation scripts
│   ├── backup-database.js
│   ├── backup-uploads.js
│   └── backup-all.js
│
├── nginx/                # Nginx configuration
│   ├── nginx.conf
│   └── ssl-setup.sh
│
├── docs/                 # Documentation
│   ├── guides/
│   ├── security/
│   └── infrastructure/
│
├── .github/
│   └── workflows/        # CI/CD pipelines
│
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🏥 Health Checks

The application provides three health check endpoints:

```bash
# Comprehensive health check
curl http://localhost:1337/api/health

# Readiness check (K8s ready)
curl http://localhost:1337/api/health/ready

# Liveness check (K8s alive)
curl http://localhost:1337/api/health/live
```

---

## 🔐 Security

### Best Practices Implemented

- **Authentication**: JWT-based with secure token storage
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Server-side validation for all inputs
- **XSS Prevention**: DOMPurify sanitization
- **CSRF Protection**: SameSite cookies + custom headers
- **Rate Limiting**: Brute force protection on auth endpoints
- **Security Headers**: Helmet.js implementation
- **SSL/TLS**: A+ rating configuration with Let's Encrypt

For detailed security documentation, see [`docs/security/SECURITY_IMPROVEMENTS.md`](docs/security/SECURITY_IMPROVEMENTS.md)

---

## 📊 Monitoring & Logging

### Logs

Logs are stored in the `logs/` directory:

- `combined-*.log` - All logs
- `error-*.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

```bash
# View logs
tail -f logs/combined-$(date +%Y-%m-%d).log
tail -f logs/error-$(date +%Y-%m-%d).log
```

### Health Monitoring

Configure monitoring tools to check:

- `/api/health` - Overall application health
- `/api/health/ready` - Application readiness
- `/api/health/live` - Application liveness

---

## 💾 Backup & Recovery

### Automated Backups

```bash
# Manual backup
npm run backup:all

# Schedule automatic backups (cron)
# Example: Daily at 2 AM
0 2 * * * cd /path/to/project && npm run backup:all
```

### Backup Locations

- Database: `backups/database/`
- Uploads: `backups/uploads/`

### Retention

- Database backups: 30 days (configurable)
- Upload backups: 15 days (configurable)

---

## 📚 Documentation

Complete documentation is available in the [`docs/`](docs/) directory:

### Guides

- [Complete Implementation Guide](docs/guides/IMPLEMENTATION_GUIDE_COMPLETE.md)
- [All Implementations](docs/guides/IMPLEMENTACOES_COMPLETAS_FINAL.md)

### Security

- [Security Improvements](docs/security/SECURITY_IMPROVEMENTS.md)

### Infrastructure

- [Nginx + SSL Setup](docs/infrastructure/nginx-ssl-guide.md)
- [Database Migrations](docs/infrastructure/database-migrations.md)

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Configure production `.env` file
- [ ] Generate strong secrets for JWT and API tokens
- [ ] Set up PostgreSQL database
- [ ] Run database migrations
- [ ] Configure SSL certificates (Let's Encrypt)
- [ ] Set up Nginx reverse proxy
- [ ] Configure firewall (allow only 80, 443)
- [ ] Set up automated backups
- [ ] Configure monitoring and alerts
- [ ] Test health check endpoints

### Deployment Options

#### Option 1: Docker (Recommended)

```bash
# Production deployment with Docker
docker-compose -f docker-compose.yml up -d
```

#### Option 2: Manual Deployment

See [Production Deployment Guide](docs/guides/IMPLEMENTACOES_COMPLETAS_FINAL.md#-deploy-em-produção)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

---

## 📄 License

This project is private and proprietary.

---

## 👥 Team

- **Development**: Alesson
- **Project**: Apostolado Cardeal Newman

---

## 📞 Support

For technical issues or questions:

- Review the [documentation](docs/)
- Check [troubleshooting guide](docs/guides/IMPLEMENTACOES_COMPLETAS_FINAL.md#-troubleshooting)
- Contact the development team

---

## 🎯 Project Status

**Current Version**: 2.0.0
**Status**: ✅ Production Ready
**Last Updated**: 2025-10-11

### Roadmap

- ✅ Core functionality
- ✅ Security hardening
- ✅ Performance optimization
- ✅ Docker containerization
- ✅ CI/CD pipeline
- ✅ Automated backups
- ⏳ Advanced analytics (planned)
- ⏳ Mobile app (planned)

---
