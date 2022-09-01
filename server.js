require("dotenv").config({ path: "./configs/.env" });
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_KEY}`);

// image recognition model
// let model_id = "general-image-recognition";

// face detection model
let model_id = "face-detection";

stub.PostModelOutputs(
  {
    model_id,
    inputs: [
      {
        data: {
          image: {
            url: "https://s3.amazonaws.com/samples.clarifai.com/featured-models/general-shirts-bags-shoes-computer.jpg",
          },
        },
      },
    ],
  },
  metadata,
  (err, response) => {
    if (err) {
      console.log("Error: " + err);
      return;
    } else if (response.status.code !== 10000) {
      console.log(
        err,
        "Received failed status: " +
          response.status.description +
          "\n" +
          response.status.details
      );
      return;
    }
    if (model_id == "general-image-recognition") {
      // for image recognition api
      console.log(response.outputs[0].data.concepts);
    } else if (model_id == "face-detection") {
      // for face detection api
      const results = [];
      response.outputs[0].data.regions.forEach((r) =>
        results.push(r.data.concepts)
      );
      console.log(
        `Predicted concepts, with confidence values: \n total ${results.length} people in image`
      );
    }
  }
);
