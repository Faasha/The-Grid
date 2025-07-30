#!/usr/bin/env python3
"""
The Grid - Local Development Server
Optimized for Termux and mobile environments
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import socket
import argparse
from pathlib import Path

class GridHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with mobile optimizations"""
    
    def end_headers(self):
        # Add mobile-friendly headers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Custom logging with timestamps"""
        import datetime
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")

def get_local_ip():
    """Get the local IP address for network access"""
    try:
        # Connect to a dummy address to get local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
        return local_ip
    except Exception:
        return "127.0.0.1"

def find_free_port(start_port=8000, max_attempts=10):
    """Find a free port starting from start_port"""
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    return None

def main():
    parser = argparse.ArgumentParser(description='The Grid - Local Development Server')
    parser.add_argument('--port', '-p', type=int, default=8000, 
                       help='Port to serve on (default: 8000)')
    parser.add_argument('--host', '-H', default='0.0.0.0',
                       help='Host to bind to (default: 0.0.0.0 for all interfaces)')
    parser.add_argument('--no-browser', action='store_true',
                       help='Don\'t automatically open browser')
    parser.add_argument('--directory', '-d', default='.',
                       help='Directory to serve (default: current directory)')
    
    args = parser.parse_args()
    
    # Change to the specified directory
    os.chdir(args.directory)
    
    # Check if index.html exists
    if not Path('index.html').exists():
        print("❌ Error: index.html not found in current directory!")
        print("Make sure you're running this from The Grid project directory.")
        sys.exit(1)
    
    # Find a free port if the default is taken
    port = find_free_port(args.port)
    if port is None:
        print(f"❌ Error: Could not find a free port starting from {args.port}")
        sys.exit(1)
    
    if port != args.port:
        print(f"⚠️  Port {args.port} is busy, using port {port} instead")
    
    # Setup the server
    handler = GridHTTPRequestHandler
    
    try:
        with socketserver.TCPServer((args.host, port), handler) as httpd:
            local_ip = get_local_ip()
            
            print("=" * 60)
            print("🌐 THE GRID - NEURAL INTERFACE SERVER")
            print("=" * 60)
            print(f"📡 Server Status: ONLINE")
            print(f"🔌 Local Access:  http://localhost:{port}")
            print(f"📱 Network Access: http://{local_ip}:{port}")
            print(f"📂 Serving from: {os.getcwd()}")
            print("=" * 60)
            print("💡 Termux Tips:")
            print("   • Use the network URL to access from other devices")
            print("   • Press Ctrl+C to stop the server")
            print("   • Swipe down for Termux notification controls")
            print("=" * 60)
            
            # Try to open browser automatically (works on some Termux setups)
            if not args.no_browser:
                try:
                    webbrowser.open(f'http://localhost:{port}')
                    print("🚀 Attempting to open browser...")
                except Exception:
                    print("📱 Browser auto-open not available (normal in Termux)")
            
            print("\n🎮 Starting The Grid server... Ready for neural connections!")
            print("   Waiting for incoming requests...\n")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🔌 Neural interface disconnected. Server shutdown complete.")
        print("   Thank you for using The Grid!")
    except OSError as e:
        if "Permission denied" in str(e):
            print(f"❌ Permission denied for port {port}")
            print("💡 Try using a port above 1024, e.g.: python3 server.py -p 8080")
        else:
            print(f"❌ Server error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()