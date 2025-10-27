# Socket.io Connection Fix

## The Problem
You were getting this error:
```
GET http://localhost:3000/socket.io?EIO=4&transport=polling&t=rnisakmz 404 (Not Found)
```

This means Socket.io was trying to connect but couldn't find the server.

## The Solution

### ❌ DON'T do this:
```bash
npm run dev:next  # This starts Next.js without Socket.io
# or
next dev          # This also won't work with Socket.io
```

### ✅ DO this:
```bash
npm run dev       # This uses the custom server.js with Socket.io
# or
node server.js    # Direct server start
```

## How to Verify It's Working

1. **Start the server correctly:**
   ```bash
   npm run dev
   ```

2. **Look for these logs in the terminal:**
   ```
   > Ready on http://localhost:3000
   User connected: [socket-id]
   User joined room: [email]
   ```

3. **Check browser console:**
   - Should show: Socket.io connected
   - NO 404 errors

## Current Setup

### Server Files:
- `server.js` - Custom HTTP server with Socket.io
- `src/lib/socket.js` - Socket.io configuration

### Client Files:
- `src/app/dashboard/company/messages/page.jsx`
- `src/app/dashboard/candidate/messages/page.jsx`

Both have Socket.io client connection code.

### Package.json Scripts:
```json
"dev": "node server.js",     // ✅ Use this for dev
"dev:next": "next dev",      // ❌ Don't use this
"start": "node server.js",    // ✅ Use this for production
```

## Testing Real-Time Chat

1. Open two browser tabs/windows
2. Login as different users (company and candidate)
3. Go to messages in both
4. Send a message from one
5. Should appear instantly in the other without refresh

## If Still Not Working

1. **Check if port 3000 is already in use:**
   ```bash
   lsof -i :3000
   ```
   
2. **Kill any old processes:**
   ```bash
   pkill -f "next dev"
   ```

3. **Restart the server:**
   ```bash
   npm run dev
   ```

4. **Clear browser cache and restart**

## Environment Variables

Make sure `.env.local` has:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

If running on a different port, update this variable.

