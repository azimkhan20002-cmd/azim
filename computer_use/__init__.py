"""Let Claude see and control a virtual desktop via the computer use tool."""

from .agent import AgentEvents, ComputerUseAgent
from .computer import ComputerError, ToolResult, X11Computer
from .tools import COMPUTER_TOOL_TYPE, COMPUTER_USE_BETA, computer_tool_definition

__all__ = [
    "AgentEvents",
    "COMPUTER_TOOL_TYPE",
    "COMPUTER_USE_BETA",
    "ComputerError",
    "ComputerUseAgent",
    "ToolResult",
    "X11Computer",
    "computer_tool_definition",
]
