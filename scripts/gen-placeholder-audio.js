/**
 * Generates short synthesized WAV placeholders for the click track and the
 * 4 tom hits, so the app makes sound out of the box before real SFX/art
 * lands. Replace assets/audio/*.wav with real recordings later — nothing
 * else in the code needs to change as long as filenames stay the same.
 *
 * Run: node scripts/gen-placeholder-audio.js
 */
const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;

function writeWav(filePath, samples) {
  const numSamples = samples.length;
  const blockAlign = 2; // 16-bit mono
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8, "ascii");
  buffer.write("fmt ", 12, "ascii");
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write("data", 36, "ascii");
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(samples[i] * 32767))), 44 + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
}

/** A short percussive-ish blip: sine tone with a fast exponential decay envelope. */
function makeBlip({ freq, durationMs, decay }) {
  const n = Math.floor((SAMPLE_RATE * durationMs) / 1000);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = Math.exp(-decay * t);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * envelope;
  }
  return samples;
}

const outDir = path.join(__dirname, "..", "assets", "audio");
fs.mkdirSync(outDir, { recursive: true });

// Click: short, bright, distinct from the toms.
writeWav(path.join(outDir, "click.wav"), makeBlip({ freq: 1800, durationMs: 40, decay: 60 }));

// Toms: low → high pitch as tom index increases, like a real kit.
const tomFreqs = { 1: 180, 2: 240, 3: 320, 4: 420 };
for (const [tom, freq] of Object.entries(tomFreqs)) {
  writeWav(path.join(outDir, `tom-${tom}.wav`), makeBlip({ freq, durationMs: 180, decay: 12 }));
}

console.log(`Wrote placeholder audio to ${outDir}`);
