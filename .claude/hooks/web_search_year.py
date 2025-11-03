#!/usr/bin/env python3
"""
Web Search Year Hook
Automatically adds current year to web search queries when appropriate.

This hook enhances web search queries by appending the current year to queries
that don't already contain a year or temporal keywords (latest, recent, current, etc.).
This ensures searches return the most up-to-date information.

Usage:
    Invoked as a PreToolUse hook for WebSearch tool calls.
    Input: JSON with tool_input containing query
    Output: JSON with modified query if appropriate
"""

import json
import re
import sys
from datetime import datetime


def should_add_year(query: str) -> bool:
    """
    Determine if the current year should be added to the query.

    Args:
        query: The search query string

    Returns:
        True if year should be added, False otherwise
    """
    # Check if query already contains a year (20XX format)
    has_year = bool(re.search(r'\b20\d{2}\b', query))

    # Check if query contains temporal keywords
    temporal_keywords = ['latest', 'recent', 'current', 'new', 'now', 'today']
    has_temporal = any(word in query.lower() for word in temporal_keywords)

    return not has_year and not has_temporal


def modify_query(query: str) -> str:
    """
    Add current year to query if appropriate.

    Args:
        query: The original search query

    Returns:
        Modified query with year appended, or original query
    """
    if should_add_year(query):
        current_year = str(datetime.now().year)
        return f"{query} {current_year}"
    return query


def main():
    """
    Main hook entry point.
    Reads JSON input from stdin, modifies query if needed, outputs result.
    """
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)

        # Extract query from tool input
        tool_input = input_data.get('tool_input', {})
        original_query = tool_input.get('query', '')

        # Modify query if appropriate
        modified_query = modify_query(original_query)

        # Prepare output
        output = {
            'hookSpecificOutput': {
                'hookEventName': 'PreToolUse',
                'modifiedToolInput': {
                    'query': modified_query
                }
            }
        }

        # Output result
        print(json.dumps(output))
        sys.exit(0)

    except Exception as e:
        # On error, output original input unchanged
        sys.stderr.write(f"Error in web_search_year hook: {e}\n")
        sys.exit(1)


if __name__ == '__main__':
    main()
