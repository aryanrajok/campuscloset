import mongoose from 'mongoose';
import dns from 'dns';

// Fix for networks that block DNS queries to .mongodb.net domains
// Forces Node.js to use Google Public DNS (8.8.8.8) for all DNS lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global cache for the Mongoose connection.
 * In development, Next.js hot-reloads and re-evaluates modules.
 * This cache prevents creating multiple connections.
 */
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
        };

        console.log('🔌 Connecting to MongoDB Atlas...');
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
            console.log('✅ Connected to MongoDB Atlas successfully!');
            return m;
        }).catch((err) => {
            console.error('❌ MongoDB connection failed:', err.message);
            cached.promise = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
