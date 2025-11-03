import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://troillanbelen:mbtt47181513@archivosya.7xasars.mongodb.net/';

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Atlas conectado correctamente');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

export function disconnectDB(): Promise<void> {
    return mongoose.disconnect();
}
