
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/archivosya';

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB conectado correctamente');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

export function disconnectDB(): Promise<void> {
    return mongoose.disconnect();
}