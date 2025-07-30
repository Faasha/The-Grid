# The Grid 🌐
> A web-based, lo-fi sci-fi game prototype about digital scavengers.

**Optimized for Termux and mobile environments** 📱

## 🎮 Game Overview

The Grid is an immersive text-based cyberpunk game where you play as "Ghost", a digital scavenger navigating a neural network interface. Scan for nodes, establish connections, and explore the digital underground in this atmospheric terminal-style experience.

### Features
- 🖥️ **Authentic terminal interface** with command history
- 📱 **Mobile-optimized** with touch-friendly controls
- 🌐 **Network discovery** and connection mechanics
- 🎨 **Cyberpunk aesthetic** with glowing animations
- 🔒 **Progressive gameplay** with credits and security levels
- ⚡ **Real-time status updates** and immersive feedback

## 🚀 Quick Setup for Termux

### One-Line Installation
```bash
curl -sSL https://raw.githubusercontent.com/your-repo/the-grid/main/setup.sh | bash
```

### Manual Installation
1. **Install dependencies:**
   ```bash
   pkg update && pkg install python git
   ```

2. **Clone or download the project:**
   ```bash
   git clone https://github.com/your-repo/the-grid.git
   cd the-grid
   ```

3. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

4. **Start the game:**
   ```bash
   ./start-grid.sh
   ```

## 🎯 How to Play

### Starting the Server
Choose your preferred method:

```bash
# Quick start (interactive)
./start-grid.sh

# Background mode
./start-grid-bg.sh

# Manual with options
python3 server.py -p 8080
```

### Basic Commands
- `scan` - Search for network nodes
- `connect [node_name]` - Connect to a discovered node
- `disconnect` - Disconnect from current node
- `status` - View system status
- `nodes` - List discovered nodes
- `credits` - Check credit balance
- `help` - Show all commands
- `clear` - Clear terminal

### Game Flow
1. **Scan** the network to discover nodes
2. **Connect** to interesting targets
3. **Explore** each node's unique environment
4. **Collect** credits and information
5. **Progress** through increasingly secure systems

## 📱 Termux Optimization

### Performance Features
- **Touch-friendly UI** with quick command buttons
- **Mobile-responsive design** that works on small screens
- **Optimized font sizes** for mobile readability
- **Background mode** for continuous operation
- **Network access** for multi-device play

### Termux-Specific Tips
- Use `termux-wake-lock` to prevent device sleep
- Swipe down for notification controls
- Volume Up + C to interrupt processes
- Access from other devices using the network URL
- Grant storage permissions for sharing saves

## 🛠️ Development

### File Structure
```
the-grid/
├── index.html          # Main game interface
├── server.py          # Local development server
├── setup.sh           # Termux installation script
├── start-grid.sh      # Quick start script
├── start-grid-bg.sh   # Background start script
└── README.md          # This file
```

### Technical Details
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python HTTP server
- **Styling**: Tailwind CSS for responsive design
- **Fonts**: JetBrains Mono for authentic terminal feel
- **Dependencies**: None! (Uses CDN for Tailwind)

### Customization
The game is designed to be easily hackable:
- Edit `index.html` to modify the UI
- Extend command definitions in the JavaScript
- Customize server options in `server.py`
- Add new game mechanics and features

## 🌐 Network Access

### Local Access
- **URL**: `http://localhost:8000`
- **Use case**: Single device play

### Network Access
- **URL**: `http://[your-ip]:8000`
- **Use case**: Multi-device or sharing with friends
- **Find your IP**: The server displays it on startup

### Port Configuration
```bash
# Use different port
python3 server.py -p 8080

# Bind to specific interface
python3 server.py -H 127.0.0.1

# See all options
python3 server.py --help
```

## 🎨 Screenshots

```
╔══════════════════════════════════════════════════════════════╗
║                         THE GRID                            ║
║                Digital Scavenger Network Interface          ║
╚══════════════════════════════════════════════════════════════╝

[SYSTEM] System initialized. Welcome, Ghost.
> scan
[SYSTEM] Quantum scan complete. Found 4 nodes:
  - [NEXUS-01] Online | 23ms | Sec: Medium
  - [PROXY-ALPHA] Online | 12ms | Sec: Low
  - [DATA-VAULT-7] Online | 45ms | Sec: High
  - [DEBUG-CONSOLE] Online | 7ms | Sec: Minimal
> connect nexus-01
[SYSTEM] Uplink to NEXUS-01 established. Neural handshake complete.
```

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
```bash
# Check if port is in use
python3 server.py -p 8080

# Check Python installation
python3 --version
```

**Can't access from other devices:**
- Ensure you're using the network IP, not localhost
- Check firewall settings
- Verify devices are on the same network

**Termux-specific issues:**
```bash
# Update packages
pkg update && pkg upgrade

# Reinstall Python
pkg uninstall python && pkg install python

# Reset storage permissions
termux-setup-storage
```

### Performance Tips
- Use background mode for better battery life
- Close other apps to free up memory
- Use a stable WiFi connection for network play
- Enable developer options for better performance

## 🤝 Contributing

Feel free to contribute to The Grid:
1. Fork the repository
2. Create feature branches
3. Submit pull requests
4. Report bugs and suggest features

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by classic terminal hacking games
- Built for the Termux community
- Cyberpunk aesthetics inspired by the genre classics

---

**Happy hacking, Ghost!** 🕶️💻

*"In The Grid, information wants to be free..."*
