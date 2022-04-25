// import express, { RequestHandler } from 'express';
function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, 1);
  });
}

// function createMid(val: string): RequestHandler {
//   return async function (req, res, next) {
//     console.log(val, 'started');
//     await resolveAfter2Seconds();
//     next();
//     console.log(val, 'ended');
//   };
// }

// const mids = [createMid('first'), createMid('second')];
// let pos = 0;
// const n = mids.length;
// let val = 'not done';
// async function* yieldFunc(): any {
//   if (pos < n) {
//     yield await mids[pos++](yieldFunc().next);
//   } else {
//     val = 'now done';
//   }
// }

// yieldFunc().next();
// console.log('val = ', val);

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', createMid('first'), createMid('second'), (req, res) => {
//   res.status(200).json({ message: 'success' });
// });

// app.listen(4000, () => {
//   console.log('listening on 4000');
// });

let done = false;
async function random() {
  let i = 0;
  while (i < 100) {
    await resolveAfter2Seconds();
    console.log(`async->${i++}`);
  }
  done = true;
}

function normal() {
  while (done == false) {
    console.log('waiting');
  }
}

random();
normal();
