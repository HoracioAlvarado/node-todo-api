const SHA256 = require('crypto-js').SHA256;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, function (err, salt) {
//   bcrypt.hash(password, salt, function (err, hash) {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$32XeSydgXLyJQsqVkVqfJubfOy8ZOElDRKTJJ2DD09yj9kV6JTGPe';

bcrypt.compare(password, hashedPassword, function (err, res) {
  console.log(res);
})


// var data = {
//   id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log('decoded: ', decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log('message: ', message);
// console.log('hash: ' , hash);

// var data = {
//   id: 4
// };
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();


// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was change. Do not trust!');
// }