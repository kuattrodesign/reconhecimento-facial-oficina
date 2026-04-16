const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { createClient } =
 require("@supabase/supabase-js");

const app = express();

app.use(cors());

app.use(express.static("public"));
app.use('/models', express.static('models'));

const supabase =
 createClient(
  "https://ytiknwpmpntetjvlpujl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aWtud3BtcG50ZXRqdmxwdWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDM2MDQsImV4cCI6MjA5MTkxOTYwNH0.oVEJ3DeaWFUeNYlnlK6GNlCWcPHqbF0MyiJBL7tMzaA"
 );

const storage =
 multer.memoryStorage();

const upload =
 multer({ storage });

app.post("/upload",
 upload.single("photo"),
 async (req, res) => {

  try {

    const emotion =
      req.body.emotion;

    const file =
      req.file;

    const fileName =
      Date.now() + ".jpg";

    // Upload para storage

    const { data, error } =
      await supabase.storage
        .from("student_photos")
        .upload(fileName,
          file.buffer,
          {
            contentType: "image/jpeg"
          });

    if (error)
      throw error;

    // Criar URL pública

    const { data: publicUrl } =
      supabase.storage
        .from("student_photos")
        .getPublicUrl(fileName);

    // Guardar na tabela
/*
    await supabase
      .from("students")
      .insert([{

        name: "unknown",
        emotion: emotion,
        photo_url:
          publicUrl.publicUrl

      }]);
*/
    const { error: insertError } = await supabase
    .from("students")
    .insert([{
        name: "unknown",
        emotion: emotion,
        photo_url: publicUrl.publicUrl
    }]);

    if (insertError) throw insertError;


    res.json({
      message: "Guardado com sucesso"
    });

  }
  catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.listen(3000, () => {

  console.log(
   "Servidor em http://localhost:3000"
  );

});