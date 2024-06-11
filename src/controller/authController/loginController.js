import execQuery from '@services/db.js';
import bcrypt from 'bcrypt';
import { createTimestamp } from '@utils/dateFormat.js';
import { generateJwt } from '@utils/jwt.js';

const verifyPassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({
        code: 400,
        message: 'Username and password are required',
        data: [],
      });

    const query = 'SELECT * FROM mst_user WHERE username = ?';
    const params = [username];

    const result = await execQuery(query, params);

    if (result.length === 0)
      return res.status(404).json({
        code: 404,
        message: 'Username is not found',
        data: [],
      });

    const { user_id: uuid, username: user, email, phone_number: phoneNumber, password: pass } = result[0];

    const isPasswordMatch = await verifyPassword(password, pass);
    if (!isPasswordMatch)
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Invalid password',
        data: [],
      });

    const tok = await generateJwt(uuid);

    return res.status(200).json({
      code: 200,
      message: 'Login success',
      data: [
        {
          uuid,
          username: user,
          email,
          phoneNumber,
          tokenSession: tok,
          timestamp: createTimestamp(),
        },
      ],
    });
  } catch (err) {
    console.log('err login', err?.message);
    return res.status(501).json({
      code: 501,
      message: 'Internal server error',
      data: [],
    });
  }
};

export default loginController;
