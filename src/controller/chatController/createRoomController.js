import mongod from '@services/mongodb.js';
import { uuidv7obj } from 'uuidv7';
import execQuery from '@services/db.js';

const isRoomExist = async (userId1, userId2) => {
  try {
    const query = 'SELECT room_id FROM mst_chatlist WHERE user_id1 = ?';
    const datas = [
      [userId1, userId2],
      [userId2, userId1],
    ];
    let counter = 0;
    await Promise.all(
      datas.map(async data => {
        const res = await execQuery(query, data);
        if (res.length > 0) counter++;
      })
    );
    if (counter === 0) return 'notExist';
    return 'exist';
  } catch (err) {
    console.log('Err find', err);
    return 'error';
  }
};

const recordRoom = async (room_id1, room_id2, userId1, userId2) => {
  try {
    const isRoomAlreadyExist = await isRoomExist(userId1, userId2);

    if (isRoomAlreadyExist === 'exist') return 400;
    if (isRoomAlreadyExist === 'error') return 501;

    const timestamp = new Date(Date.now());

    const query =
      'INSERT INTO mst_chatlist (room_id, user_id1, user_id2, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
    const datas = [
      [room_id1, userId1, userId2, timestamp, timestamp],
      [room_id2, userId2, userId1, timestamp, timestamp],
    ];

    const queryResult = await Promise.all(
      datas.map(async data => {
        const result = await execQuery(query, data);
        if (result?.affectedRows === 1) return 1;
      })
    );

    return queryResult?.length !== datas.length ? 400 : 200;
  } catch (err) {
    console.log('err room chat:', err);
    return 501;
  }
};

const createRoomController = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    if (!userId1 || !userId2)
      return res.status(400).json({
        code: 400,
        message: 'Bad Request. Not enough user to start conversation.',
        data: [],
      });

    const room_id1 = uuidv7obj().toHex();
    const room_id2 = uuidv7obj().toHex();
    const recordResult = await recordRoom(room_id1, room_id2, userId1, userId2);

    if (recordResult === 400)
      return res.status(400).json({
        code: 400,
        message: 'Bad Request. Room Existed',
        data: [],
      });

    if (recordResult === 501)
      return res.status(501).json({
        code: 501,
        message: 'Internal Server Error',
        data: [],
      });

    const db = await mongod();
    await Promise.all(
      [room_id1, room_id2]?.map(async id => {
        await db.createCollection(`${id}`);
        await db.collection(`${id}`).insertOne({
          _id: id,
          createdAt: new Date(Date.now()).toLocaleString(),
          updatedAt: new Date(Date.now()).toLocaleString(),
          history: [],
        });
      })
    );

    return res.status(201).json({
      code: 201,
      message: 'Conversation room created successfully',
      data: [
        {
          room_id1,
          room_id2,
        },
      ],
    });
  } catch (err) {
    console.log(`Error create room: ${err}`);
    return res.status(501).json({
      code: 501,
      message: 'Internal Server Error',
      data: [],
    });
  }
};

export default createRoomController;
