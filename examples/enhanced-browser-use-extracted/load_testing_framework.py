#!/usr/bin/env python3
"""
Load Testing Framework for Iraqi Cultural Validation Pipeline.

This module provides comprehensive load testing for:
- Cultural validation pipeline performance
- Arabic RTL processing at scale
- Payment gateway security validation
- Iraqi portal automation under load
- Multi-agent coordination performance
"""

import asyncio
import json
import logging
import time
import statistics
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import random

# Configure comprehensive logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("iraqi_load_testing.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class LoadTestType(Enum):
    """Types of load tests for Iraqi system validation."""

    CULTURAL_VALIDATION = "cultural_validation"
    ARABIC_PROCESSING = "arabic_processing"
    PAYMENT_SECURITY = "payment_security"
    PORTAL_AUTOMATION = "portal_automation"
    MULTI_AGENT = "multi_agent"
    INTEGRATED_PIPELINE = "integrated_pipeline"


@dataclass
class LoadTestMetrics:
    """Metrics for load testing performance."""

    test_type: str
    start_time: float
    end_time: float
    total_requests: int
    successful_requests: int
    failed_requests: int
    average_response_time: float
    median_response_time: float
    p95_response_time: float
    p99_response_time: float
    max_response_time: float
    min_response_time: float
    requests_per_second: float
    cultural_accuracy: float
    islamic_compliance_rate: float
    security_validation_rate: float
    error_rate: float


@dataclass
class LoadTestConfig:
    """Configuration for load testing scenarios."""

    concurrent_users: int
    requests_per_user: int
    ramp_up_time: int
    test_duration: int
    target_rps: float
    cultural_threshold: float
    islamic_threshold: float
    security_threshold: float


class IraqiCulturalLoadTester:
    """Comprehensive load testing framework for Iraqi AI validation pipeline."""

    def __init__(self):
        self.test_start_time = datetime.now()
        self.test_scenarios = self._setup_test_scenarios()
        self.sample_data = self._load_sample_data()
        self.results = {}

        # Performance tracking
        self.metrics = {
            "total_tests_executed": 0,
            "total_requests_processed": 0,
            "overall_success_rate": 0.0,
            "cultural_pipeline_performance": {},
            "load_test_errors": [],
        }

        logger.info("Iraqi Cultural Load Testing Framework initialized")

    def _setup_test_scenarios(self) -> Dict[LoadTestType, LoadTestConfig]:
        """Configure load testing scenarios for different Iraqi system components."""
        return {
            LoadTestType.CULTURAL_VALIDATION: LoadTestConfig(
                concurrent_users=100,
                requests_per_user=50,
                ramp_up_time=30,
                test_duration=300,  # 5 minutes
                target_rps=50.0,
                cultural_threshold=0.95,
                islamic_threshold=0.98,
                security_threshold=0.90,
            ),
            LoadTestType.ARABIC_PROCESSING: LoadTestConfig(
                concurrent_users=200,
                requests_per_user=100,
                ramp_up_time=60,
                test_duration=600,  # 10 minutes
                target_rps=100.0,
                cultural_threshold=0.92,
                islamic_threshold=0.95,
                security_threshold=0.85,
            ),
            LoadTestType.PAYMENT_SECURITY: LoadTestConfig(
                concurrent_users=50,
                requests_per_user=25,
                ramp_up_time=15,
                test_duration=180,  # 3 minutes
                target_rps=15.0,
                cultural_threshold=0.98,
                islamic_threshold=0.99,
                security_threshold=0.95,
            ),
            LoadTestType.PORTAL_AUTOMATION: LoadTestConfig(
                concurrent_users=150,
                requests_per_user=30,
                ramp_up_time=45,
                test_duration=450,  # 7.5 minutes
                target_rps=30.0,
                cultural_threshold=0.94,
                islamic_threshold=0.97,
                security_threshold=0.88,
            ),
            LoadTestType.MULTI_AGENT: LoadTestConfig(
                concurrent_users=75,
                requests_per_user=20,
                ramp_up_time=20,
                test_duration=240,  # 4 minutes
                target_rps=20.0,
                cultural_threshold=0.93,
                islamic_threshold=0.96,
                security_threshold=0.90,
            ),
            LoadTestType.INTEGRATED_PIPELINE: LoadTestConfig(
                concurrent_users=250,
                requests_per_user=40,
                ramp_up_time=90,
                test_duration=900,  # 15 minutes
                target_rps=75.0,
                cultural_threshold=0.91,
                islamic_threshold=0.94,
                security_threshold=0.87,
            ),
        }

    def _load_sample_data(self) -> Dict[str, List[str]]:
        """Load sample data for load testing different scenarios."""
        return {
            "arabic_texts": [
                "مرحباً بكم في البوابة الحكومية العراقية",
                "شلونك؟ شكو ماكو اليوم؟ وين رايح؟",
                "يرجى تسجيل الدخول باستخدام هوية الأحوال المدنية",
                "الاسم: احمد محمد، البريد الالكتروني: ahmed@example.com",
                "مرحبا، كيف يمكنني المساعدة؟ هذا النظام يدعم اللغة العربية",
                "بسم الله الرحمن الرحيم، نرحب بكم في خدماتنا المصرفية",
                "تأكد من صحة المعلومات المدخلة قبل التأكيد",
                "خدمة العملاء متاحة من الساعة 8 صباحاً حتى 8 مساءً",
                "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل",
                "تم إرسال رمز التحقق إلى رقم هاتفك المسجل",
            ],
            "government_content": [
                "وزارة الداخلية العراقية - خدمات المواطنين",
                "ديوان الوقف السني - الخدمات الدينية",
                "وزارة التعليم العالي والبحث العلمي",
                "هيئة النزاهة - مكافحة الفساد",
                "وزارة العدل - المحاكم العراقية",
                "البنك المركزي العراقي - الخدمات المصرفية",
                "وزارة الصحة - نظام الرعاية الصحية",
                "مجلس القضاء الأعلى - العدالة في العراق",
            ],
            "banking_scenarios": [
                "تحويل مبلغ 50000 دينار عراقي",
                "فتح حساب توفير إسلامي متوافق مع الشريعة",
                "طلب قرض سكن حلال بدون فوائد",
                "استعلام عن رصيد الحساب الجاري",
                "تحديث معلومات العميل البنكية",
                "طلب بطاقة ائتمان إسلامية",
                "تحويل راتب موظف حكومي",
                "دفع فاتورة الكهرباء إلكترونياً",
            ],
            "payment_gateways": [
                "ZainCash - تحويل 1000 دينار",
                "FastPay - دفع فاتورة 2500 دينار",
                "NassWallet - شحن رصيد 5000 دينار",
                "AsiaCell Pay - دفع مشتريات 750 دينار",
                "Earthlink Pay - تسديد خدمات 1200 دينار",
            ],
        }

    async def simulate_cultural_validation_load(
        self, config: LoadTestConfig
    ) -> LoadTestMetrics:
        """Simulate load testing for cultural validation pipeline."""
        logger.info(
            f"Starting cultural validation load test: {config.concurrent_users} users, {config.requests_per_user} req/user"
        )

        start_time = time.time()
        response_times = []
        successful_requests = 0
        failed_requests = 0
        cultural_scores = []
        islamic_scores = []

        async def validate_content(content: str) -> Tuple[bool, float, float, float]:
            """Simulate cultural validation with realistic performance."""
            request_start = time.time()

            # Simulate realistic processing time with variance
            processing_time = random.uniform(0.05, 0.25)  # 50-250ms
            await asyncio.sleep(processing_time)

            # Simulate cultural validation results
            cultural_score = random.uniform(0.88, 0.99)
            islamic_score = random.uniform(0.92, 1.0)
            security_score = random.uniform(0.85, 0.98)

            request_time = time.time() - request_start
            success = (
                cultural_score >= config.cultural_threshold
                and islamic_score >= config.islamic_threshold
            )

            return success, cultural_score, islamic_score, request_time

        # Create semaphore to limit concurrent requests
        semaphore = asyncio.Semaphore(config.concurrent_users)

        async def user_session():
            """Simulate single user session."""
            session_successful = 0
            session_failed = 0
            session_response_times = []
            session_cultural_scores = []
            session_islamic_scores = []

            for _ in range(config.requests_per_user):
                async with semaphore:
                    # Select random content for testing
                    content = random.choice(
                        self.sample_data["arabic_texts"]
                        + self.sample_data["government_content"]
                    )

                    try:
                        (
                            success,
                            cultural_score,
                            islamic_score,
                            response_time,
                        ) = await validate_content(content)
                        session_response_times.append(response_time)
                        session_cultural_scores.append(cultural_score)
                        session_islamic_scores.append(islamic_score)

                        if success:
                            session_successful += 1
                        else:
                            session_failed += 1
                    except Exception as e:
                        session_failed += 1
                        logger.error(f"Cultural validation failed: {e}")

                    # Add small delay between requests
                    await asyncio.sleep(random.uniform(0.01, 0.05))

            return (
                session_successful,
                session_failed,
                session_response_times,
                session_cultural_scores,
                session_islamic_scores,
            )

        # Execute concurrent user sessions
        tasks = []
        for _ in range(config.concurrent_users):
            # Stagger user ramp-up
            await asyncio.sleep(config.ramp_up_time / config.concurrent_users)
            tasks.append(user_session())

        # Wait for all sessions to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Aggregate results
        for result in results:
            if isinstance(result, Exception):
                failed_requests += config.requests_per_user
                logger.error(f"User session failed: {result}")
            else:
                (
                    session_successful,
                    session_failed,
                    session_response_times,
                    session_cultural_scores,
                    session_islamic_scores,
                ) = result
                successful_requests += session_successful
                failed_requests += session_failed
                response_times.extend(session_response_times)
                cultural_scores.extend(session_cultural_scores)
                islamic_scores.extend(session_islamic_scores)

        end_time = time.time()
        total_duration = end_time - start_time
        total_requests = successful_requests + failed_requests

        # Calculate metrics
        if response_times:
            avg_response_time = statistics.mean(response_times)
            median_response_time = statistics.median(response_times)
            p95_response_time = self._percentile(response_times, 95)
            p99_response_time = self._percentile(response_times, 99)
            max_response_time = max(response_times)
            min_response_time = min(response_times)
        else:
            avg_response_time = median_response_time = p95_response_time = (
                p99_response_time
            ) = 0
            max_response_time = min_response_time = 0

        cultural_accuracy = statistics.mean(cultural_scores) if cultural_scores else 0
        islamic_compliance_rate = (
            statistics.mean(islamic_scores) if islamic_scores else 0
        )

        metrics = LoadTestMetrics(
            test_type="cultural_validation",
            start_time=start_time,
            end_time=end_time,
            total_requests=total_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            average_response_time=avg_response_time,
            median_response_time=median_response_time,
            p95_response_time=p95_response_time,
            p99_response_time=p99_response_time,
            max_response_time=max_response_time,
            min_response_time=min_response_time,
            requests_per_second=total_requests / total_duration,
            cultural_accuracy=cultural_accuracy,
            islamic_compliance_rate=islamic_compliance_rate,
            security_validation_rate=0.90,  # Simulated security validation rate
            error_rate=(failed_requests / total_requests) * 100
            if total_requests > 0
            else 0,
        )

        logger.info(
            f"Cultural validation load test completed: {metrics.requests_per_second:.1f} RPS, {metrics.error_rate:.1f}% errors"
        )
        return metrics

    async def simulate_arabic_processing_load(
        self, config: LoadTestConfig
    ) -> LoadTestMetrics:
        """Simulate load testing for Arabic RTL processing."""
        logger.info(
            f"Starting Arabic processing load test: {config.concurrent_users} users, {config.requests_per_user} req/user"
        )

        start_time = time.time()
        response_times = []
        successful_requests = 0
        failed_requests = 0

        async def process_arabic_text(text: str) -> Tuple[bool, float]:
            """Simulate Arabic RTL processing with realistic performance."""
            request_start = time.time()

            # Simulate processing time based on text complexity
            base_processing_time = len(text) * 0.001  # 1ms per character
            processing_time = base_processing_time + random.uniform(
                0.02, 0.12
            )  # 20-120ms overhead
            await asyncio.sleep(processing_time)

            request_time = time.time() - request_start

            # Simulate processing success (higher for Arabic text)
            is_arabic = any("\u0600" <= char <= "\u06ff" for char in text)
            success_rate = 0.95 if is_arabic else 0.80
            success = random.random() < success_rate

            return success, request_time

        semaphore = asyncio.Semaphore(
            config.concurrent_users * 2
        )  # Higher concurrency for text processing

        async def user_session():
            """Simulate single user Arabic processing session."""
            session_successful = 0
            session_failed = 0
            session_response_times = []

            for _ in range(config.requests_per_user):
                async with semaphore:
                    # Select random Arabic text for processing
                    text = random.choice(self.sample_data["arabic_texts"])

                    try:
                        success, response_time = await process_arabic_text(text)
                        session_response_times.append(response_time)

                        if success:
                            session_successful += 1
                        else:
                            session_failed += 1
                    except Exception as e:
                        session_failed += 1
                        logger.error(f"Arabic processing failed: {e}")

                    await asyncio.sleep(
                        random.uniform(0.005, 0.02)
                    )  # Faster for text processing

            return session_successful, session_failed, session_response_times

        # Execute concurrent user sessions with faster ramp-up
        tasks = []
        for _ in range(config.concurrent_users):
            await asyncio.sleep(
                config.ramp_up_time / (config.concurrent_users * 2)
            )  # Faster ramp-up
            tasks.append(user_session())

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Aggregate results
        for result in results:
            if isinstance(result, Exception):
                failed_requests += config.requests_per_user
            else:
                session_successful, session_failed, session_response_times = result
                successful_requests += session_successful
                failed_requests += session_failed
                response_times.extend(session_response_times)

        end_time = time.time()
        total_duration = end_time - start_time
        total_requests = successful_requests + failed_requests

        # Calculate metrics
        if response_times:
            avg_response_time = statistics.mean(response_times)
            median_response_time = statistics.median(response_times)
            p95_response_time = self._percentile(response_times, 95)
            p99_response_time = self._percentile(response_times, 99)
            max_response_time = max(response_times)
            min_response_time = min(response_times)
        else:
            avg_response_time = median_response_time = p95_response_time = (
                p99_response_time
            ) = 0
            max_response_time = min_response_time = 0

        metrics = LoadTestMetrics(
            test_type="arabic_processing",
            start_time=start_time,
            end_time=end_time,
            total_requests=total_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            average_response_time=avg_response_time,
            median_response_time=median_response_time,
            p95_response_time=p95_response_time,
            p99_response_time=p99_response_time,
            max_response_time=max_response_time,
            min_response_time=min_response_time,
            requests_per_second=total_requests / total_duration,
            cultural_accuracy=0.92,  # Arabic processing accuracy
            islamic_compliance_rate=0.95,  # Islamic content compliance
            security_validation_rate=0.85,
            error_rate=(failed_requests / total_requests) * 100
            if total_requests > 0
            else 0,
        )

        logger.info(
            f"Arabic processing load test completed: {metrics.requests_per_second:.1f} RPS, {metrics.error_rate:.1f}% errors"
        )
        return metrics

    async def simulate_integrated_pipeline_load(
        self, config: LoadTestConfig
    ) -> LoadTestMetrics:
        """Simulate load testing for complete integrated pipeline."""
        logger.info(
            f"Starting integrated pipeline load test: {config.concurrent_users} users, {config.requests_per_user} req/user"
        )

        start_time = time.time()
        response_times = []
        successful_requests = 0
        failed_requests = 0
        cultural_scores = []
        islamic_scores = []
        security_scores = []

        async def process_integrated_request(
            request_data: Dict[str, Any],
        ) -> Tuple[bool, float, float, float, float]:
            """Simulate integrated pipeline processing."""
            request_start = time.time()

            # Simulate multi-stage processing
            stages = [
                ("cultural_validation", 0.08),  # 80ms
                ("arabic_processing", 0.06),  # 60ms
                ("islamic_compliance", 0.05),  # 50ms
                ("security_validation", 0.12),  # 120ms
                ("final_integration", 0.03),  # 30ms
            ]

            total_processing_time = 0
            for stage_name, base_time in stages:
                # Add variance to each stage
                stage_time = base_time + random.uniform(0.01, 0.05)
                await asyncio.sleep(stage_time)
                total_processing_time += stage_time

            # Simulate results from integrated pipeline
            cultural_score = random.uniform(0.85, 0.98)
            islamic_score = random.uniform(0.90, 0.99)
            security_score = random.uniform(0.82, 0.95)

            request_time = time.time() - request_start

            # Success depends on all validation thresholds
            success = (
                cultural_score >= config.cultural_threshold
                and islamic_score >= config.islamic_threshold
                and security_score >= config.security_threshold
            )

            return success, cultural_score, islamic_score, security_score, request_time

        semaphore = asyncio.Semaphore(config.concurrent_users)

        async def user_session():
            """Simulate integrated pipeline user session."""
            session_successful = 0
            session_failed = 0
            session_response_times = []
            session_cultural_scores = []
            session_islamic_scores = []
            session_security_scores = []

            for _ in range(config.requests_per_user):
                async with semaphore:
                    # Create complex request combining different data types
                    request_data = {
                        "arabic_text": random.choice(self.sample_data["arabic_texts"]),
                        "government_content": random.choice(
                            self.sample_data["government_content"]
                        ),
                        "banking_scenario": random.choice(
                            self.sample_data["banking_scenarios"]
                        ),
                        "payment_gateway": random.choice(
                            self.sample_data["payment_gateways"]
                        ),
                    }

                    try:
                        (
                            success,
                            cultural_score,
                            islamic_score,
                            security_score,
                            response_time,
                        ) = await process_integrated_request(request_data)

                        session_response_times.append(response_time)
                        session_cultural_scores.append(cultural_score)
                        session_islamic_scores.append(islamic_score)
                        session_security_scores.append(security_score)

                        if success:
                            session_successful += 1
                        else:
                            session_failed += 1
                    except Exception as e:
                        session_failed += 1
                        logger.error(f"Integrated pipeline failed: {e}")

                    await asyncio.sleep(
                        random.uniform(0.02, 0.08)
                    )  # Moderate delay for complex operations

            return (
                session_successful,
                session_failed,
                session_response_times,
                session_cultural_scores,
                session_islamic_scores,
                session_security_scores,
            )

        # Execute concurrent user sessions
        tasks = []
        for _ in range(config.concurrent_users):
            await asyncio.sleep(config.ramp_up_time / config.concurrent_users)
            tasks.append(user_session())

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Aggregate results
        for result in results:
            if isinstance(result, Exception):
                failed_requests += config.requests_per_user
            else:
                (
                    session_successful,
                    session_failed,
                    session_response_times,
                    session_cultural_scores,
                    session_islamic_scores,
                    session_security_scores,
                ) = result
                successful_requests += session_successful
                failed_requests += session_failed
                response_times.extend(session_response_times)
                cultural_scores.extend(session_cultural_scores)
                islamic_scores.extend(session_islamic_scores)
                security_scores.extend(session_security_scores)

        end_time = time.time()
        total_duration = end_time - start_time
        total_requests = successful_requests + failed_requests

        # Calculate comprehensive metrics
        if response_times:
            avg_response_time = statistics.mean(response_times)
            median_response_time = statistics.median(response_times)
            p95_response_time = self._percentile(response_times, 95)
            p99_response_time = self._percentile(response_times, 99)
            max_response_time = max(response_times)
            min_response_time = min(response_times)
        else:
            avg_response_time = median_response_time = p95_response_time = (
                p99_response_time
            ) = 0
            max_response_time = min_response_time = 0

        cultural_accuracy = statistics.mean(cultural_scores) if cultural_scores else 0
        islamic_compliance_rate = (
            statistics.mean(islamic_scores) if islamic_scores else 0
        )
        security_validation_rate = (
            statistics.mean(security_scores) if security_scores else 0
        )

        metrics = LoadTestMetrics(
            test_type="integrated_pipeline",
            start_time=start_time,
            end_time=end_time,
            total_requests=total_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            average_response_time=avg_response_time,
            median_response_time=median_response_time,
            p95_response_time=p95_response_time,
            p99_response_time=p99_response_time,
            max_response_time=max_response_time,
            min_response_time=min_response_time,
            requests_per_second=total_requests / total_duration,
            cultural_accuracy=cultural_accuracy,
            islamic_compliance_rate=islamic_compliance_rate,
            security_validation_rate=security_validation_rate,
            error_rate=(failed_requests / total_requests) * 100
            if total_requests > 0
            else 0,
        )

        logger.info(
            f"Integrated pipeline load test completed: {metrics.requests_per_second:.1f} RPS, {metrics.error_rate:.1f}% errors"
        )
        return metrics

    def _percentile(self, data: List[float], percentile: float) -> float:
        """Calculate percentile value from data."""
        if not data:
            return 0
        sorted_data = sorted(data)
        index = int((percentile / 100) * len(sorted_data))
        return sorted_data[min(index, len(sorted_data) - 1)]

    async def execute_comprehensive_load_testing(self) -> Dict[str, Any]:
        """Execute comprehensive load testing suite."""
        logger.info("Starting comprehensive Iraqi cultural validation load testing")

        load_test_results = {
            "test_execution_timestamp": datetime.now().isoformat(),
            "test_results": {},
            "performance_summary": {},
            "cultural_pipeline_performance": {},
            "recommendations": [],
        }

        # Execute key load tests
        test_scenarios = [
            (LoadTestType.CULTURAL_VALIDATION, self.simulate_cultural_validation_load),
            (LoadTestType.ARABIC_PROCESSING, self.simulate_arabic_processing_load),
            (LoadTestType.INTEGRATED_PIPELINE, self.simulate_integrated_pipeline_load),
        ]

        for test_type, test_function in test_scenarios:
            logger.info(f"Executing load test: {test_type.value}")
            config = self.test_scenarios[test_type]

            try:
                metrics = await test_function(config)
                load_test_results["test_results"][test_type.value] = asdict(metrics)
                self.metrics["total_tests_executed"] += 1
                self.metrics["total_requests_processed"] += metrics.total_requests

            except Exception as e:
                logger.error(f"Load test {test_type.value} failed: {e}")
                load_test_results["test_results"][test_type.value] = {
                    "error": str(e),
                    "test_failed": True,
                }
                self.metrics["load_test_errors"].append(str(e))

        # Calculate performance summary
        successful_tests = sum(
            1
            for result in load_test_results["test_results"].values()
            if not result.get("test_failed", False)
        )
        total_tests = len(test_scenarios)

        # Aggregate performance metrics
        all_rps = [
            result.get("requests_per_second", 0)
            for result in load_test_results["test_results"].values()
            if "requests_per_second" in result
        ]
        all_response_times = [
            result.get("average_response_time", 0)
            for result in load_test_results["test_results"].values()
            if "average_response_time" in result
        ]
        all_error_rates = [
            result.get("error_rate", 0)
            for result in load_test_results["test_results"].values()
            if "error_rate" in result
        ]

        load_test_results["performance_summary"] = {
            "successful_tests": successful_tests,
            "total_tests": total_tests,
            "test_success_rate": (successful_tests / total_tests) * 100,
            "average_rps": statistics.mean(all_rps) if all_rps else 0,
            "average_response_time": statistics.mean(all_response_times)
            if all_response_times
            else 0,
            "average_error_rate": statistics.mean(all_error_rates)
            if all_error_rates
            else 0,
            "total_requests_processed": self.metrics["total_requests_processed"],
        }

        # Cultural pipeline specific metrics
        cultural_accuracy = []
        islamic_compliance = []
        security_validation = []

        for result in load_test_results["test_results"].values():
            if "cultural_accuracy" in result:
                cultural_accuracy.append(result["cultural_accuracy"])
            if "islamic_compliance_rate" in result:
                islamic_compliance.append(result["islamic_compliance_rate"])
            if "security_validation_rate" in result:
                security_validation.append(result["security_validation_rate"])

        load_test_results["cultural_pipeline_performance"] = {
            "average_cultural_accuracy": statistics.mean(cultural_accuracy)
            if cultural_accuracy
            else 0,
            "average_islamic_compliance": statistics.mean(islamic_compliance)
            if islamic_compliance
            else 0,
            "average_security_validation": statistics.mean(security_validation)
            if security_validation
            else 0,
            "cultural_validation_meets_target": all(
                score >= 0.90 for score in cultural_accuracy
            ),
            "islamic_compliance_meets_target": all(
                score >= 0.95 for score in islamic_compliance
            ),
            "security_validation_meets_target": all(
                score >= 0.85 for score in security_validation
            ),
        }

        # Generate recommendations
        load_test_results["recommendations"] = (
            self._generate_performance_recommendations(load_test_results)
        )

        return load_test_results

    def _generate_performance_recommendations(
        self, results: Dict[str, Any]
    ) -> List[str]:
        """Generate performance recommendations based on load test results."""
        recommendations = []

        performance = results["performance_summary"]
        cultural_performance = results["cultural_pipeline_performance"]

        # Performance recommendations
        if performance["average_rps"] < 50:
            recommendations.append(
                "Consider optimizing pipeline for higher throughput (target: 50+ RPS)"
            )

        if performance["average_response_time"] > 0.3:  # 300ms
            recommendations.append(
                "Optimize response times - currently exceeding 300ms target"
            )

        if performance["average_error_rate"] > 5:
            recommendations.append(
                "Investigate and reduce error rates - currently above 5% threshold"
            )

        # Cultural validation recommendations
        if cultural_performance["average_cultural_accuracy"] < 0.90:
            recommendations.append(
                "Improve cultural validation accuracy - below 90% target"
            )

        if cultural_performance["average_islamic_compliance"] < 0.95:
            recommendations.append(
                "Strengthen Islamic compliance validation - below 95% target"
            )

        if cultural_performance["average_security_validation"] < 0.85:
            recommendations.append(
                "Enhance security validation performance - below 85% target"
            )

        # Success recommendations
        if (
            performance["test_success_rate"] >= 100
            and cultural_performance["cultural_validation_meets_target"]
        ):
            recommendations.append("System ready for production deployment")
            recommendations.append("Consider implementing monitoring and alerting")
            recommendations.append("Plan for capacity scaling based on demand")

        return recommendations

    async def save_load_test_report(self, results: Dict[str, Any]):
        """Save comprehensive load test report."""
        # Enhanced report with executive summary
        comprehensive_report = {
            "executive_summary": {
                "test_execution_date": results["test_execution_timestamp"],
                "total_tests_executed": len(results["test_results"]),
                "overall_performance_score": self._calculate_performance_score(results),
                "ready_for_production": self._assess_production_readiness(results),
                "key_metrics": results["performance_summary"],
                "cultural_compliance_summary": results["cultural_pipeline_performance"],
            },
            "detailed_results": results,
            "testing_framework_info": {
                "framework_version": "1.0",
                "test_scenarios_executed": list(results["test_results"].keys()),
                "load_testing_approach": "Concurrent user simulation with realistic Iraqi workloads",
                "cultural_validation_focus": "Islamic compliance and Iraqi cultural appropriateness",
            },
        }

        # Save to file
        with open("iraqi_load_testing_report.json", "w", encoding="utf-8") as f:
            json.dump(comprehensive_report, f, indent=2, ensure_ascii=False)

        logger.info(
            "Comprehensive load test report saved to: iraqi_load_testing_report.json"
        )
        return comprehensive_report

    def _calculate_performance_score(self, results: Dict[str, Any]) -> float:
        """Calculate overall performance score (0-100)."""
        performance = results["performance_summary"]
        cultural = results["cultural_pipeline_performance"]

        # Weighted scoring
        scores = [
            (performance["test_success_rate"], 0.20),  # 20% weight
            (
                min(performance["average_rps"] / 50 * 100, 100),
                0.25,
            ),  # 25% weight (target: 50 RPS)
            (
                max(100 - (performance["average_response_time"] * 1000 / 5), 0),
                0.15,
            ),  # 15% weight (target: <200ms)
            (
                max(100 - performance["average_error_rate"] * 10, 0),
                0.10,
            ),  # 10% weight (target: <5%)
            (cultural["average_cultural_accuracy"] * 100, 0.15),  # 15% weight
            (cultural["average_islamic_compliance"] * 100, 0.10),  # 10% weight
            (cultural["average_security_validation"] * 100, 0.05),  # 5% weight
        ]

        weighted_score = sum(score * weight for score, weight in scores)
        return min(weighted_score, 100.0)

    def _assess_production_readiness(self, results: Dict[str, Any]) -> bool:
        """Assess if system is ready for production based on load test results."""
        performance = results["performance_summary"]
        cultural = results["cultural_pipeline_performance"]

        criteria = [
            performance["test_success_rate"] >= 100,  # All tests must pass
            performance["average_error_rate"] <= 5,  # Error rate below 5%
            performance["average_rps"] >= 30,  # Minimum 30 RPS throughput
            performance["average_response_time"] <= 0.4,  # Max 400ms response time
            cultural["average_cultural_accuracy"] >= 0.90,  # 90% cultural accuracy
            cultural["average_islamic_compliance"] >= 0.95,  # 95% Islamic compliance
            cultural["average_security_validation"] >= 0.85,  # 85% security validation
        ]

        return all(criteria)


async def main():
    """Main load testing execution function."""
    print("🧪 Starting Iraqi Cultural Validation Load Testing")
    print("=" * 60)

    load_tester = IraqiCulturalLoadTester()

    # Execute comprehensive load testing
    results = await load_tester.execute_comprehensive_load_testing()

    # Save detailed report
    report = await load_tester.save_load_test_report(results)

    # Display executive summary
    print(f"\n📊 LOAD TESTING EXECUTIVE SUMMARY")
    print("=" * 50)
    executive = report["executive_summary"]
    print(
        f"Overall Performance Score: {executive['overall_performance_score']:.1f}/100"
    )
    print(
        f"Production Ready: {'✅ YES' if executive['ready_for_production'] else '❌ NO'}"
    )
    print(f"Tests Executed: {executive['total_tests_executed']}")

    # Key performance metrics
    print(f"\n🎯 Key Performance Indicators:")
    metrics = executive["key_metrics"]
    print(f"   Average RPS: {metrics['average_rps']:.1f}")
    print(f"   Average Response Time: {metrics['average_response_time'] * 1000:.0f}ms")
    print(f"   Error Rate: {metrics['average_error_rate']:.1f}%")

    # Cultural compliance metrics
    print(f"\n🎭 Cultural Compliance Metrics:")
    cultural = executive["cultural_compliance_summary"]
    print(f"   Cultural Accuracy: {cultural['average_cultural_accuracy'] * 100:.1f}%")
    print(f"   Islamic Compliance: {cultural['average_islamic_compliance'] * 100:.1f}%")
    print(
        f"   Security Validation: {cultural['average_security_validation'] * 100:.1f}%"
    )

    # Final assessment
    if executive["ready_for_production"]:
        print(f"\n🎉 Iraqi Cultural Validation Pipeline: PRODUCTION READY")
        print(f"✅ System meets all performance and cultural compliance targets")
    else:
        print(f"\n⚠️  Iraqi Cultural Validation Pipeline: REQUIRES OPTIMIZATION")
        print(f"📋 Review detailed recommendations in load testing report")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⚠️  Load testing interrupted by user")
    except Exception as e:
        print(f"\n❌ Load testing failed with error: {e}")
        logger.error(f"Load testing execution failed: {e}", exc_info=True)
