# Browser-use System Deployment Guide

Complete deployment guide for Browser-use system integration with Iraqi AI Chat System.

## 🚀 Deployment Overview

This guide covers production deployment of the Browser-use system with Iraqi government portal automation capabilities, including security, performance, and cultural compliance considerations.

## 📋 Deployment Prerequisites

### Infrastructure Requirements

**Minimum Requirements:**
- **CPU**: 4 cores (8 cores recommended)
- **RAM**: 8GB (16GB recommended) 
- **Storage**: 50GB SSD (100GB recommended)
- **Network**: Stable internet with low latency to Iraq
- **OS**: Ubuntu 20.04+ or CentOS 8+

**Browser Requirements:**
- Chrome/Chromium 120+
- Firefox 119+
- Arabic font support
- RTL layout support

**Security Requirements:**
- SSL/TLS certificates
- VPN access (if needed for Iraqi portals)
- Secure credential storage
- Network firewall configuration

## 🐳 Docker Deployment

### 1. Base Dockerfile

```dockerfile
# Dockerfile for Browser-use Iraqi Portal Automation
FROM node:18-bullseye-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    wget \
    gnupg \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    fonts-arabic \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set timezone to Baghdad
ENV TZ=Asia/Baghdad
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers
RUN python3 -m playwright install chromium firefox webkit

# Copy application code
COPY . .

# Create non-root user for security
RUN groupadd -r automation && useradd -r -g automation -G audio,video automation \
    && mkdir -p /home/automation/Downloads \
    && chown -R automation:automation /app /home/automation

# Switch to non-root user
USER automation

# Set environment variables
ENV PYTHONPATH=/app
ENV DISPLAY=:99
ENV CHROME_BIN=/usr/bin/google-chrome
ENV CHROME_PATH=/usr/bin/google-chrome

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start command
CMD ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  browser-automation:
    build: .
    container_name: iraqi-browser-automation
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://user:password@postgres:5432/browser_automation
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - IRAQI_PORTAL_TIMEOUT=90000
      - GOVERNMENT_HOURS_CHECK=true
      - CULTURAL_VALIDATION=true
      - ARABIC_SUPPORT=true
    volumes:
      - ./downloads:/app/downloads
      - ./logs:/app/logs
      - ./config:/app/config
    depends_on:
      - redis
      - postgres
    networks:
      - iraqi-ai-network
    security_opt:
      - seccomp:unconfined
    shm_size: 2gb
    cap_add:
      - SYS_ADMIN

  redis:
    image: redis:7-alpine
    container_name: browser-automation-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - iraqi-ai-network

  postgres:
    image: postgres:15-alpine
    container_name: browser-automation-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=browser_automation
      - POSTGRES_USER=automation_user
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - iraqi-ai-network

  nginx:
    image: nginx:alpine
    container_name: browser-automation-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - browser-automation
    networks:
      - iraqi-ai-network

volumes:
  redis_data:
  postgres_data:

networks:
  iraqi-ai-network:
    driver: bridge
```

### 3. Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream browser_automation {
        server browser-automation:8000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Rate limiting
        limit_req_zone $binary_remote_addr zone=automation:10m rate=10r/s;
        limit_req zone=automation burst=20 nodelay;

        # Proxy configuration
        location / {
            proxy_pass http://browser_automation;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts for long-running automations
            proxy_connect_timeout 60s;
            proxy_send_timeout 300s;
            proxy_read_timeout 300s;
        }

        # Health check endpoint
        location /health {
            proxy_pass http://browser_automation/health;
            access_log off;
        }

        # Static files
        location /static/ {
            alias /app/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## ☸️ Kubernetes Deployment

### 1. Kubernetes Manifests

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: iraqi-browser-automation
  labels:
    name: iraqi-browser-automation
```

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: browser-automation
  namespace: iraqi-browser-automation
spec:
  replicas: 3
  selector:
    matchLabels:
      app: browser-automation
  template:
    metadata:
      labels:
        app: browser-automation
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
      - name: browser-automation
        image: iraqi-ai/browser-automation:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: database-url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: llm-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        volumeMounts:
        - name: downloads
          mountPath: /app/downloads
        - name: config
          mountPath: /app/config
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: downloads
        persistentVolumeClaim:
          claimName: downloads-pvc
      - name: config
        configMap:
          name: browser-automation-config
```

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: browser-automation-service
  namespace: iraqi-browser-automation
spec:
  selector:
    app: browser-automation
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP
```

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: browser-automation-ingress
  namespace: iraqi-browser-automation
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - automation.iraqi-ai.com
    secretName: automation-tls
  rules:
  - host: automation.iraqi-ai.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: browser-automation-service
            port:
              number: 80
```

## 🔧 Environment Configuration

### 1. Production Environment Variables

```bash
# .env.production
# Application
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://user:password@postgres:5432/browser_automation
REDIS_URL=redis://redis:6379

# LLM Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# Browser Configuration
DEFAULT_BROWSER=chrome
HEADLESS_MODE=true
BROWSER_TIMEOUT=90000
MAX_CONCURRENT_BROWSERS=5

# Iraqi Portal Configuration
IRAQI_PORTAL_TIMEOUT=90000
GOVERNMENT_HOURS_CHECK=true
CULTURAL_VALIDATION=true
ARABIC_SUPPORT=true
RTL_LAYOUT=true

# Security
SECRET_KEY=your-secret-key-here
ENCRYPT_SENSITIVE_DATA=true
AUDIT_ALL_INTERACTIONS=true

# Performance
ENABLE_CACHING=true
CACHE_TTL=3600
MAX_WORKERS=4

# Monitoring
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090
SENTRY_DSN=https://...

# File Storage
DOWNLOAD_PATH=/app/downloads
SCREENSHOT_PATH=/app/screenshots
LOG_PATH=/app/logs
```

### 2. Configuration Management

```python
# config/settings.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Application settings
    environment: str = "development"
    debug: bool = False
    log_level: str = "INFO"
    
    # Database settings
    database_url: str
    redis_url: str
    
    # LLM Provider settings
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    google_api_key: Optional[str] = None
    
    # Browser settings
    default_browser: str = "chrome"
    headless_mode: bool = True
    browser_timeout: int = 90000
    max_concurrent_browsers: int = 3
    
    # Iraqi portal settings
    iraqi_portal_timeout: int = 90000
    government_hours_check: bool = True
    cultural_validation: bool = True
    arabic_support: bool = True
    rtl_layout: bool = True
    
    # Security settings
    secret_key: str
    encrypt_sensitive_data: bool = True
    audit_all_interactions: bool = True
    
    # Performance settings
    enable_caching: bool = True
    cache_ttl: int = 3600
    max_workers: int = 4
    
    # File paths
    download_path: str = "/app/downloads"
    screenshot_path: str = "/app/screenshots"
    log_path: str = "/app/logs"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
```

## 📊 Monitoring and Logging

### 1. Application Monitoring

```python
# monitoring/metrics.py
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time
import logging

# Metrics definitions
automation_requests_total = Counter(
    'automation_requests_total',
    'Total automation requests',
    ['automation_type', 'status', 'portal']
)

automation_duration_seconds = Histogram(
    'automation_duration_seconds',
    'Automation duration in seconds',
    ['automation_type', 'portal']
)

active_browser_sessions = Gauge(
    'active_browser_sessions',
    'Number of active browser sessions'
)

portal_response_time = Histogram(
    'portal_response_time_seconds',
    'Portal response time in seconds',
    ['portal_name']
)

class MetricsCollector:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def record_automation_request(self, automation_type: str, status: str, portal: str):
        """Record automation request metrics"""
        automation_requests_total.labels(
            automation_type=automation_type,
            status=status,
            portal=portal
        ).inc()
    
    def record_automation_duration(self, automation_type: str, portal: str, duration: float):
        """Record automation duration"""
        automation_duration_seconds.labels(
            automation_type=automation_type,
            portal=portal
        ).observe(duration)
    
    def update_active_sessions(self, count: int):
        """Update active browser sessions count"""
        active_browser_sessions.set(count)
    
    def record_portal_response_time(self, portal_name: str, response_time: float):
        """Record portal response time"""
        portal_response_time.labels(portal_name=portal_name).observe(response_time)

# Start metrics server
def start_metrics_server(port: int = 9090):
    start_http_server(port)
    logging.info(f"Metrics server started on port {port}")
```

### 2. Structured Logging

```python
# logging/config.py
import structlog
import logging
from pythonjsonlogger import jsonlogger

def configure_logging():
    """Configure structured logging for production"""
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    # Configure standard logging
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(name)s %(levelname)s %(message)s'
    )
    
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    
    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)
    
    # Configure Iraqi-specific loggers
    iraqi_logger = logging.getLogger('iraqi_portal')
    iraqi_logger.setLevel(logging.INFO)
    
    automation_logger = logging.getLogger('browser_automation')
    automation_logger.setLevel(logging.INFO)

# Usage example
logger = structlog.get_logger("passport_automation")

async def log_automation_event(event_type: str, data: dict):
    """Log automation events with structured data"""
    logger.info(
        "automation_event",
        event_type=event_type,
        portal="passport_office",
        user_id=data.get('user_id'),
        automation_id=data.get('automation_id'),
        success=data.get('success'),
        duration=data.get('duration'),
        cultural_context="iraqi_government"
    )
```

## 🛡️ Security Configuration

### 1. Security Best Practices

```python
# security/config.py
import os
from cryptography.fernet import Fernet

class SecurityConfig:
    def __init__(self):
        self.encryption_key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
        self.cipher = Fernet(self.encryption_key)
    
    def encrypt_sensitive_data(self, data: str) -> bytes:
        """Encrypt sensitive data like credentials"""
        return self.cipher.encrypt(data.encode())
    
    def decrypt_sensitive_data(self, encrypted_data: bytes) -> str:
        """Decrypt sensitive data"""
        return self.cipher.decrypt(encrypted_data).decode()
    
    def validate_iraqi_data_privacy(self, data: dict) -> bool:
        """Validate data privacy compliance for Iraqi context"""
        # Implement Iraqi data privacy validation
        sensitive_fields = ['national_id', 'passport_number', 'phone_number']
        
        for field in sensitive_fields:
            if field in data:
                # Ensure data is properly encrypted
                if not self._is_encrypted(data[field]):
                    return False
        
        return True
    
    def _is_encrypted(self, data: str) -> bool:
        """Check if data is encrypted"""
        try:
            self.cipher.decrypt(data.encode())
            return True
        except:
            return False

# Network security
ALLOWED_HOSTS = [
    'automation.iraqi-ai.com',
    'api.iraqi-ai.com',
    '*.gov.iq',  # Iraqi government portals
    '*.edu.iq'   # Iraqi education portals
]

BLOCKED_HOSTS = [
    # Add known malicious hosts
]

# Rate limiting configuration
RATE_LIMITS = {
    'passport_renewal': '10/hour',
    'university_application': '5/hour', 
    'status_check': '20/hour',
    'general_automation': '50/hour'
}
```

### 2. Credential Management

```python
# security/credentials.py
import os
import boto3
from typing import Dict, Optional

class CredentialManager:
    def __init__(self):
        self.use_aws_secrets = os.getenv('USE_AWS_SECRETS', 'false').lower() == 'true'
        if self.use_aws_secrets:
            self.secrets_client = boto3.client('secretsmanager')
    
    async def get_llm_credentials(self) -> Dict[str, str]:
        """Get LLM provider credentials securely"""
        if self.use_aws_secrets:
            return await self._get_aws_secrets('llm-credentials')
        else:
            return {
                'openai_api_key': os.getenv('OPENAI_API_KEY'),
                'anthropic_api_key': os.getenv('ANTHROPIC_API_KEY'),
                'google_api_key': os.getenv('GOOGLE_API_KEY')
            }
    
    async def get_database_credentials(self) -> Dict[str, str]:
        """Get database credentials securely"""
        if self.use_aws_secrets:
            return await self._get_aws_secrets('database-credentials')
        else:
            return {
                'database_url': os.getenv('DATABASE_URL'),
                'redis_url': os.getenv('REDIS_URL')
            }
    
    async def _get_aws_secrets(self, secret_name: str) -> Dict[str, str]:
        """Get secrets from AWS Secrets Manager"""
        try:
            response = self.secrets_client.get_secret_value(SecretId=secret_name)
            return json.loads(response['SecretString'])
        except Exception as e:
            logger.error(f"Failed to get AWS secrets: {e}")
            raise
```

## 🚀 Deployment Scripts

### 1. Deployment Script

```bash
#!/bin/bash
# deploy.sh - Production deployment script

set -e

# Configuration
ENVIRONMENT=${ENVIRONMENT:-production}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-iraqi-ai}
IMAGE_TAG=${IMAGE_TAG:-latest}
NAMESPACE=${NAMESPACE:-iraqi-browser-automation}

echo "🚀 Starting deployment for Iraqi Browser Automation System"
echo "Environment: $ENVIRONMENT"
echo "Image: $DOCKER_REGISTRY/browser-automation:$IMAGE_TAG"

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t $DOCKER_REGISTRY/browser-automation:$IMAGE_TAG .

if [ "$ENVIRONMENT" = "production" ]; then
    echo "📤 Pushing to registry..."
    docker push $DOCKER_REGISTRY/browser-automation:$IMAGE_TAG
fi

# Deploy to Kubernetes
if command -v kubectl &> /dev/null; then
    echo "☸️ Deploying to Kubernetes..."
    
    # Create namespace if it doesn't exist
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply Kubernetes manifests
    kubectl apply -f k8s/ -n $NAMESPACE
    
    # Wait for deployment to be ready
    echo "⏳ Waiting for deployment to be ready..."
    kubectl rollout status deployment/browser-automation -n $NAMESPACE
    
    echo "✅ Deployment completed successfully!"
    
    # Show deployment status
    kubectl get pods -n $NAMESPACE
    kubectl get services -n $NAMESPACE
    
else
    # Docker Compose deployment
    echo "🐳 Deploying with Docker Compose..."
    docker-compose -f docker-compose.yml up -d
    
    echo "✅ Deployment completed successfully!"
    docker-compose ps
fi

# Run health checks
echo "🏥 Running health checks..."
./scripts/health_check.sh

echo "🎉 Iraqi Browser Automation System deployed successfully!"
```

### 2. Health Check Script

```bash
#!/bin/bash
# scripts/health_check.sh

set -e

BASE_URL=${BASE_URL:-http://localhost:8000}
TIMEOUT=${TIMEOUT:-30}

echo "🏥 Running health checks for Iraqi Browser Automation System"

# Check main health endpoint
echo "Checking main health endpoint..."
curl -f -s --max-time $TIMEOUT "$BASE_URL/health" > /dev/null
echo "✅ Main health check passed"

# Check readiness endpoint
echo "Checking readiness endpoint..."
curl -f -s --max-time $TIMEOUT "$BASE_URL/ready" > /dev/null
echo "✅ Readiness check passed"

# Check metrics endpoint
echo "Checking metrics endpoint..."
curl -f -s --max-time $TIMEOUT "$BASE_URL/metrics" > /dev/null
echo "✅ Metrics endpoint accessible"

# Check browser availability
echo "Checking browser availability..."
response=$(curl -s -X POST "$BASE_URL/api/v1/browser/test" \
  -H "Content-Type: application/json" \
  -d '{"test": "browser_availability"}')

if echo "$response" | grep -q "success"; then
    echo "✅ Browser automation service is working"
else
    echo "❌ Browser automation service failed"
    exit 1
fi

# Check LLM provider connectivity
echo "Checking LLM provider connectivity..."
response=$(curl -s -X POST "$BASE_URL/api/v1/llm/test" \
  -H "Content-Type: application/json" \
  -d '{"test": "connectivity"}')

if echo "$response" | grep -q "success"; then
    echo "✅ LLM providers are accessible"
else
    echo "⚠️ LLM provider connectivity issues detected"
fi

# Check database connectivity
echo "Checking database connectivity..."
response=$(curl -s "$BASE_URL/api/v1/health/database")

if echo "$response" | grep -q "healthy"; then
    echo "✅ Database connectivity is good"
else
    echo "❌ Database connectivity issues"
    exit 1
fi

echo "🎉 All health checks passed!"
```

### 3. Backup Script

```bash
#!/bin/bash
# scripts/backup.sh

set -e

BACKUP_DIR=${BACKUP_DIR:-/backups}
DATE=$(date +%Y%m%d_%H%M%S)
DATABASE_URL=${DATABASE_URL}

echo "💾 Starting backup process..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
echo "Backing up database..."
pg_dump $DATABASE_URL > $BACKUP_DIR/database_$DATE.sql
gzip $BACKUP_DIR/database_$DATE.sql

# Backup configuration files
echo "Backing up configuration..."
tar -czf $BACKUP_DIR/config_$DATE.tar.gz config/

# Backup automation logs
echo "Backing up logs..."
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz logs/

# Upload to cloud storage (if configured)
if [ ! -z "$AWS_S3_BUCKET" ]; then
    echo "Uploading to S3..."
    aws s3 cp $BACKUP_DIR/ s3://$AWS_S3_BUCKET/backups/ --recursive
fi

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "✅ Backup completed successfully!"
```

## 📈 Performance Tuning

### 1. Browser Performance Optimization

```python
# performance/browser_optimization.py
from browser_use.browser import BrowserConfig

def get_optimized_browser_config() -> BrowserConfig:
    """Get optimized browser configuration for Iraqi portals"""
    return BrowserConfig(
        # Browser settings
        browser_type=BrowserType.CHROME,
        mode=BrowserMode.HEADLESS,
        
        # Performance optimizations
        viewport_width=1366,  # Common Iraqi screen resolution
        viewport_height=768,
        timeout=90000,  # Extended for Iraqi network conditions
        
        # Iraqi-specific optimizations
        arabic_support=True,
        rtl_layout=True,
        iraqi_portals=True,
        network_optimization=True,
        
        # Memory and resource optimization
        extensions=[
            "ublock-origin",  # Block ads for faster loading
            "arabic-fonts"    # Arabic font support
        ],
        
        # Arguments for performance
        args=[
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-web-security",
            "--disable-features=TranslateUI",
            "--disable-ipc-flooding-protection",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--memory-pressure-off"
        ]
    )
```

### 2. Database Performance Optimization

```sql
-- init.sql - Database optimization for Iraqi portal automation
-- Performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_automation_requests_portal_date 
ON automation_requests(portal_name, created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_automation_results_status 
ON automation_results(status, created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_active 
ON user_sessions(is_active, last_activity);

-- Partitioning for large tables
CREATE TABLE automation_logs_2024 PARTITION OF automation_logs
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Iraqi-specific optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_national_id 
ON applications(national_id) WHERE national_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_passport_number 
ON applications(passport_number) WHERE passport_number IS NOT NULL;

-- Text search for Arabic content
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_arabic_content 
ON documents USING gin(to_tsvector('arabic', content));
```

This deployment guide provides comprehensive instructions for deploying the Browser-use system in production environments, with specific considerations for Iraqi government portal automation, security, performance, and cultural compliance.