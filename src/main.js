const waitFor = seconds =>  {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
};

const main = async () => {
  for (let i = 0; i < 10; i++) {
    await waitFor(1);
    console.log(i);
  }
};

function* sync() {
  yield console.log('begin');
  yield console.log('before 2');
  yield waitFor(2);
  yield console.log('after 2');
  yield console.log('before 3');
  yield waitFor(3);
  yield console.log('after 3');
  yield console.log('----finish-----');
}

const exec = () => {
  const gen = sync();
  let isBreak = true;
  do {
    const { done, value } = gen.next();
    isBreak = done;
  } while (!isBreak);
}

exec();
