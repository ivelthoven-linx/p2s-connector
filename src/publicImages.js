const fs = require("fs");
const tmp = require("tmp-promise");

const PUBLIC_FOLDER = "./public/";

exports.writeImage = (filename, data) => {
  // get's file extension
  const fileExt = "." + filename.split(".")[filename.split(".").length - 1];

  return new Promise((res, rej) => {
    tmp.file({ dir: PUBLIC_FOLDER, postfix: fileExt }).then(o => {
      const path = o.path;

      fs.write(o.fd, data, err => {
        if (err) {
          rej(err);
        }
        fs.close(o.fd, err => {
          if (err) {
            rej(err);
          }
          // Cleanup if file still exists after 30 seconds
          setTimeout(() => {
            fs.access(o.path, err => {
              if (!err) {
                o.cleanup();
                return;
              }
            });
          }, 10000);
          res([path.split("/")[path.split("/").length - 1], o]);
        });
      });
    });
  });
};
