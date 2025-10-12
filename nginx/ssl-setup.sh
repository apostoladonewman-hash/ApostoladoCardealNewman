#!/bin/bash

# ==================================
# SSL Certificate Setup Script
# Uses Let's Encrypt (Certbot)
# ==================================

set -e

echo "🔐 SSL Certificate Setup"
echo "=========================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
   echo "⚠️  Please run as root (sudo)"
   exit 1
fi

# Variables
DOMAIN="${1:-apostolado.com}"
EMAIL="${2:-admin@apostolado.com}"
WEBROOT="/var/www/certbot"
SSL_DIR="/etc/nginx/ssl"

echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Install certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."

    # Detect OS
    if [ -f /etc/debian_version ]; then
        apt-get update
        apt-get install -y certbot
    elif [ -f /etc/redhat-release ]; then
        yum install -y certbot
    else
        echo "❌ Unsupported OS. Please install certbot manually."
        exit 1
    fi

    echo "✅ Certbot installed"
fi

# Create webroot directory
mkdir -p "$WEBROOT"
echo "✅ Webroot directory created: $WEBROOT"

# Create SSL directory
mkdir -p "$SSL_DIR"
echo "✅ SSL directory created: $SSL_DIR"

# Obtain certificate
echo ""
echo "📜 Obtaining SSL certificate..."
certbot certonly \
    --webroot \
    --webroot-path="$WEBROOT" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

# Create symlinks to certificates
ln -sf "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$SSL_DIR/fullchain.pem"
ln -sf "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$SSL_DIR/privkey.pem"
ln -sf "/etc/letsencrypt/live/$DOMAIN/chain.pem" "$SSL_DIR/chain.pem"

echo "✅ Certificate symlinks created"

# Setup auto-renewal cron job
CRON_JOB="0 0,12 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'"
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_JOB") | crontab -

echo "✅ Auto-renewal cron job configured"

# Test certificate renewal
echo ""
echo "🧪 Testing certificate renewal..."
certbot renew --dry-run

echo ""
echo "✅ SSL setup completed successfully!"
echo ""
echo "Certificate details:"
certbot certificates

echo ""
echo "Next steps:"
echo "1. Update nginx.conf with your domain name"
echo "2. Reload nginx: systemctl reload nginx"
echo "3. Test SSL: https://www.ssllabs.com/ssltest/"
