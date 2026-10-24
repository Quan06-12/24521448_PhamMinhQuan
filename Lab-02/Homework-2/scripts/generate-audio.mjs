import { mkdir, writeFile } from 'node:fs/promises';

// Original, deterministic PCM synthesis. No recordings or external assets.
const sampleRate = 22050;
const output = new URL('../assets/', import.meta.url);
const pieces = [
  { file: 'soft-current.wav', seconds: 12, root: 130.81, bpm: 80 },
  { file: 'after-hours.wav', seconds: 10, root: 146.83, bpm: 96 },
  { file: 'first-light.wav', seconds: 14, root: 164.81, bpm: 72 },
];

function synthesize({ seconds, root, bpm }) {
  const sampleCount = seconds * sampleRate;
  const wav = Buffer.alloc(44 + sampleCount * 2);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(sampleCount * 2, 40);
  const notes = [1, 1.25, 1.5, 2, 1.5, 1.25, 1.125, 1.5];
  for (let sample = 0; sample < sampleCount; sample += 1) {
    const time = sample / sampleRate;
    const beat = time * bpm / 60;
    const beatPhase = beat % 1;
    const note = root * notes[Math.floor(beat) % notes.length];
    const envelope = Math.min(1, time / 0.3, (seconds - time) / 0.7);
    const pad = Math.sin(time * Math.PI * 2 * root) * 0.12
      + Math.sin(time * Math.PI * 2 * root * 1.5) * 0.07;
    const bell = Math.sin(time * Math.PI * 2 * note * 2) * Math.exp(-beatPhase * 7) * 0.16;
    const kick = Math.sin(beatPhase * Math.PI * 2 * 55) * Math.exp(-beatPhase * 16) * 0.18;
    wav.writeInt16LE(Math.round((pad + bell + kick) * envelope * 32767), 44 + sample * 2);
  }
  return wav;
}

await mkdir(output, { recursive: true });
for (const piece of pieces) {
  await writeFile(new URL(piece.file, output), synthesize(piece));
  process.stdout.write(`Generated ${piece.file} (${piece.seconds}s, mono PCM)\n`);
}
