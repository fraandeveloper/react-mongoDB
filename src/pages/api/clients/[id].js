import dbConnect from '../../../services/Db';
import Client from '../../../models/Client';

dbConnect();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'PUT':
      try {
        const { name, email } = req.body;

        if (!name && !email) throw 'Invalid data';

        await Client.updateOne({_id: id}, {name, email});
        res.status(200).json({success: true, data: clients});

      } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error});
      }
    break;
    case 'DELETE':
      try {
        await Client.deleteOne({_id: id});
        res.status(201).json({success: true});

      } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error});
      }
    break;
  }
}
