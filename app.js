const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");

app.get("/", (req, res) => res.type('html').send(html));

app.use(express.json());


// CORS: tighten origins for production; use '*' only when appropriate
const allowedOrigins = [
  "http://localhost:5500",           // your local page while testing
  "https://your-frontend-domain"     // if you host a real frontend later
];


app.use(cors({
  origin: (origin, cb) => {
    // allow tools (like curl/Postman) that omit origin
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
  credentials: false,
  maxAge: 600, // cache preflight for 10 minutes
}));

// Explicit preflight handler (ensures no redirect and proper headers)
app.options("/submit", (req, res) => {
  res.sendStatus(204);
});


const csvFilePath = path.join(__dirname, "data.csv");


if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, "field1,field2,field3,field4\n");
}


app.post("/submit", (req, res) => {
  const { field1, field2, field3, field4 } = req.body;

  // Validate input
  if (!field1 || !field2 || !field3 || !field4) {
    return res.status(400).json({ error: "All 4 fields are required" });
  }

  // Append to CSV
  const row = `${field1},${field2},${field3},${field4}\n`;
  fs.appendFile(csvFilePath, row, (err) => {
   if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to write to CSV" });
    }
    res.json({ message: "Data saved successfully" });
  });
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
