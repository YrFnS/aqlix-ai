# Monitoring, Logging & Error Tracking Setup

Complete guide for setting up Sentry, structured logging, and monitoring for the Iraqi AI Chat System.

## Overview

The system uses three complementary monitoring approaches:

1. **Sentry** - Error tracking and performance monitoring
2. **Structured Logging** - JSON-based logging for debugging
3. **Custom Metrics** - Business-specific metrics tracking

## Sentry Setup

### Prerequisites

- Sentry account (https://sentry.io/)
- Sentry project DSN

### Configuration

1. **Create Sentry Projects**

   Create separate projects for each environment:
   - Development
   - Staging
   - Production

2. **Get DSN URLs**

   From Sentry dashboard, copy DSN for each project.

3. **Set Environment Variables**

   ```bash
   # Development
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_ENVIRONMENT=development
   SENTRY_TRACES_SAMPLE_RATE=0.5  # 50% of transactions

   # Staging
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_ENVIRONMENT=staging
   SENTRY_TRACES_SAMPLE_RATE=0.5

   # Production
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_ENVIRONMENT=production
   SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% of transactions for cost control
   ```

4. **Initialize Sentry**

   In application startup:
   ```python
   from services.monitoring_service import MonitoringService

   MonitoringService.initialize_sentry(
       dsn=settings.SENTRY_DSN,
       environment=settings.NODE_ENV,
       traces_sample_rate=0.1,
   )
   ```

### Key Features

#### Error Tracking
- Automatic error capture
- Stack trace recording
- Source map support
- Error grouping

#### Performance Monitoring
- Transaction tracking
- Slow query detection
- API endpoint profiling
- Database query monitoring

#### Custom Context
- User identification
- Request context
- Business context
- Error breadcrumbs

## Structured Logging

### Configuration

The system uses JSON structured logging for easy parsing and querying.

```python
# In main.py
MonitoringService.setup_structured_logging(
    log_level="INFO",
    format="json",
)
```

### Log Levels

- **DEBUG** - Detailed information for debugging
- **INFO** - General information about application flow
- **WARNING** - Warning messages about potential issues
- **ERROR** - Error messages
- **CRITICAL** - Critical application errors

### Log Format

Each log entry includes:
```json
{
  "timestamp": "2025-01-15T10:30:45.123Z",
  "level": "ERROR",
  "logger": "services.chat_service",
  "message": "Failed to process message",
  "user_id": "user-123",
  "session_id": "session-456",
  "context": {
    "event_type": "chat_message",
    "processing_time_ms": 5234,
    "model": "gpt-4o"
  },
  "error": {
    "type": "APIError",
    "message": "OpenAI API timeout",
    "stack_trace": "..."
  }
}
```

### Integration with ELK Stack

For advanced log aggregation using Elasticsearch, Logstash, Kibana:

1. **Configure Logstash**

   ```ruby
   input {
     tcp {
       port => 5000
       codec => json
     }
   }

   filter {
     # Parse log fields
   }

   output {
     elasticsearch {
       hosts => ["localhost:9200"]
       index => "iraqi-ai-logs-%{+YYYY.MM.dd}"
     }
   }
   ```

2. **Send Logs to Logstash**

   ```python
   import json
   import socket

   def send_to_logstash(log_record):
       sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
       sock.connect(("logstash-host", 5000))
       sock.sendall(json.dumps(log_record).encode())
       sock.close()
   ```

## Key Metrics

### API Performance Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API Response Time (P95) | < 200ms | > 500ms |
| Error Rate | < 1% | > 5% |
| Availability | 99.9% | < 99% |
| Throughput | > 100 req/s | < 50 req/s |

### Business Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Chat Completion Rate | > 99% | < 95% |
| Payment Success Rate | > 99% | < 95% |
| Document Processing Time | < 5s | > 10s |
| User Registration Success | > 95% | < 80% |

### Cultural Compliance Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Cultural Appropriateness Score | > 95% | < 90% |
| Islamic Compliance Score | > 99% | < 95% |
| Arabic RTL Accuracy | > 99% | < 98% |
| Dialect Recognition | > 85% | < 80% |

## Dashboards

### Dashboard 1: System Health

```sql
-- API Response Time Trend
SELECT
  timestamp,
  P95(response_time_ms) as p95_latency,
  AVG(response_time_ms) as avg_latency,
  MAX(response_time_ms) as max_latency
FROM transactions
WHERE environment = 'production'
GROUP BY timestamp
ORDER BY timestamp DESC
LIMIT 100
```

### Dashboard 2: Error Analysis

```sql
-- Error Rate by Endpoint
SELECT
  http_method,
  http_url,
  COUNT(*) as error_count,
  COUNT(*) / (SELECT COUNT(*) FROM events) * 100 as error_percentage
FROM events
WHERE level = 'error'
GROUP BY http_method, http_url
ORDER BY error_count DESC
```

### Dashboard 3: Business Metrics

```sql
-- Chat Completion Rate
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_chats,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*) * 100 as completion_rate
FROM chat_sessions
GROUP BY DATE(created_at)
ORDER BY date DESC
```

## Alerting

### Critical Alerts

Set up alerts for:

1. **High Error Rate**
   - Threshold: > 5% errors
   - Severity: Critical
   - Actions: Slack, PagerDuty, SMS

2. **Payment Failures**
   - Threshold: > 10 failed payments in 1 hour
   - Severity: Critical
   - Actions: Slack, Email, SMS

3. **Database Connection Failures**
   - Threshold: Connection refused
   - Severity: Critical
   - Actions: PagerDuty, SMS

4. **API Latency**
   - Threshold: P95 > 1000ms
   - Severity: Warning
   - Actions: Slack, Email

5. **Cultural Compliance Failures**
   - Threshold: < 90% compliance
   - Severity: Warning
   - Actions: Slack, Email

## Sample Implementation

### In FastAPI Route Handler

```python
from services.monitoring_service import MonitoringService

@app.post("/api/v1/chat/{session_id}/messages")
async def send_message(
    session_id: str,
    request: MessageCreate,
    current_user: dict = Depends(get_current_user_dependency),
):
    # Set user context
    MonitoringService.set_user_context(
        user_id=current_user["user_id"],
        email=current_user.get("email"),
    )

    # Add breadcrumb for user action
    MonitoringService.add_breadcrumb(
        message=f"User sending message to chat",
        category="user_action",
        data={"session_id": session_id},
    )

    # Start transaction for performance tracking
    with MonitoringService.start_transaction("send_message"):
        try:
            response = await chat_service.send_message(...)
            return response
        except Exception as e:
            # Capture error with context
            MonitoringService.capture_exception(
                e,
                context={
                    "session_id": session_id,
                    "user_id": current_user["user_id"],
                },
            )
            raise
```

## Monitoring Checklist

- [ ] Sentry projects created for all environments
- [ ] Sentry DSN configured in environment variables
- [ ] Structured logging enabled
- [ ] Dashboards created in Sentry
- [ ] Alerts configured for critical metrics
- [ ] ELK stack deployed (optional but recommended)
- [ ] Log retention policies set
- [ ] Performance baselines established
- [ ] On-call rotation configured
- [ ] Incident response procedures documented

## Troubleshooting

### Sentry Not Capturing Errors

1. Check DSN is correct
2. Verify network connectivity to Sentry
3. Check Sentry project settings
4. Review Sentry SDK initialization

### Missing Logs

1. Verify log level is correct (DEBUG, INFO, etc.)
2. Check logging configuration
3. Verify log output destination
4. Check for log filtering rules

### High Error Rates

1. Check recent code changes
2. Review API response time metrics
3. Check database connectivity
4. Review payment gateway status

## References

- [Sentry Documentation](https://docs.sentry.io/)
- [Structlog Documentation](https://www.structlog.org/)
- [ELK Stack Setup](https://www.elastic.co/)
- [Monitoring Best Practices](https://docs.your-domain.com/monitoring)
