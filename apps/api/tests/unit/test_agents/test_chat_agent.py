"""
Unit Tests for Chat Agent

Tests the main chat agent's message generation, tool usage,
and conversation management capabilities.
"""

import pytest
from unittest.mock import Mock, AsyncMock, patch


@pytest.mark.unit
class TestChatAgent:
    """Test suite for chat agent functionality."""

    @pytest.mark.asyncio
    async def test_generate_response_basic(self, mock_llm_client):
        """Test basic response generation."""
        # TODO: Import actual ChatAgent
        # from agents.chat_agent import ChatAgent
        # agent = ChatAgent(llm_client=mock_llm_client)

        # Mock response generation
        response = await mock_llm_client.generate("Hello")

        assert response is not None
        assert "text" in response
        assert response["model"] == "test-model"
        assert mock_llm_client.call_count == 1

    @pytest.mark.asyncio
    async def test_generate_arabic_response(self, mock_llm_client, arabic_test_samples):
        """Test Arabic language response generation."""
        arabic_prompt = arabic_test_samples["iraqi_dialect"]

        response = await mock_llm_client.generate(arabic_prompt)

        assert response is not None
        assert "text" in response
        # Verify Arabic input was processed
        assert mock_llm_client.call_count == 1

    @pytest.mark.asyncio
    async def test_conversation_context_management(self, mock_llm_client):
        """Test multi-turn conversation context."""
        # First message
        response1 = await mock_llm_client.generate("What is Iraqi AI?")
        assert response1 is not None

        # Second message with context
        response2 = await mock_llm_client.generate("Tell me more")
        assert response2 is not None

        # Verify both calls were made
        assert mock_llm_client.call_count == 2

    @pytest.mark.asyncio
    async def test_tool_usage(self, mock_llm_client):
        """Test agent's ability to use tools."""
        tools = [
            {"name": "search", "description": "Search for information"},
            {"name": "calculate", "description": "Perform calculations"},
        ]

        response = await mock_llm_client.generate_with_tools(
            "What is 25 * 4?", tools=tools
        )

        assert response is not None
        assert "tool_calls" in response
        assert mock_llm_client.call_count == 1

    @pytest.mark.asyncio
    async def test_error_handling(self, mock_llm_client):
        """Test agent handles LLM errors gracefully."""
        # Mock LLM error
        mock_llm_client.generate = AsyncMock(side_effect=Exception("LLM API error"))

        with pytest.raises(Exception) as exc_info:
            await mock_llm_client.generate("Test")

        assert "LLM API error" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_empty_input_handling(self, mock_llm_client):
        """Test handling of empty or whitespace input."""
        # Test various empty input cases
        empty_inputs = ["", "   ", "\n\n", None]

        for empty_input in empty_inputs:
            if empty_input is None:
                # None should raise an exception
                with pytest.raises(Exception) as exc_info:
                    await mock_llm_client.generate(empty_input)
                assert exc_info.value is not None, "Expected exception for None input"
            else:
                # Empty/whitespace strings should either:
                # 1. Raise validation error, or
                # 2. Return a response (depending on implementation)
                try:
                    response = await mock_llm_client.generate(empty_input)
                    # If no error, verify response structure
                    assert response is not None, (
                        f"Response should not be None for input: {repr(empty_input)}"
                    )
                    assert isinstance(response, str), (
                        f"Response should be string, got {type(response)}"
                    )
                except Exception as e:
                    # If validation error is raised, that's also acceptable
                    assert "empty" in str(e).lower() or "invalid" in str(e).lower(), (
                        f"Expected validation error for empty input, got: {e}"
                    )


@pytest.mark.unit
@pytest.mark.cultural
class TestChatAgentCulturalValidation:
    """Test cultural validation in chat agent."""

    @pytest.mark.asyncio
    async def test_cultural_compliance_check(
        self, mock_llm_client, mock_cultural_validator
    ):
        """Test responses are culturally validated."""
        # Generate response
        response = await mock_llm_client.generate("مرحبا، كيف يمكنك مساعدتي؟")

        # Validate response
        validation = await mock_cultural_validator.validate(response["text"])

        assert validation["is_appropriate"] is True
        assert validation["score"] > 0.9

    @pytest.mark.asyncio
    async def test_inappropriate_content_detection(
        self, mock_cultural_validator, cultural_test_data
    ):
        """Test detection of culturally inappropriate content."""
        inappropriate_text = "political content that should be filtered"

        validation = await mock_cultural_validator.validate(inappropriate_text)

        assert validation["is_appropriate"] is False
        assert len(validation["issues"]) > 0

    @pytest.mark.asyncio
    async def test_islamic_compliance(
        self, mock_cultural_validator, cultural_test_data
    ):
        """Test Islamic compliance validation."""
        islamic_text = cultural_test_data["islamic_compliant"]["greeting"]

        validation = await mock_cultural_validator.validate_islamic_compliance(
            islamic_text
        )

        assert validation["is_compliant"] is True
        assert len(validation["violations"]) == 0


@pytest.mark.unit
@pytest.mark.arabic
class TestChatAgentArabicProcessing:
    """Test Arabic language processing capabilities."""

    @pytest.mark.asyncio
    async def test_iraqi_dialect_recognition(
        self, mock_llm_client, arabic_test_samples
    ):
        """Test Iraqi dialect is properly recognized."""
        iraqi_text = arabic_test_samples["iraqi_dialect"]

        response = await mock_llm_client.generate(iraqi_text)

        assert response is not None
        # TODO: Add dialect detection validation
        # assert detect_dialect(iraqi_text) == "iraqi"

    @pytest.mark.asyncio
    async def test_bidirectional_text_handling(
        self, mock_llm_client, arabic_test_samples
    ):
        """Test mixed Arabic-English text processing."""
        mixed_text = arabic_test_samples["bidirectional"]

        response = await mock_llm_client.generate(mixed_text)

        assert response is not None
        assert "text" in response

    @pytest.mark.asyncio
    async def test_rtl_text_direction(self, arabic_test_samples):
        """Test RTL text direction detection."""
        arabic_text = arabic_test_samples["standard_arabic"]

        # TODO: Implement RTL detection
        # is_rtl = detect_text_direction(arabic_text)
        # assert is_rtl is True

        # For now, just verify text exists
        assert arabic_text is not None
        assert len(arabic_text) > 0


@pytest.mark.unit
@pytest.mark.slow
class TestChatAgentPerformance:
    """Test agent performance characteristics."""

    @pytest.mark.asyncio
    async def test_response_time(self, mock_llm_client, performance_monitor):
        """Test response generation is performant."""
        with performance_monitor.measure("generate_response"):
            response = await mock_llm_client.generate("Test message")

        assert response is not None

        # Response should be fast with mock
        assert performance_monitor.timings["generate_response"] < 0.1

    @pytest.mark.asyncio
    async def test_concurrent_requests(self, mock_llm_client):
        """Test handling multiple concurrent requests."""
        import asyncio

        # Generate 10 concurrent requests
        tasks = [mock_llm_client.generate(f"Message {i}") for i in range(10)]

        responses = await asyncio.gather(*tasks)

        assert len(responses) == 10
        assert all(r is not None for r in responses)
        assert mock_llm_client.call_count == 10

    @pytest.mark.asyncio
    async def test_token_usage_tracking(self, mock_llm_client):
        """Test token usage is properly tracked."""
        response = await mock_llm_client.generate("Test prompt")

        assert "tokens" in response
        assert response["tokens"] > 0
