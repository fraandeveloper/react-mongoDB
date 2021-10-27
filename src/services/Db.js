import mongoose from 'mongoose';

const connection = {};

async function dbConnect() {

  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.NEXT_URL_MOOGOSE, {
    useNewUrlParser: true,
    useInifiedTopology: true
  })

  connection.isConnected = db.connections[0].readyState
}

export default dbConnect;