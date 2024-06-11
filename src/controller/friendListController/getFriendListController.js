import execQuery from '@services/db.js';

const getFriendListController = async (req, res) => {
  try {
    const { uuid } = req.uuid;

    if (!uuid)
      return res.status(400).json({
        code: 400,
        message: 'UUID is required',
        data: [],
      });

    const query =
      'SELECT fl.friend_id, fl.status, u.username AS friend_username FROM mst_friendlist fl JOIN mst_user u ON fl.friend_id = u.user_id WHERE fl.user_id = ?';
    const params = [uuid];
    const result = await execQuery(query, params);
    console.log('result:', result);
    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: result,
    });
  } catch (e) {
    console.log(`Failed to get list friend: ${e}`);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      data: [],
    });
  }
};

export { getFriendListController };
