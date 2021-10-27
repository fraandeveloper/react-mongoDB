import dbConnect from '../../../services/Db';
import Client from '../../../models/Client';

dbConnect();

export default async function handler(req, res) {
  const {method } = req;

  switch (method) {
    case 'GET':
      try {
        const clients = await Client.find({});
        res.status(200).json({success: true, data: clients});

      } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error});
      }
    break;
    case 'POST':
      try {
        const {name, email} = req.body;

        if (!name && !email) throw 'Invalid data';

        const client = await Client.create({name, email});
        res.status(201).json({success: true , data: client});

      } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error});
      }
    break;
  }
}
