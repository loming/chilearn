const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../src/assets/sounds');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// WAV Header Helper
function createWavHeader(sampleRate, numChannels, bitsPerSample, dataLength) {
    const buffer = Buffer.alloc(44);

    // RIFF identifier
    buffer.write('RIFF', 0);
    // File length
    buffer.writeUInt32LE(36 + dataLength, 4);
    // WAVE identifier
    buffer.write('WAVE', 8);
    // fmt chunk identifier
    buffer.write('fmt ', 12);
    // Chunk length
    buffer.writeUInt32LE(16, 16);
    // Audio format (1 is PCM)
    buffer.writeUInt16LE(1, 20);
    // Number of channels
    buffer.writeUInt16LE(numChannels, 22);
    // Sample rate
    buffer.writeUInt32LE(sampleRate, 24);
    // Byte rate (SampleRate * NumChannels * BitsPerSample/8)
    buffer.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28);
    // Block align (NumChannels * BitsPerSample/8)
    buffer.writeUInt16LE(numChannels * bitsPerSample / 8, 32);
    // Bits per sample
    buffer.writeUInt16LE(bitsPerSample, 34);
    // Data chunk identifier
    buffer.write('data', 36);
    // Data length
    buffer.writeUInt32LE(dataLength, 40);

    return buffer;
}

// Oscillator functions
const sampleRate = 44100;

function generateSquareWave(freq, duration, volume = 0.5) {
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = Buffer.alloc(numSamples); // 8-bit unsigned
    const period = sampleRate / freq;

    for (let i = 0; i < numSamples; i++) {
        const phase = (i % period) / period;
        const value = phase < 0.5 ? 1 : -1;
        // Convert -1..1 to 0..255 (8-bit unsigned)
        const sample = Math.floor((value * volume + 1) * 127.5);
        buffer.writeUInt8(Math.min(255, Math.max(0, sample)), i);
    }
    return buffer;
}

function generateNoise(duration, volume = 0.5) {
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = Buffer.alloc(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const value = Math.random() * 2 - 1;
        const sample = Math.floor((value * volume + 1) * 127.5);
        buffer.writeUInt8(Math.min(255, Math.max(0, sample)), i);
    }
    return buffer;
}

function generateSawtooth(freq, duration, volume = 0.5) {
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = Buffer.alloc(numSamples);
    const period = sampleRate / freq;

    for (let i = 0; i < numSamples; i++) {
        const phase = (i % period) / period;
        const value = phase * 2 - 1; // -1 to 1
        const sample = Math.floor((value * volume + 1) * 127.5);
        buffer.writeUInt8(Math.min(255, Math.max(0, sample)), i);
    }
    return buffer;
}

function saveWav(filename, dataBuffer) {
    const header = createWavHeader(sampleRate, 1, 8, dataBuffer.length);
    const fileBuffer = Buffer.concat([header, dataBuffer]);
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), fileBuffer);
    console.log(`Generated ${filename}`);
}

// --- Generators ---

// 1. Click: Short high pitch square wave
const clickData = generateSquareWave(800, 0.05, 0.3);
saveWav('click.wav', clickData);

// 2. Correct: Arpeggio (C5, E5, G5)
const noteDuration = 0.1;
const c5 = generateSquareWave(523.25, noteDuration, 0.4);
const e5 = generateSquareWave(659.25, noteDuration, 0.4);
const g5 = generateSquareWave(783.99, noteDuration * 2, 0.4); // Longer last note
const correctData = Buffer.concat([c5, e5, g5]);
saveWav('correct.wav', correctData);

// 3. Wrong: Descending sawtooth
const wrongDuration = 0.3;
const wrongBuffer = Buffer.alloc(Math.floor(sampleRate * wrongDuration));
for (let i = 0; i < wrongBuffer.length; i++) {
    const progress = i / wrongBuffer.length;
    const freq = 200 * (1 - progress) + 50; // Slide down from 200Hz to 50Hz
    const period = sampleRate / freq;
    const phase = (i % period) / period;
    const value = phase * 2 - 1;
    const sample = Math.floor((value * 0.5 + 1) * 127.5);
    wrongBuffer.writeUInt8(Math.min(255, Math.max(0, sample)), i);
}
saveWav('wrong.wav', wrongBuffer);

// 4. BGM: Simple loop
// Melody: C4 E4 G4 E4 | D4 F4 A4 F4
const bpm = 120;
const beat = 60 / bpm;
const melodyNotes = [
    { f: 261.63, d: 0.5 }, { f: 329.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 329.63, d: 0.5 },
    { f: 293.66, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.5 }
];

const bgmParts = [];
for (let i = 0; i < 4; i++) { // Loop 4 times for a decent length sample
    melodyNotes.forEach(n => {
        bgmParts.push(generateSquareWave(n.f, n.d * beat, 0.15));
    });
}
const bgmData = Buffer.concat(bgmParts);
saveWav('bgm.wav', bgmData);
