import express from "express";
import QrCode from "qrcode";
import path from "path";
import { fileURLToPath } from "url";

// Small express app to handle QR code generation
let app = express();
const port = 2715;

// These help us build file paths in an ES module
let filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(filename);

// Parse form data sent from the browser
app.use(express.urlencoded({ extended: true }));

// Serve the main HTML file from the public folder
app.use(express.static(path.join(dirname, "public", "index.html")));

// Show the form page
app.get("/", (req, res) => {
  res.sendFile(path.join(dirname, "public", "index.html"));
});

// Create a QR code from the text the user sends
app.post("/generate", (req, res) => {
  let { text } = req.body;
  QrCode.toDataURL(text).then((qrDataURL) => {
    res.send(`<html>
        <body style="text-align:center;font-family:sans-serif;">
          <h2>QR Code for: ${text}</h2>
          <img src="${qrDataURL}" style="animation: bounce 1s infinite;">
          <br><br>
          <!-- Simple button so the user can download the QR as an image -->
          <a href="${qrDataURL}" download="qrcode.png">Download QR Code</a>
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

// Start the server so we can visit it in the browser
app.listen(port, () => {
  console.log(`Port is Runnig On http://localhost:${port}`);
});
