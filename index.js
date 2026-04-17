import express from "express";
import cors from "cors";
import Replicate from "replicate";

const app = express();
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

app.get("/", (req, res) => {
  res.send("RapForge API running");
});

app.post("/generate-audio", async (req, res) => {
  try {
    const { lyrics, style, mood, energy, bpm, instrumental, voice } = req.body;

    if (!lyrics) {
      return res.status(400).json({
        success: false,
        message: "Lyrics are required"
      });
    }

    const prompt = `
French rap song
Style: ${style}
Mood: ${mood}
Energy: ${energy}
BPM: ${bpm}
Instrumental: ${instrumental}
Voice: ${voice}

Lyrics:
${lyrics}
`;

    const output = await replicate.run("minimax/music-2.6", {
      input: {
        prompt,
        lyrics
      }
    });

    const audioUrl = Array.isArray(output) ? output[0] : output;

    res.json({
      success: true,
      status: "ready",
      audio_url: audioUrl
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      status: "failed",
      message: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});
