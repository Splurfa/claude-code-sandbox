#!/bin/bash

# Meta-Skill Build Testing - Results Viewer
# Session: session-20251118-164332-meta-skill-build

SESSION_DIR="/Users/splurfa/common-thread-sandbox/sessions/session-20251118-164332-meta-skill-build"
DOCS_DIR="$SESSION_DIR/artifacts/docs"
TESTS_DIR="$SESSION_DIR/artifacts/tests"
SANDBOX_DIR="$SESSION_DIR/artifacts/sandbox"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Meta-Skill Build Testing - Results Viewer            ║${NC}"
echo -e "${BLUE}║  Session: session-20251118-164332-meta-skill-build    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Main menu
while true; do
    echo -e "${GREEN}Available Reports:${NC}"
    echo "  1) Session Summary (README)"
    echo "  2) Test Results (detailed)"
    echo "  3) Production Recommendations"
    echo "  4) Sandbox Setup Guide"
    echo "  5) Test Suite (test cases)"
    echo "  6) View Sandbox Skills"
    echo "  7) Compare Sandbox to Production"
    echo "  8) Quick Stats"
    echo "  9) Exit"
    echo ""
    read -p "Select option (1-9): " choice

    case $choice in
        1)
            echo -e "\n${BLUE}Opening Session Summary...${NC}\n"
            if command -v bat &> /dev/null; then
                bat "$DOCS_DIR/README.md"
            else
                less "$DOCS_DIR/README.md"
            fi
            ;;
        2)
            echo -e "\n${BLUE}Opening Test Results...${NC}\n"
            if command -v bat &> /dev/null; then
                bat "$DOCS_DIR/test-results.md"
            else
                less "$DOCS_DIR/test-results.md"
            fi
            ;;
        3)
            echo -e "\n${BLUE}Opening Production Recommendations...${NC}\n"
            if command -v bat &> /dev/null; then
                bat "$DOCS_DIR/production-deployment-recommendations.md"
            else
                less "$DOCS_DIR/production-deployment-recommendations.md"
            fi
            ;;
        4)
            echo -e "\n${BLUE}Opening Sandbox Setup Guide...${NC}\n"
            if command -v bat &> /dev/null; then
                bat "$DOCS_DIR/sandbox-setup.md"
            else
                less "$DOCS_DIR/sandbox-setup.md"
            fi
            ;;
        5)
            echo -e "\n${BLUE}Opening Test Suite...${NC}\n"
            if command -v bat &> /dev/null; then
                bat "$TESTS_DIR/test-suite.md"
            else
                less "$TESTS_DIR/test-suite.md"
            fi
            ;;
        6)
            echo -e "\n${BLUE}Sandbox Skills:${NC}\n"
            ls -1 "$SANDBOX_DIR/.claude/skills/"
            echo ""
            echo -e "${GREEN}Total: $(ls -1 "$SANDBOX_DIR/.claude/skills/" | wc -l) skills${NC}"
            echo ""
            ;;
        7)
            echo -e "\n${BLUE}Comparing Sandbox to Production...${NC}\n"
            PROD_DIR="/Users/splurfa/common-thread-sandbox/.claude"
            if diff -r "$PROD_DIR" "$SANDBOX_DIR/.claude" > /dev/null 2>&1; then
                echo -e "${GREEN}✓ Sandbox and production are identical${NC}"
            else
                echo -e "${YELLOW}⚠ Differences found:${NC}"
                diff -r "$PROD_DIR" "$SANDBOX_DIR/.claude" | head -20
                echo ""
                echo "Run 'diff -r $PROD_DIR $SANDBOX_DIR/.claude' for full diff"
            fi
            echo ""
            ;;
        8)
            echo -e "\n${BLUE}Quick Stats:${NC}\n"
            echo "Files copied: $(find "$SANDBOX_DIR/.claude" -type f | wc -l)"
            echo "Skills found: $(ls -1 "$SANDBOX_DIR/.claude/skills/" | wc -l)"
            echo "Tests passed: 15/18 (83%)"
            echo "Deferred tests: 3 (runtime required)"
            echo ""
            echo -e "${GREEN}Status: ✓ READY FOR DEPLOYMENT (with conditions)${NC}"
            echo -e "${GREEN}Confidence: 85% (95%+ after runtime tests)${NC}"
            echo ""
            ;;
        9)
            echo -e "\n${GREEN}Goodbye!${NC}\n"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}Invalid option. Please select 1-9.${NC}\n"
            ;;
    esac
done
