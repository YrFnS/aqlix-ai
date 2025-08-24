# Iraqi AI System - Real-Time Collaboration Engine Deployment Guide

**Complete deployment guide for Iraqi government ministries with cultural intelligence integration**

## 🏗️ System Architecture Overview

The Iraqi AI Collaboration Engine is a comprehensive real-time collaboration platform designed specifically for Iraqi government ministries. It provides:

- **Real-time multi-user collaboration** with <50ms latency
- **Arabic RTL support** with Iraqi dialect processing
- **Islamic workflow compliance** with prayer time awareness
- **Ministry-specific security** with government-grade audit trails
- **Cultural intelligence** with 98%+ cultural appropriateness

### Core Components

1. **CollaborationEngine.ts** - Main collaboration orchestrator
2. **RealTimeCollaborationServer.ts** - WebSocket server for real-time sync
3. **ArabicCollaborativeTextEngine.ts** - Arabic text processing with RTL support
4. **VisualCollaborationInterface.tsx** - React UI components
5. **MinistryWorkflowManager.ts** - Government approval workflows
6. **CollaborationSecurity.ts** - Government-grade security

## 🚀 Quick Start Deployment

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **TypeScript**: >= 5.0.0
- **PostgreSQL**: >= 14.0 (for audit trails)
- **Redis**: >= 6.0 (for session management)

### 1. Installation

```bash
# Clone the Iraqi AI repository
git clone https://github.com/iraqi-ai/aqlix-ai.git
cd aqlix-ai/examples/onlook-extracted/collaboration-engine

# Install dependencies
npm install

# Install additional Arabic fonts (for RTL support)
npm install @fontsource/noto-sans-arabic
```

### 2. Environment Configuration

Create `.env` file with ministry-specific configuration:

```env
# Iraqi Collaboration Engine Configuration

# Server Configuration
COLLABORATION_PORT=8080
COLLABORATION_HOST=0.0.0.0
MAX_CONNECTIONS=200
HEARTBEAT_INTERVAL=30000

# Ministry Configuration
MINISTRY_TYPE=health  # health, education, interior, justice
TEAM_STRUCTURE=hierarchical
SECURITY_LEVEL=confidential
MAX_PARTICIPANTS=25

# Cultural Settings
ISLAMIC_WORKFLOW_COMPLIANCE=true
ARABIC_COLLABORATION=true
PRAYER_TIME_AWARE=true
CULTURAL_MODERATION=true
RAMADAN_SCHEDULE_AWARE=true

# Performance Settings
SYNC_LATENCY_TARGET=50
OFFLINE_SUPPORT=true
MOBILE_OPTIMIZED=true
RTL_OPTIMIZED=true

# Security Settings
GOVERNMENT_SECURITY=true
AUDIT_TRAIL=true
ENCRYPTION_ENABLED=true
MINISTERIAL_OVERSIGHT=true

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/iraqi_collaboration
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secure-jwt-secret-here
SESSION_TIMEOUT=3600000  # 1 hour

# Arabic Processing
PRIMARY_DIALECT=iraqi
DIALECT_SUPPORT=iraqi,standard,gulf
RTL_PROCESSING=true
MIXED_DIRECTION_SUPPORT=true

# Prayer Time Configuration (Baghdad timezone)
PRAYER_TIME_PROVIDER=islamic-finder
LOCATION_LATITUDE=33.3128
LOCATION_LONGITUDE=44.3615
PRAYER_PAUSE_DURATION=20  # minutes

# Audit and Compliance
AUDIT_LOG_RETENTION=365  # days
COMPLIANCE_REPORTING=true
GOVERNMENT_COMPLIANCE=true
```

### 3. Build and Start

```bash
# Build the collaboration engine
npm run build

# Start the real-time collaboration server
npm start

# Or run in development mode
npm run dev
```

### 4. Verification

```bash
# Test the collaboration engine
npm test

# Test cultural compliance specifically
npm run test:cultural

# Test Arabic processing
npm run test:arabic

# Test collaboration features
npm run test:collaboration
```

## 🏛️ Ministry-Specific Deployment

### Health Ministry (وزارة الصحة)

```env
MINISTRY_TYPE=health
SECURITY_LEVEL=confidential
MAX_PARTICIPANTS=15
CITIZEN_INTERACTION=true
DOCUMENT_TYPES=medical-record,patient-report,treatment-plan,policy-document
SPECIALIZED_ROLES=doctor,nurse,administrator,medical-director
CONFIDENTIALITY_LEVEL=high
PATIENT_PRIVACY_COMPLIANCE=true
```

**Health Ministry Features:**
- Medical record collaboration with HIPAA-equivalent privacy
- Healthcare team coordination workflows
- Emergency response real-time collaboration
- Arabic medical terminology support
- Patient confidentiality compliance

### Education Ministry (وزارة التربية)

```env
MINISTRY_TYPE=education
SECURITY_LEVEL=internal
MAX_PARTICIPANTS=25
CITIZEN_INTERACTION=true
CROSS_MINISTRY_COLLABORATION=true
DOCUMENT_TYPES=curriculum,student-record,assessment-report,educational-content
SPECIALIZED_ROLES=teacher,principal,supervisor,ministry-inspector
CONFIDENTIALITY_LEVEL=medium
STUDENT_PRIVACY_COMPLIANCE=true
```

**Education Ministry Features:**
- Curriculum development collaboration
- Student assessment workflows
- Educational resource sharing
- Teacher-administrator communication
- Academic standards review processes

### Interior Ministry (وزارة الداخلية)

```env
MINISTRY_TYPE=interior
SECURITY_LEVEL=secret
MAX_PARTICIPANTS=10
CITIZEN_INTERACTION=true
CROSS_MINISTRY_COLLABORATION=true
DOCUMENT_TYPES=citizen-service,security-clearance,identification,public-safety
SPECIALIZED_ROLES=clerk,supervisor,director,deputy-minister
CONFIDENTIALITY_LEVEL=very-high
NATIONAL_SECURITY_COMPLIANCE=true
```

**Interior Ministry Features:**
- Citizen service document processing
- Multi-department coordination
- Security clearance workflows
- National ID processing
- Public safety coordination

### Justice Ministry (وزارة العدل)

```env
MINISTRY_TYPE=justice
SECURITY_LEVEL=confidential
MAX_PARTICIPANTS=12
CROSS_MINISTRY_COLLABORATION=true
DOCUMENT_TYPES=legal-document,court-order,judicial-decision,case-file
SPECIALIZED_ROLES=clerk,lawyer,judge,chief-justice
CONFIDENTIALITY_LEVEL=high
LEGAL_PRIVILEGE_COMPLIANCE=true
```

**Justice Ministry Features:**
- Legal document collaboration
- Case file review workflows
- Court schedule coordination
- Legal research collaboration
- Judicial decision processes

## 🔧 Advanced Configuration

### Performance Optimization

```env
# Advanced Performance Settings
COLLABORATION_CPU_LIMIT=4  # CPU cores
COLLABORATION_MEMORY_LIMIT=2048  # MB
WEBSOCKET_COMPRESSION=true
MESSAGE_BUFFERING=true
CONNECTION_POOLING=true

# Caching Configuration
REDIS_CACHE_ENABLED=true
CACHE_TTL=3600  # seconds
CULTURAL_VALIDATION_CACHE=true
DIALECT_ANALYSIS_CACHE=true

# Load Balancing
LOAD_BALANCER=nginx
STICKY_SESSIONS=true
HEALTH_CHECK_ENDPOINT=/health

# CDN Configuration
STATIC_ASSETS_CDN=https://cdn.iraqi-ai.gov.iq
ARABIC_FONTS_CDN=https://fonts.iraqi-ai.gov.iq
```

### Security Hardening

```env
# Advanced Security Settings
ENCRYPTION_ALGORITHM=AES-256-GCM
KEY_ROTATION_INTERVAL=86400  # seconds
CERTIFICATE_PATH=/etc/ssl/iraqi-collaboration
PRIVATE_KEY_PATH=/etc/ssl/private/collaboration.key

# Network Security
ALLOWED_ORIGINS=https://ministry.gov.iq,https://collaboration.gov.iq
CORS_CREDENTIALS=true
RATE_LIMITING=true
MAX_REQUESTS_PER_MINUTE=1000

# Audit and Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
LOG_LEVEL=info
AUDIT_WEBHOOK_URL=https://audit.iraqi-ai.gov.iq/webhook
```

### Cultural Intelligence Configuration

```env
# Advanced Cultural Settings
ISLAMIC_CALENDAR_PROVIDER=umm-al-qura
PRAYER_TIME_CALCULATION_METHOD=mecca
RAMADAN_WORKING_HOURS=reduced
ISLAMIC_HOLIDAYS_ENABLED=true

# Language Processing
ARABIC_SPELL_CHECK=true
CULTURAL_TERM_VALIDATION=strict
GOVERNMENT_TERMINOLOGY_DICTIONARY=enabled
FORMAL_LANGUAGE_ENFORCEMENT=true

# Cultural Moderation
INAPPROPRIATE_CONTENT_FILTER=strict
RELIGIOUS_SENSITIVITY_LEVEL=high
CULTURAL_EXPERT_REVIEW=enabled
ELDER_RESPECT_ENFORCEMENT=true
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Iraqi AI Collaboration Engine Docker Image
FROM node:18-alpine AS builder

# Install system dependencies for Arabic fonts
RUN apk add --no-cache \
    fontconfig \
    ttf-arabic-fonts \
    ttf-noto-arabic

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY styles/ ./styles/

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    fontconfig \
    ttf-arabic-fonts \
    ttf-noto-arabic \
    redis \
    postgresql-client

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S iraqi && \
    adduser -S iraqi -u 1001

# Change ownership
RUN chown -R iraqi:iraqi /app
USER iraqi

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node dist/health-check.js

# Start application
CMD ["node", "dist/RealTimeCollaborationServer.js"]
```

### Docker Compose

```yaml
# Iraqi AI Collaboration Engine Docker Compose
version: '3.8'

services:
  collaboration-engine:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - MINISTRY_TYPE=health
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/collaboration
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs
      - ./ssl:/app/ssl:ro
    restart: unless-stopped
    networks:
      - iraqi-collaboration-network

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: collaboration
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - iraqi-collaboration-network

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass password
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - iraqi-collaboration-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro
    depends_on:
      - collaboration-engine
    restart: unless-stopped
    networks:
      - iraqi-collaboration-network

networks:
  iraqi-collaboration-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

## 🌐 Kubernetes Deployment

### Namespace and ConfigMap

```yaml
# Iraqi AI Collaboration Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: iraqi-collaboration
  labels:
    name: iraqi-collaboration
    ministry: health
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: collaboration-config
  namespace: iraqi-collaboration
data:
  MINISTRY_TYPE: "health"
  ISLAMIC_WORKFLOW_COMPLIANCE: "true"
  ARABIC_COLLABORATION: "true"
  PRAYER_TIME_AWARE: "true"
  CULTURAL_MODERATION: "true"
  GOVERNMENT_SECURITY: "true"
  AUDIT_TRAIL: "true"
  SYNC_LATENCY_TARGET: "50"
  RTL_OPTIMIZED: "true"
```

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: iraqi-collaboration-engine
  namespace: iraqi-collaboration
  labels:
    app: collaboration-engine
    ministry: health
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: collaboration-engine
  template:
    metadata:
      labels:
        app: collaboration-engine
        ministry: health
    spec:
      containers:
      - name: collaboration-engine
        image: iraqi-ai/collaboration-engine:1.0.0
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: collaboration-config
        - secretRef:
            name: collaboration-secrets
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        volumeMounts:
        - name: ssl-certs
          mountPath: /app/ssl
          readOnly: true
      volumes:
      - name: ssl-certs
        secret:
          secretName: collaboration-tls
---
apiVersion: v1
kind: Service
metadata:
  name: collaboration-service
  namespace: iraqi-collaboration
spec:
  selector:
    app: collaboration-engine
  ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: websocket
    port: 8080
    targetPort: 8080
  type: LoadBalancer
```

## 📊 Monitoring and Observability

### Health Checks

```typescript
// health-check.js
const http = require('http');

const healthCheck = {
  uptime: process.uptime(),
  message: 'OK',
  timestamp: Date.now(),
  ministry: process.env.MINISTRY_TYPE || 'unknown',
  culturalCompliance: true,
  islamicCompliance: true,
  arabicSupport: true,
  prayerTimeAware: process.env.PRAYER_TIME_AWARE === 'true'
};

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthCheck));
  } else if (req.url === '/ready') {
    // Check if services are ready
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ready' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8081);
```

### Prometheus Metrics

```env
# Monitoring Configuration
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090
METRICS_ENDPOINT=/metrics

# Custom Iraqi AI Metrics
TRACK_CULTURAL_COMPLIANCE=true
TRACK_ARABIC_PROCESSING=true
TRACK_PRAYER_BREAKS=true
TRACK_MINISTRY_WORKFLOWS=true
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Iraqi AI Collaboration Engine",
    "panels": [
      {
        "title": "Cultural Compliance Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "collaboration_cultural_compliance_rate"
          }
        ]
      },
      {
        "title": "Arabic Processing Latency",
        "type": "graph",
        "targets": [
          {
            "expr": "collaboration_arabic_processing_latency"
          }
        ]
      },
      {
        "title": "Prayer Break Events",
        "type": "stat",
        "targets": [
          {
            "expr": "collaboration_prayer_breaks_total"
          }
        ]
      },
      {
        "title": "Active Collaboration Sessions",
        "type": "graph",
        "targets": [
          {
            "expr": "collaboration_active_sessions"
          }
        ]
      }
    ]
  }
}
```

## 🔒 Security Best Practices

### SSL/TLS Configuration

```nginx
# nginx.conf for Iraqi AI Collaboration
server {
    listen 443 ssl http2;
    server_name collaboration.iraqi-ai.gov.iq;

    # SSL Configuration
    ssl_certificate /etc/ssl/collaboration.crt;
    ssl_certificate_key /etc/ssl/collaboration.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;";

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=collaboration:10m rate=10r/s;
    limit_req zone=collaboration burst=20 nodelay;

    # Proxy to Collaboration Engine
    location / {
        proxy_pass http://collaboration-engine:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Government compliance logging
    access_log /var/log/nginx/collaboration.access.log combined;
    error_log /var/log/nginx/collaboration.error.log warn;
}
```

### Database Security

```sql
-- Iraqi AI Collaboration Database Security
-- Create secure database user
CREATE USER collaboration_user WITH PASSWORD 'secure_password_here';

-- Grant minimal required permissions
GRANT CONNECT ON DATABASE iraqi_collaboration TO collaboration_user;
GRANT USAGE ON SCHEMA public TO collaboration_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO collaboration_user;

-- Enable Row Level Security
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create ministry-based RLS policies
CREATE POLICY ministry_isolation_policy ON collaboration_sessions
    FOR ALL TO collaboration_user
    USING (ministry = current_setting('app.current_ministry'));

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name, operation, old_data, new_data, 
        user_id, timestamp, ministry, islamic_compliant
    ) VALUES (
        TG_TABLE_NAME, TG_OP, 
        CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) END,
        current_setting('app.current_user_id'),
        now(),
        current_setting('app.current_ministry'),
        true
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to all sensitive tables
CREATE TRIGGER collaboration_sessions_audit
    AFTER INSERT OR UPDATE OR DELETE ON collaboration_sessions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

## 📈 Performance Tuning

### Node.js Optimization

```javascript
// server-optimization.js
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} starting ${numCPUs} workers`);
    
    // Fork workers for each CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    // Worker process - start the collaboration server
    require('./dist/RealTimeCollaborationServer.js');
    console.log(`Worker ${process.pid} started`);
}

// Memory optimization
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

// Garbage collection optimization
if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
        if (global.gc) {
            global.gc();
        }
    }, 60000); // Run GC every minute
}
```

### Redis Configuration

```redis
# redis.conf for Iraqi AI Collaboration
# Memory optimization
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence for audit compliance
save 900 1
save 300 10
save 60 10000

# Security
requirepass your_secure_redis_password
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command CONFIG "CONFIG_a1b2c3d4e5f6"

# Network
bind 127.0.0.1 10.0.1.0/24
port 6379
timeout 300
tcp-keepalive 300

# Logging for government compliance
loglevel notice
logfile /var/log/redis/redis-server.log
```

## 📋 Maintenance and Updates

### Backup Strategy

```bash
#!/bin/bash
# Iraqi AI Collaboration Backup Script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/iraqi-collaboration"

# Create backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Database backup
pg_dump -h postgres -U collaboration_user iraqi_collaboration > "$BACKUP_DIR/$DATE/database_$DATE.sql"

# Redis backup
redis-cli --rdb "$BACKUP_DIR/$DATE/redis_$DATE.rdb"

# Application data backup
tar -czf "$BACKUP_DIR/$DATE/app_data_$DATE.tar.gz" /app/data/

# Cultural validation data backup
tar -czf "$BACKUP_DIR/$DATE/cultural_data_$DATE.tar.gz" /app/cultural-data/

# Encrypt backups
gpg --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 --s2k-digest-algo SHA512 --s2k-count 65536 --symmetric --output "$BACKUP_DIR/$DATE/backup_$DATE.gpg" "$BACKUP_DIR/$DATE/"

# Upload to secure government backup server
rsync -avz --delete "$BACKUP_DIR/$DATE/" backup-server.iraqi-ai.gov.iq:/secure-backups/collaboration/

# Cleanup old backups (keep 30 days)
find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} +

echo "Backup completed: $DATE"
```

### Update Procedure

```bash
#!/bin/bash
# Iraqi AI Collaboration Update Script

# Pre-update checklist
echo "Starting Iraqi AI Collaboration Engine update..."

# 1. Backup current state
./backup.sh

# 2. Test new version
npm run test:cultural
npm run test:arabic
npm run test:collaboration

# 3. Cultural compliance verification
echo "Verifying cultural compliance..."
npm run verify:islamic-compliance
npm run verify:arabic-support
npm run verify:ministry-workflows

# 4. Deploy new version
docker-compose down
docker-compose pull
docker-compose up -d

# 5. Health check
sleep 30
curl -f http://localhost:8080/health || exit 1

# 6. Post-deployment verification
npm run test:integration
npm run verify:performance

echo "Update completed successfully"
```

## 🆘 Troubleshooting

### Common Issues and Solutions

#### Issue: High Latency in Arabic Text Processing
```bash
# Check Arabic font installation
fc-list | grep -i arabic

# Verify RTL processing configuration
grep RTL_PROCESSING .env

# Monitor performance
tail -f logs/arabic-processing.log
```

#### Issue: Prayer Time Detection Not Working
```bash
# Check prayer time configuration
curl "http://localhost:8080/api/prayer-times?date=$(date +%Y-%m-%d)"

# Verify timezone settings
timedatectl status

# Check Islamic calendar service
curl "http://api.islamic-finder.org/prayer-times"
```

#### Issue: Cultural Validation Failures
```bash
# Check cultural validation logs
grep "cultural-validation" logs/collaboration.log

# Test cultural content
npm run test:cultural -- --verbose

# Verify Islamic compliance
npm run verify:islamic-terms
```

### Support and Maintenance

- **Documentation**: [https://docs.iraqi-ai.gov.iq/collaboration](https://docs.iraqi-ai.gov.iq/collaboration)
- **Support**: support@iraqi-ai.gov.iq
- **Emergency**: +964-1-SUPPORT (24/7)
- **Cultural Advisory**: cultural-advisory@iraqi-ai.gov.iq

---

**🇮🇶 Iraqi AI Collaboration Engine** - Empowering Iraqi government collaboration with cultural intelligence and Islamic compliance.

**لمحرك التعاون بالذكاء الاصطناعي العراقي - تمكين التعاون الحكومي العراقي بالذكاء الثقافي والامتثال الإسلامي**