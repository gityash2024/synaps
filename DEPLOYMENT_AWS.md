# Synapses Frontend Deployment Guide - AWS Droplet with Nginx

This guide provides step-by-step instructions for deploying the Synapses frontend application on an AWS EC2 instance using Nginx as a web server.

## Prerequisites
- AWS account with access to EC2 service
- SSH client (Terminal for macOS/Linux, PuTTY for Windows)
- Domain name (optional)
- Built React application (`npm run build` or `yarn build`)

## Step 1: AWS EC2 Instance Setup

1. **Launch EC2 Instance**:
   - Log into AWS Console
   - Navigate to EC2 Dashboard
   - Click "Launch Instance"
   - Choose Ubuntu Server 22.04 LTS
   - Select t2.micro (free tier) or larger
   - Configure instance details:
     - Default VPC
     - Enable auto-assign public IP
   - Add storage (8GB is sufficient)
   - Add tags (optional)
   - Configure security group:
     ```
     Type        Protocol    Port Range    Source
     SSH         TCP         22            Your IP
     HTTP        TCP         80            0.0.0.0/0
     HTTPS       TCP         443           0.0.0.0/0
     ```
   - Review and launch
   - Create new key pair or use existing
   - Download key pair (if new)
   - Launch instance

2. **Connect to Instance**:
   ```bash
   # For macOS/Linux
   chmod 400 your-key-pair.pem
   ssh -i your-key-pair.pem ubuntu@your-instance-public-ip

   # For Windows (using PuTTY)
   # Convert .pem to .ppk using PuTTYgen
   # Use PuTTY to connect with the .ppk file
   ```

## Step 2: Server Setup

1. **Update System**:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. **Install Required Software**:
   ```bash
   # Install Node.js and npm
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install Nginx
   sudo apt install -y nginx

   # Install Certbot (for HTTPS)
   sudo apt install -y certbot python3-certbot-nginx
   ```

3. **Configure Firewall**:
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

## Step 3: Application Deployment

1. **Create Application Directory**:
   ```bash
   sudo mkdir -p /var/www/synapses
   sudo chown -R ubuntu:ubuntu /var/www/synapses
   ```

2. **Transfer Build Files**:
   ```bash
   # From your local machine
   scp -i your-key-pair.pem -r build/* ubuntu@your-instance-public-ip:/var/www/synapses/
   ```

3. **Configure Nginx**:
   ```bash
   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/synapses
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # Or your EC2 public IP
       root /var/www/synapses;
       index index.html;

       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_min_length 10240;
       gzip_proxied expired no-cache no-store private auth;
       gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml;
       gzip_disable "MSIE [1-6]\.";

       location / {
           try_files $uri $uri/ /index.html;
           expires 30d;
           add_header Cache-Control "public, no-transform";
       }

       # Static file caching
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 30d;
           add_header Cache-Control "public, no-transform";
       }

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;
       add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
   }
   ```

4. **Enable Site Configuration**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/synapses /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default  # Remove default site
   sudo nginx -t  # Test configuration
   sudo systemctl restart nginx
   ```

## Step 4: SSL Configuration (Optional)

1. **Install SSL Certificate**:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

2. **Auto-renewal Setup**:
   ```bash
   sudo systemctl status certbot.timer  # Verify auto-renewal is active
   ```

## Step 5: Maintenance and Monitoring

1. **Monitor Nginx Logs**:
   ```bash
   sudo tail -f /var/nginx/access.log
   sudo tail -f /var/nginx/error.log
   ```

2. **Restart Services**:
   ```bash
   sudo systemctl restart nginx  # Restart Nginx
   ```

3. **Update Application**:
   ```bash
   # From your local machine
   npm run build  # or yarn build
   scp -i your-key-pair.pem -r build/* ubuntu@your-instance-public-ip:/var/www/synapses/
   ```

## Troubleshooting

1. **Check Nginx Status**:
   ```bash
   sudo systemctl status nginx
   ```

2. **Check Nginx Configuration**:
   ```bash
   sudo nginx -t
   ```

3. **Check Permissions**:
   ```bash
   ls -la /var/www/synapses
   sudo chown -R ubuntu:ubuntu /var/www/synapses
   ```

4. **Check Firewall**:
   ```bash
   sudo ufw status
   ```

5. **Common Issues**:
   - 502 Bad Gateway: Check if application is running
   - 404 Not Found: Check file paths and permissions
   - SSL Issues: Verify certificate installation and renewal

6. **DNS and API Issues**:
   - The frontend is currently running on the server IP. Once the DNS record is added, it will automatically run on the main domain, and no further action will be required.
   - DNS Record Details:
     ```
     Type: A
     Name: frontend
     Value: 16.24.169.224
     ```
   - Getting a 401 error from APIs on the frontend, although the correct API call is going from the IP. This might be resolved by step 6 or may require a backend fix to allow the response.

## Performance Optimization

1. **Enable Brotli Compression** (Optional):
   ```bash
   sudo apt install -y nginx-module-brotli
   ```
   
   Add to Nginx configuration:
   ```nginx
   brotli on;
   brotli_comp_level 6;
   brotli_types text/plain text/css application/javascript application/json image/svg+xml;
   ```

2. **Configure Browser Caching**:
   Already included in the Nginx configuration above.

3. **Enable HTTP/2**:
   Automatically enabled with SSL configuration.

## Security Best Practices

1. **Regular Updates**:
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

2. **Backup Configuration**:
   ```bash
   sudo cp /etc/nginx/sites-available/synapses /etc/nginx/sites-available/synapses.backup
   ```

3. **Monitor Security Logs**:
   ```bash
   sudo tail -f /var/log/auth.log
   ```

4. **Set Up Fail2Ban** (Optional):
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

## Additional Resources
- [Nginx Documentation](https://nginx.org/en/docs/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Certbot Documentation](https://certbot.eff.org/docs)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs) 
