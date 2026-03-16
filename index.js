import express from "express";
import QrCode from "qrcode";
import path from "path";
import { fileURLToPath } from "url";

let app = express();
const port = 2715;

let filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirname, "public", "index.html")));

app.get("/", (req, res) => {
  res.sendFile(path.join(dirname, "public", "index.html"));
});
app.post("/generate", (req, res) => {
  let { text } = req.body;
  QrCode.toDataURL(text).then((qrDataURL) => {
    res.send(`<html>
        <body style="text-align:center;font-family:sans-serif;">
          <h2>QR Code for: ${text}</h2>
          <img src="${qrDataURL}" style="animation: bounce 1s infinite;">
          <br><br>
          <a href="/">Generate Another</a>
          <style>
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
            img { width: 250px; height: 250px; }
          </style>
        </body>
      </html>`);
  });
});

app.listen(port, () => {
  console.log(`Port is Runnig On http://localhost:${port}`);
});
