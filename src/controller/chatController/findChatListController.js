import mongod from '@services/mongodb.js';
import execQuery from '@services/db.js';

const getChatListController = async (req, res) => {
  try {
    const { uuid } = req?.uuid;
    if (!uuid)
      return res.status(400).json({
        code: 400,
        message: 'Bad Request. UUID is missing.',
        data: [],
      });

    const query =
      'SELECT cl.room_id, u.username FROM mst_chatlist cl INNER JOIN mst_user u ON cl.user_id2 = u.user_id WHERE cl.user_id1 = ?';
    const data = [uuid];
    const result = await execQuery(query, data);
    return res.status(200).json({
      code: 200,
      message: 'Success Get List',
      data: result,
    });
  } catch (err) {
    console.log(`Err Get Chat List:${err}`);
    return res.status(501).json({
      code: 501,
      message: 'Internal Server Error',
      data: [],
    });
  }
};

export default getChatListController;
