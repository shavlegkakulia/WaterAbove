# Development Credentials

**⚠️ IMPORTANT: This file should NOT be committed to git in production!**

This file contains development/staging credentials for team reference only.

## 🔐 Admin Dashboard

```
URL: https://b31a0f653613.ngrok.app/
Username: admin
Password: watersabove2025
```

**Access:**
- Full admin panel access
- User management
- System configuration
- Analytics and reports

## 🌐 Backend URLs

### API
```
Base URL: https://b2aa9968f63a.ngrok.app
API Path: /api/v1
```

### WebApp
```
Main: https://0cdcbf22b0d6.ngrok.app/
Onboarding: https://0cdcbf22b0d6.ngrok.app/welcome
```

## 📚 Documentation

### Swagger API Docs
```
https://b2aa9968f63a.ngrok.app/api/v1/docs
```
Complete API documentation with try-it-out functionality.

## 🧪 Test Endpoints

### Test User Creation
```
https://b2aa9968f63a.ngrok.app/api/v1/test/app
```

### Test Payments
```
https://b2aa9968f63a.ngrok.app/api/v1/test/payment
```

### Test Spatial Rooms
```
https://b2aa9968f63a.ngrok.app/public/test-spatial-rooms.html
```

## 🔒 Security Notes

### Development Environment
- ✅ These are development credentials
- ✅ ngrok tunnels are temporary
- ✅ Backend runs on Docker locally
- ❌ DO NOT use these in production
- ❌ DO NOT share outside the team

### When Moving to Production
1. **Update all credentials**
2. **Use AWS secrets manager**
3. **Enable proper authentication**
4. **Set up rate limiting**
5. **Configure CORS properly**
6. **Enable SSL/TLS**

## 📝 Usage in Mobile App

These URLs are already configured in your `.env` file:

```env
API_BASE_URL=https://b2aa9968f63a.ngrok.app/api/v1
```

To use in code:
```typescript
import {env} from '@/config';

const apiUrl = env.API_BASE_URL;
```

## 👥 Team Access

**Current Team:**
- Ahmed (Backend/Team Lead)
- George (Mobile Development)

**Access Control:**
- All team members have API access
- Admin credentials shared for development
- Production will use individual accounts

## 🔄 When Credentials Change

If Ahmed updates any URLs or credentials:

1. **Update `.env` files:**
```bash
# Edit .env
nano .env

# Update API_BASE_URL
API_BASE_URL=<new_url>
```

2. **Restart Metro bundler:**
```bash
yarn start --reset-cache
```

3. **Update this file** with new credentials

4. **Notify team** in Slack/Discord

## 📞 Contact

**Questions about access or credentials:**
- Contact: Ahmed
- Check: Swagger docs
- Verify: ngrok tunnel status

---

**Last Updated:** October 30, 2025

Keep these credentials safe! 🔐

