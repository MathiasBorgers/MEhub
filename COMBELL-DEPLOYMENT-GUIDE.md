# Combell VPS Deployment Guide

⚠️ **WAARSCHUWING**: Dit vereist een Combell VPS (€15-50/maand) en technische kennis.
**Gratis alternatief**: Vercel (zie hieronder)

## Vereisten voor Combell VPS

1. **Combell VPS of Dedicated Server** (niet shared hosting!)
2. **Ubuntu 22.04 LTS** of hoger
3. **Root/SSH toegang**
4. **Minimaal 2GB RAM**

## Stappen voor Combell VPS

### 1. Server Setup

```bash
# Update systeem
sudo apt update && sudo apt upgrade -y

# Installeer Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installeer PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Installeer nginx
sudo apt install -y nginx

# Installeer pm2 (process manager)
sudo npm install -g pm2 pnpm
```

### 2. PostgreSQL Setup

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Maak database aan
sudo -u postgres psql
CREATE DATABASE "backend-project";
CREATE USER mehub_user WITH PASSWORD 'sterke_wachtwoord_hier';
GRANT ALL PRIVILEGES ON DATABASE "backend-project" TO mehub_user;
\q
```

### 3. Upload & Build Applicatie

```bash
# Maak directory
sudo mkdir -p /var/www/mehub
sudo chown $USER:$USER /var/www/mehub

# Clone/upload je code
cd /var/www/mehub
# Upload via SFTP of git clone

# Installeer dependencies
pnpm install

# Setup environment
nano .env
```

**.env voor productie:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://mehub_user:sterke_wachtwoord_hier@localhost:5432/backend-project
PRIVATE_KEY=your_private_key
PUBLIC_KEY=your_public_key
```

```bash
# Run migraties
npx prisma migrate deploy
npx prisma db seed

# Build applicatie
pnpm build

# Start met PM2
pm2 start npm --name "mehub" -- start
pm2 save
pm2 startup
```

### 4. Nginx Configuratie voor Subpath

```bash
sudo nano /etc/nginx/sites-available/mathiasborgers.be
```

**nginx config:**
```nginx
server {
    listen 80;
    server_name mathiasborgers.be www.mathiasborgers.be;

    # Bestaande website
    location / {
        root /var/www/html;
        index index.html index.php;
        # Je bestaande PHP configuratie hier
    }

    # Next.js app op /mehub
    location /mehub {
        rewrite ^/mehub(/.*)$ $1 break;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js static files
    location /_next {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activeer site
sudo ln -s /etc/nginx/sites-available/mathiasborgers.be /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Next.js Configuratie voor Subpath

Je moet `next.config.ts` aanpassen:

```typescript
const nextConfig: NextConfig = {
  basePath: '/mehub',
  assetPrefix: '/mehub',
  // ... rest van je config
};
```

### 6. SSL Certificaat (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d mathiasborgers.be -d www.mathiasborgers.be
```

## Geschatte Kosten

- **Combell VPS Start**: €14.99/maand
- **Combell VPS Plus**: €29.99/maand
- **Setup tijd**: 4-8 uur
- **Maintenance**: Regelmatige updates nodig

---

# ✅ GRATIS ALTERNATIEF: Vercel

## Waarom Vercel beter is:

| Feature | Combell VPS | Vercel |
|---------|-------------|--------|
| **Prijs** | €15-50/maand | €0 (gratis tier) |
| **Setup tijd** | 4-8 uur | 5 minuten |
| **Maintenance** | Jij | Automatisch |
| **SSL** | Handmatig | Automatisch |
| **CDN** | Optioneel (extra €) | Inbegrepen |
| **Auto-scaling** | Nee | Ja |
| **Database** | Zelf beheren | Managed PostgreSQL |
| **Deployment** | Handmatig | Git push |

## Vercel Deployment (5 minuten)

### 1. GitHub Repository
```bash
cd D:\MEhub
git init
git add .
git commit -m "Initial commit"
gh repo create mehub --public --source=. --push
```

### 2. Vercel Setup
1. Ga naar [vercel.com](https://vercel.com)
2. Login met GitHub
3. Import je repository
4. Vercel detecteert automatisch Next.js
5. Klik "Deploy"

### 3. Database Setup
```bash
# In Vercel dashboard
# Storage → Create Database → Postgres
# Copy DATABASE_URL
```

### 4. Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
DATABASE_URL=postgres://...vercel-url...
PRIVATE_KEY=your_key
PUBLIC_KEY=your_key
```

### 5. Custom Domain
In Vercel → Settings → Domains:
- Add: `mehub.mathiasborgers.be`
- Voeg CNAME record toe bij Combell DNS:
  - Name: `mehub`
  - Value: `cname.vercel-dns.com`

**Of gebruik een redirect:**
In je Combell hosting voeg redirect toe:
```
www.mathiasborgers.be/mehub → mehub.mathiasborgers.be
```

## Database Migratie naar Vercel Postgres

```bash
# Run één keer na database setup
npx prisma migrate deploy
npx prisma db seed
```

DONE! ✅ Je app is live op `mehub.mathiasborgers.be`

---

## Conclusie

### 💰 **Totale Kosten per Jaar**

| | Combell VPS | Vercel Gratis Tier |
|---|-------------|-------------------|
| **Hosting** | €180-600/jaar | **€0** ✅ |
| **Domain** | €10-15/jaar (heb je al) | **€0** (hergebruik bestaande) ✅ |
| **Database** | Inbegrepen in VPS | **€0** ✅ |
| **SSL** | Gratis | **€0** ✅ |
| **CDN** | €50-200/jaar (optioneel) | **€0** (inbegrepen) ✅ |
| **TOTAAL** | **€190-815/jaar** | **€0/jaar** ✅ |

**Besparing: €190-815 per jaar!** 💸

---

### 📊 **Feature Vergelijking**

**Voor Combell VPS:**
- ❌ €15-50/maand kosten
- ❌ Complex setup (4-8 uur)
- ❌ Zelf onderhoud & updates
- ❌ Geen auto-scaling
- ✅ Volledige controle
- ✅ Kan op subpath hosten

**Voor Vercel:**
- ✅ **100% Gratis** (voor je use case)
- ✅ **5 minuten setup**
- ✅ **Zero maintenance**
- ✅ **Beter performance** (Edge CDN)
- ✅ **Automatische deployments** (git push)
- ✅ **Auto-scaling**
- ✅ **Gebruik je bestaande domain**: `mehub.mathiasborgers.be`
- ✅ **Gratis SSL** (automatisch)
- ✅ **99.99% uptime SLA**

---

### 🎯 **Mijn Advies**

**Gebruik Vercel met subdomain `mehub.mathiasborgers.be`**

**Waarom?**
1. Bespaar €200-800 per jaar
2. Betere performance (CDN wereldwijd)
3. Geen onderhoud nodig
4. Professionele URL met je eigen domain
5. Setup in 5 minuten vs 8 uur

**Wanneer Combell VPS overwegen?**
- Je hebt al een VPS voor andere projecten
- Je wilt 100% controle over de server
- Je moet specifieke server software draaien
- Je site krijgt >100GB traffic/maand (dan Vercel Pro overwegen voor €20/maand)

