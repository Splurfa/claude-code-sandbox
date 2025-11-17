#!/usr/bin/env bash
# Sandbox Initialization Script
# Creates a clean claude-flow workspace with stock architecture

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SANDBOX_NAME="${1:-claude-flow-clean}"
SANDBOX_DIR="${2:-$HOME/workspaces/$SANDBOX_NAME}"
CLAUDE_FLOW_VERSION="${CLAUDE_FLOW_VERSION:-alpha}"

# Logging functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        log_error "git is not installed"
        exit 1
    fi

    log_info "All prerequisites satisfied"
}

# Create sandbox directory structure
create_directory_structure() {
    log_info "Creating sandbox directory: $SANDBOX_DIR"

    mkdir -p "$SANDBOX_DIR"
    cd "$SANDBOX_DIR"

    # Initialize git repository
    if [ ! -d ".git" ]; then
        git init
        git config user.name "Claude Flow Sandbox"
        git config user.email "sandbox@claude-flow.local"
    fi

    # Create standard Node.js project structure
    mkdir -p {src,tests,docs,scripts}

    log_info "Directory structure created"
}

# Initialize Node.js project
init_nodejs_project() {
    log_info "Initializing Node.js project..."

    if [ ! -f "package.json" ]; then
        npm init -y

        # Update package.json with project details
        cat > package.json << 'EOF'
{
  "name": "claude-flow-clean-workspace",
  "version": "1.0.0",
  "description": "Clean claude-flow workspace with stock architecture",
  "main": "src/index.js",
  "scripts": {
    "test": "jest",
    "lint": "eslint src/**/*.js",
    "build": "echo 'Build step placeholder'",
    "sparc": "npx claude-flow sparc"
  },
  "keywords": ["claude-flow", "ai", "agents"],
  "author": "",
  "license": "MIT"
}
EOF
    fi

    log_info "Node.js project initialized"
}

# Install claude-flow
install_claude_flow() {
    log_info "Installing claude-flow@$CLAUDE_FLOW_VERSION..."

    npm install --save-dev "claude-flow@$CLAUDE_FLOW_VERSION"

    # Verify installation
    if npx claude-flow --version &> /dev/null; then
        log_info "claude-flow installed successfully"
    else
        log_error "claude-flow installation failed"
        exit 1
    fi
}

# Create stock CLAUDE.md
create_claude_md() {
    log_info "Creating stock CLAUDE.md..."

    cat > CLAUDE.md << 'EOF'
# Claude Code Configuration - Stock Claude-Flow

This is a stock claude-flow workspace following the official architecture.

## Quick Start

```bash
# Initialize swarm
npx claude-flow@alpha mcp swarm_init --topology mesh

# Spawn agents
npx claude-flow@alpha mcp agent_spawn --type researcher
npx claude-flow@alpha mcp agent_spawn --type coder

# Orchestrate tasks
npx claude-flow@alpha mcp task_orchestrate --task "Build REST API"
```

## SPARC Commands

- `npx claude-flow sparc modes` - List available modes
- `npx claude-flow sparc run <mode> "<task>"` - Execute specific mode
- `npx claude-flow sparc tdd "<feature>"` - Run complete TDD workflow

## Available Agents

Core: coder, reviewer, tester, planner, researcher
SPARC: specification, pseudocode, architecture, refinement
Specialized: backend-dev, api-docs, system-architect

## Hooks System

```bash
# Pre-task hook
npx claude-flow@alpha hooks pre-task --description "task" --task-id "id"

# Post-task hook
npx claude-flow@alpha hooks post-task --task-id "id" --status "completed"

# Memory operations
npx claude-flow@alpha hooks memory --action store --key "key" --value "data"
```

## File Organization

- `src/` - Source code
- `tests/` - Test files
- `docs/` - Documentation
- `scripts/` - Utility scripts
- `.swarm/` - Claude-flow data (auto-generated)

## Stock Architecture

This workspace uses 100% stock claude-flow with no custom extensions.
EOF

    log_info "CLAUDE.md created"
}

# Setup MCP configuration
setup_mcp_config() {
    log_info "Setting up MCP configuration..."

    # Create Claude config directory
    mkdir -p "$HOME/.claude"

    # Add claude-flow MCP server if not already configured
    if command -v claude &> /dev/null; then
        log_info "Configuring MCP server..."
        claude mcp add claude-flow "npx claude-flow@$CLAUDE_FLOW_VERSION mcp start" || true
    else
        log_warn "Claude CLI not found, skipping MCP configuration"
        log_warn "You can configure MCP manually later"
    fi
}

# Create .gitignore
create_gitignore() {
    log_info "Creating .gitignore..."

    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Claude-flow data
.swarm/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Environment
.env
.env.local

# Build output
dist/
build/
*.tsbuildinfo
EOF

    log_info ".gitignore created"
}

# Create initial commit
create_initial_commit() {
    log_info "Creating initial commit..."

    git add .
    git commit -m "Initial commit: Stock claude-flow workspace

- Stock CLAUDE.md configuration
- Node.js project setup
- claude-flow@$CLAUDE_FLOW_VERSION installed
- Standard directory structure" || true

    log_info "Initial commit created"
}

# Create README
create_readme() {
    log_info "Creating README.md..."

    cat > README.md << 'EOF'
# Claude-Flow Clean Workspace

Stock claude-flow workspace with official architecture.

## Setup

```bash
# Install dependencies
npm install

# Verify claude-flow
npx claude-flow --version
```

## Usage

See CLAUDE.md for complete documentation.

## Quick Commands

```bash
# SPARC modes
npx claude-flow sparc modes

# Initialize swarm
npx claude-flow@alpha mcp swarm_init --topology mesh

# Run hooks
npx claude-flow@alpha hooks pre-task --description "task"
```

## Architecture

This workspace follows 100% stock claude-flow architecture with no custom extensions.
EOF

    log_info "README.md created"
}

# Validate installation
validate_installation() {
    log_info "Validating installation..."

    # Check claude-flow
    if ! npx claude-flow --version &> /dev/null; then
        log_error "claude-flow validation failed"
        return 1
    fi

    # Check directory structure
    for dir in src tests docs scripts; do
        if [ ! -d "$dir" ]; then
            log_error "Missing directory: $dir"
            return 1
        fi
    done

    # Check essential files
    for file in package.json CLAUDE.md .gitignore README.md; do
        if [ ! -f "$file" ]; then
            log_error "Missing file: $file"
            return 1
        fi
    done

    log_info "Installation validated successfully"
}

# Print summary
print_summary() {
    echo ""
    echo "=========================================="
    echo "  Clean Sandbox Created Successfully!"
    echo "=========================================="
    echo ""
    echo "Location: $SANDBOX_DIR"
    echo "Claude-Flow: $CLAUDE_FLOW_VERSION"
    echo ""
    echo "Next steps:"
    echo "  1. cd $SANDBOX_DIR"
    echo "  2. Review CLAUDE.md for usage"
    echo "  3. npx claude-flow sparc modes"
    echo ""
    echo "Stock Architecture: 100%"
    echo "=========================================="
}

# Main execution
main() {
    log_info "Starting clean sandbox initialization..."

    check_prerequisites
    create_directory_structure
    init_nodejs_project
    install_claude_flow
    create_claude_md
    setup_mcp_config
    create_gitignore
    create_readme
    create_initial_commit
    validate_installation
    print_summary

    log_info "Sandbox initialization complete!"
}

# Run main function
main "$@"
