#!/data/data/com.termux/files/usr/bin/bash

# The Grid - Termux Setup Script
# Automated installation and configuration for mobile devices

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fancy banner
print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                         THE GRID                            ║"
    echo "║                   Termux Setup Script                       ║"
    echo "║              Digital Scavenger Installation                 ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Progress indicator
progress() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Success indicator
success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

# Warning indicator
warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Error indicator
error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if we're running on Termux
check_termux() {
    if [[ ! -d "/data/data/com.termux" ]]; then
        warning "This script is optimized for Termux, but can work on other Linux systems."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Installation cancelled."
            exit 1
        fi
    else
        success "Termux environment detected."
    fi
}

# Update package list and install Python
install_dependencies() {
    progress "Updating package lists..."
    if command -v pkg >/dev/null 2>&1; then
        pkg update -y >/dev/null 2>&1
        progress "Installing Python..."
        pkg install python -y >/dev/null 2>&1
    elif command -v apt >/dev/null 2>&1; then
        apt update >/dev/null 2>&1
        apt install python3 -y >/dev/null 2>&1
    else
        warning "Package manager not found. Please install Python manually."
        return 1
    fi
    success "Dependencies installed successfully."
}

# Check Python installation
check_python() {
    if command -v python3 >/dev/null 2>&1; then
        PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
        success "Python $PYTHON_VERSION is available."
    elif command -v python >/dev/null 2>&1; then
        PYTHON_VERSION=$(python --version 2>&1 | cut -d' ' -f2)
        success "Python $PYTHON_VERSION is available."
    else
        error "Python not found. Installing..."
        install_dependencies
    fi
}

# Setup The Grid project
setup_project() {
    progress "Setting up The Grid project..."
    
    # Make server script executable
    if [[ -f "server.py" ]]; then
        chmod +x server.py
        success "Server script made executable."
    else
        error "server.py not found!"
        exit 1
    fi
    
    # Check for required files
    if [[ -f "index.html" ]]; then
        success "Game interface found."
    else
        error "index.html not found!"
        exit 1
    fi
}

# Create convenience scripts
create_scripts() {
    progress "Creating convenience scripts..."
    
    # Create start script
    cat > start-grid.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
echo "🌐 Starting The Grid Neural Interface..."
python3 server.py "$@"
EOF
    chmod +x start-grid.sh
    
    # Create background start script
    cat > start-grid-bg.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
echo "🌐 Starting The Grid in background..."
nohup python3 server.py "$@" > grid.log 2>&1 &
echo "✓ Server started in background. Check grid.log for output."
echo "💡 Use 'pkill -f server.py' to stop the server."
EOF
    chmod +x start-grid-bg.sh
    
    success "Convenience scripts created."
}

# Setup storage permissions for Termux
setup_storage() {
    if [[ -d "/data/data/com.termux" ]]; then
        progress "Setting up storage access..."
        if command -v termux-setup-storage >/dev/null 2>&1; then
            echo "This will request storage permissions..."
            echo "Grant access to share The Grid with other apps."
            read -p "Setup storage access? (Y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                termux-setup-storage
                success "Storage access configured."
            fi
        fi
    fi
}

# Test the installation
test_installation() {
    progress "Testing installation..."
    
    # Test Python availability
    if python3 -c "import http.server, socketserver, webbrowser, os, sys, socket, argparse" 2>/dev/null; then
        success "All Python modules available."
    else
        warning "Some Python modules may be missing."
    fi
    
    # Test server script
    if python3 server.py --help >/dev/null 2>&1; then
        success "Server script working correctly."
    else
        error "Server script test failed."
        exit 1
    fi
}

# Show usage instructions
show_instructions() {
    echo
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗"
    echo -e "║                    INSTALLATION COMPLETE                    ║"
    echo -e "╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
    echo -e "${GREEN}🎮 How to start The Grid:${NC}"
    echo
    echo -e "  ${BLUE}Option 1 - Quick Start:${NC}"
    echo -e "    ./start-grid.sh"
    echo
    echo -e "  ${BLUE}Option 2 - Background Mode:${NC}"
    echo -e "    ./start-grid-bg.sh"
    echo
    echo -e "  ${BLUE}Option 3 - Manual Start:${NC}"
    echo -e "    python3 server.py"
    echo
    echo -e "${GREEN}🔧 Advanced options:${NC}"
    echo -e "    python3 server.py -p 8080     # Use port 8080"
    echo -e "    python3 server.py --help      # Show all options"
    echo
    echo -e "${GREEN}💡 Termux Tips:${NC}"
    echo -e "  • Swipe down for notification controls"
    echo -e "  • Use 'termux-wake-lock' to prevent sleep"
    echo -e "  • Access from other devices using the network URL"
    echo -e "  • Use volume up + C to interrupt"
    echo
    echo -e "${YELLOW}🌐 After starting, open your browser to:${NC}"
    echo -e "    http://localhost:8000"
    echo
}

# Main installation process
main() {
    print_banner
    
    echo -e "${CYAN}Initializing neural interface installation...${NC}"
    echo
    
    check_termux
    check_python
    setup_project
    create_scripts
    setup_storage
    test_installation
    
    success "Installation completed successfully!"
    show_instructions
}

# Run main function
main "$@"