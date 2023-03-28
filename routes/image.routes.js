app.post("/do-something-with-photo", (req, res) => {
    const expectedSignature = cloudinary.utils.api_sign_request({ public_id: req.body.public_id, version: req.body.version }, cloudinaryConfig.api_secret)
  
    if (expectedSignature === req.body.signature) {
      fse.ensureFile("./data.txt")
        .then(() => {
          return fse.readFile("./data.txt", "utf8")
        })
        .then((existingData) => {
          return fse.outputFile("./data.txt", existingData + req.body.public_id + "\n")
        })
        .then(() => {
          res.send("Photo public ID saved successfully")
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error saving photo public ID")
        });
    } else {
      res.status(400).send("Invalid signature")
    }
  })
  
  app.get("/get-signature", (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp
      },
      cloudinaryConfig.api_secret
    )
    res.json({ timestamp, signature })
  })

  app.get("/view-photos", async (req, res) => {
    await fse.ensureFile("./data.txt")
    const existingData = await fse.readFile("./data.txt", "utf8")
    res.send(`<h1>Hello, here are a few photos...</h1>
    <ul>
    ${existingData
      .split("\n")
      .filter(item => item)
      .map(id => {
        return `<li><img src="https://res.cloudinary.com/${cloudinaryConfig.cloud_name}/image/upload/w_200,h_100,c_fill,q_100/${id}.jpg">
        <form action="delete-photo" method="POST">
          <input type="hidden" name="id" value="${id}" />
          <button>Delete</button>
        </form>
        </li>
        `
      })
      .join("")}
    </ul>
    <p><a href="/">Back to homepage</a></p>
    `)
  })
  
  app.post("/delete-photo", async (req, res) => {
    // do whatever you need to do in your database etc...
    await fse.ensureFile("./data.txt")
    const existingData = await fse.readFile("./data.txt", "utf8")
    await fse.outputFile(
      "./data.txt",
      existingData
        .split("\n")
        .filter(id => id != req.body.id)
        .join("\n")
    )
  
    // actually delete the photo from cloudinary
    cloudinary.uploader.destroy(req.body.id)
  
    res.redirect("/view-photos")
  })
  