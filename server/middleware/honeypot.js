// Forms carry a hidden "website" field that real users never see or fill in.
// A bot's autofill usually does. Respond exactly like a real success (201)
// without touching the DB, so the bot has no signal to adapt against.
const honeypot = (req, res, next) => {
  if (req.body?.website) {
    return res.status(201).json({ _id: 'ok' });
  }
  next();
};

module.exports = { honeypot };
