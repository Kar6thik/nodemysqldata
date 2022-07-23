exports.index = function (req, res) {
   message = '';
   if (req.method == "POST") {
      var post = req.body;
      if (!req.files)
         return res.status(400).send('No files were uploaded.');
      var file = req.files.uploaded_image;
      var img_name = file.name;
      if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" ||
         file.mimetype == "application/pdf" || file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {

         file.mv('public/images/upload_images/' + file.name, function (err) {

            if (err)
               return res.status(500).send(err);
            var sql = "INSERT INTO `users_image`(`image`) VALUES ('" + img_name + "')";
            var query = db.query(sql, function (err, result) {
               res.redirect('profile/' + result.insertId);
            });
         });
      } else {
         message = "This format is not allowed , please upload file with '.png','.gif','.jpg','.pdf','.docx'";
         res.render('index.ejs', { message: message });
      }
   } else {
      res.render('index');
   }
};

exports.profile = function (req, res) {
   var message = '';
   var id = req.params.id;
   var sql = "SELECT * FROM `users_image` WHERE `id`='" + id + "'";
   db.query(sql, function (err, result) {
      if (result.length <= 0)
         message = "Profile not found!";

      res.render('profile.ejs', { data: result, message: message });
   });
   

   const Downloader = require('nodejs-file-downloader');

(async () => {
  //Wrapping the code with an async function, just for the sake of example.

  const downloader = new Downloader({
    url: "http://localhost:4000/images/upload_images/", //If the file name already exists, a new file with the name 200MB1.zip is created.
    directory: "./downloads", //This folder will be created, if it doesn't exist.
  });
  try {
    await downloader.download(); //Downloader.download() returns a promise.

    console.log("All done");
  } catch (error) {
    //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    console.log("Download failed", error);
  }
})();
};