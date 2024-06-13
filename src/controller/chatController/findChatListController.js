import mongod from '@services/mongodb.js';

const getChatListController = async (req, res) => {
  try {
    const { uuid } = req.body;
    const db = await mongod();
    const collections = await db.listCollections().toArray();
    const chat_rooms = [];

    for (const collectionInfo of collections) {
      if (!collectionInfo?.name?.includes('room')) continue;
      const collection = db.collection(collectionInfo.name);
      const document = await collection.find({}).toArray();
      if (document.length > 0 && document.user_id1 === uuid) {
        chat_rooms.push({
          room_id: collectionInfo.name,
          created_at: document[0].createdAt,
        });
      }
    }
    return res.status(200).json({
      code: 200,
      message: chat_rooms?.length > 0 ? 'Success get list rooms' : 'No Rooms Found',
      data: chat_rooms,
    });
  } catch (err) {
    console.log(`Error Get List Rooms:${err}`);
    return res.status(501).json({
      code: 501,
      message: 'Internal Server Error',
      data: [],
    });
  }
};

export default getChatListController;
