const jwt = require('jsonwebtoken');

let token = jwt.sign({
    user: user,
    email: email
}, process.env.SECRET_KEY, {expiresIn: '3h'});

if (!jwt.verify(info, process.env.SECRET_KEY)) return  res.status(403).json({ error: "Not Authorized." });
    
const token = jwt.decode(info);