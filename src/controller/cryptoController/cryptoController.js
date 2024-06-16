import { encryptAES, decryptAES } from '@utils/crypto.js';

const encryptController = async (req, res) => {
  if (!req.body.data)
    return res.status(400).json({
      code: 400,
      message: 'Needed Plain Text',
      data: [],
    });

  const encrypted = encryptAES(req.body.data);
  if (!encrypted || encrypted === '') {
    return res.status(501).json({
      code: 501,
      message: 'Internal Server Error',
      data: [],
    });
  }

  return res.status(200).json({
    code: 200,
    message: 'Encryption Success',
    data: [{ encrypted }],
  });
};

const decryptController = async (req, res) => {
  if (!req.body.data)
    return res.status(400).json({
      code: 400,
      message: 'Needed Chiper Text',
      data: [],
    });

  const decrypted = decryptAES(req.body.data);
  if (!decrypted) {
    return res.status(501).json({
      code: 501,
      message: 'Internal Server Error',
      data: [],
    });
  }

  return res.status(200).json({
    code: 200,
    message: 'Decryption Success',
    data: [{ decrypted }],
  });
};

export { encryptController, decryptController };
