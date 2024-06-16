import { v4 as uuidv4 } from 'uuid';
import execQuery from '@services/db.js';
import { reEmail, rePassword, reUsername } from '@utils/regex.js';
import { encryptAES } from '@utils/crypto.js';
import configs from '@utils/config.js';
import bcrypt from 'bcrypt';

const hashPassword = async password => {
  const saltRounds = Number(configs.saltRound);
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const emailValidate = email => {
  if (!email || email === '') return 'Email is required';
  const validateResult = reEmail.test(email);
  if (!validateResult) return 'Invalid email';
  return null;
};

const passValidate = pass => {
  if (!pass || pass === '') return 'Password is required';
  if (pass.length < 8) return 'Password must be at least 8 characters';
  const validateResult = rePassword.test(pass);
  if (!validateResult)
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  return null;
};

const phoneValidate = phone => {
  if (!phone || phone === '') return 'Phone number is required';
  if (phone.length < 8) return 'Phone number must be at least 8 characters';
  return null;
};

const usernameValidate = username => {
  if (!username || username === '') return 'Username is required';
  if (username.length < 8) return 'Username must be at least 8 characters';
  if (!reUsername.test(username)) return 'Username must only contain letters, numbers, and underscores';
  return null;
};

const validate = (username, email, password, phoneNumber) => {
  const usernameError = usernameValidate(username);
  const emailError = emailValidate(email);
  const phoneError = phoneValidate(phoneNumber);
  const passError = passValidate(password);

  if (usernameError) return usernameError;
  if (emailError) return emailError;
  if (phoneError) return phoneError;
  if (passError) return passError;
  return null;
};

const registerController = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;
    const validateMessage = validate(username, email, password, phoneNumber);

    if (validateMessage)
      return res.status(400).json({
        code: 400,
        message: validateMessage,
        data: [],
      });

    const newUserUuid = uuidv4();
    const timestamp = new Date(Date.now());
    const passHashed = await hashPassword(password);
    const encryptedEmail = encryptAES(email);
    const encryptedPhoneNumber = encryptAES(phoneNumber);

    const params = [newUserUuid, username, encryptedEmail, encryptedPhoneNumber, passHashed, timestamp, timestamp];
    const query =
      'INSERT INTO mst_user (user_id, username, email, phone_number, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';

    const result = await execQuery(query, params);
    if (result?.affectedRows !== 1)
      return res.status(501).json({
        code: 501,
        message: 'Internal Server Error',
        data: [],
      });

    return res.status(201).json({
      code: 201,
      message: 'User created successfully',
      data: [
        {
          uuid: newUserUuid,
        },
      ],
    });
  } catch (err) {
    console.log('err', err);
    if (err?.message?.includes('Duplicate entry') && err?.message?.includes('email'))
      return res.status(400).json({
        code: 400,
        message: 'Bad Request. Email already exists',
        data: [],
      });

    if (err?.message?.includes('Duplicate entry') && err?.message?.includes('username'))
      return res.status(400).json({
        code: 400,
        message: 'Bad Request. Username already exists',
        data: [],
      });

    if (err?.message?.includes('Duplicate entry') && err?.message?.includes('phone_number'))
      return res.status(400).json({
        code: 400,
        message: 'Bad Request. Phone number already exists',
        data: [],
      });

    return res.status(501).json({
      code: 501,
      message: 'Internal server error',
      data: [],
    });
  }
};

export default registerController;
