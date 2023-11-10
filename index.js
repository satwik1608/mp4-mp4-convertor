const express = require("express");
const upload = require("express-fileupload");
const ffmpeg = require("fluent-ffmpeg");
const cors = require("cors");
const port = process.env.PORT || 5500;
const host = "0.0.0.0";
const app = express();
app.use(cors());
// Middleware config for upload
app.use(
  upload({
    useTempFiles: true,
    tempFileDir: "./filestore/",
  })
);

// // Middleware config for ffmpeg
ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");
// ffmpeg.setFfmpegPath("/app/vendor/ffmpeg/bin");

//Landing Route {TYPE - GET}
app.get("/", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

// UPLOAD AND CONVERT Route {TYPE - POST}
app.post("/mp4tomp3", (req, res) => {
  res.contentType("video/mp4");
  res.attachment("output.mp3");

  //UPLOADED FILE
  console.log("I am here", req.files);
  req.files.mp4.mv("./filestore/" + req.files.mp4.name, (err) => {
    if (err) console.log(err);
    console.log("File uploaded");
  });

  //CONVERSION

  ffmpeg("./filestore/" + req.files.mp4.name)
    .toFormat("mp3")
    .on("end", () => console.log("Conversion Done !"))
    .on("error", (err) => console.log(err))
    .pipe(res, { end: true });
});
app.listen(port, host, () => console.log(`Server is running at port ${port}`));
