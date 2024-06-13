import mongod from '@services/mongodb.js';
import { v4 as uuidv4 } from 'uuid';

const createRoomController = async (req, res) => {
  try {
    const { user_id1, user_id2 } = req.body;
    const room_id = uuidv4();
    const db = await mongod();
    await db.createCollection(`room_${room_id}`);
    await db.collection(`room_${room_id}`).insertOne({
      _id: room_id,
      user_id1,
      user_id2,
      createdAt: new Date(Date.now()).toLocaleString(),
      updatedAt: new Date(Date.now()).toLocaleString(),
      history: [],
    });
    return res.status(201).json({
      code: 201,
      message: 'Success create new chat room',
      data: [
        {
          room_id,
        },
      ],
    });
  } catch (err) {
    console.log(`Error room creation: ${err}`);
    return res.status(501).json({
      code: 501,
      message: 'Internal Server Error',
      data: [],
    });
  }
};

export default createRoomController;
