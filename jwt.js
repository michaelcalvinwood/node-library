const jwt = require('jsonwebtoken');

let token = jwt.sign({
    user: user,
    email: email
}, process.env.SECRET_KEY, {expiresIn: '3h'});


function extractToken(info) {
    // if invalid return false
    if (!jwt.verify(info, process.env.SECRET_KEY)) return false;

    const token = jwt.decode(info);
    const curTime = new Date();

    // if expired return false
    if (token.exp < curTime.getTime()/1000) return false;

    return token;
}

