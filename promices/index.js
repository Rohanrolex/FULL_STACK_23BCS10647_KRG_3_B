const thisPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("data fetched successfully");
  }, 2000);
});

thisPromise
  .then((msg) => {
    console.log(msg);
  })
  .catch((err) => {
    console.log(err);
  });
