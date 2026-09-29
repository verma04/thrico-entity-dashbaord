import math
import struct
import wave

SAMPLE_RATE = 44100
DURATION = 20.0
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)

# Initialize stereo buffers
left_channel = [0.0] * TOTAL_SAMPLES
right_channel = [0.0] * TOTAL_SAMPLES

def add_tone(freq, start_time, duration, volume, wave_type='sine', pan=0.0, attack=0.02, decay=0.05):
    start_sample = int(start_time * SAMPLE_RATE)
    num_samples = int(duration * SAMPLE_RATE)
    end_sample = min(TOTAL_SAMPLES, start_sample + num_samples)
    
    pan_l = math.cos((pan + 1.0) * math.pi / 4.0)
    pan_r = math.sin((pan + 1.0) * math.pi / 4.0)
    
    phase = 0.0
    phase_step = 2.0 * math.pi * freq / SAMPLE_RATE
    
    for i in range(start_sample, end_sample):
        t = (i - start_sample) / SAMPLE_RATE
        
        # Envelope
        if t < attack:
            env = t / attack
        elif t > duration - decay:
            env = max(0.0, (duration - t) / decay)
        else:
            env = 1.0
            
        if wave_type == 'sine':
            val = math.sin(phase)
        elif wave_type == 'saw':
            val = 2.0 * ((phase / (2.0 * math.pi)) % 1.0) - 1.0
        elif wave_type == 'triangle':
            p = (phase / (2.0 * math.pi)) % 1.0
            val = 4.0 * abs(p - 0.5) - 1.0
        elif wave_type == 'warm_saw':
            val = 0.6 * math.sin(phase) + 0.3 * math.sin(2 * phase) + 0.1 * math.sin(3 * phase)
        else:
            val = math.sin(phase)
            
        sample_val = val * env * volume
        left_channel[i] += sample_val * pan_l
        right_channel[i] += sample_val * pan_r
        
        phase += phase_step

def add_noise(start_time, duration, volume, pan=0.0, attack=0.05, decay=0.1):
    import random
    start_sample = int(start_time * SAMPLE_RATE)
    num_samples = int(duration * SAMPLE_RATE)
    end_sample = min(TOTAL_SAMPLES, start_sample + num_samples)
    
    pan_l = math.cos((pan + 1.0) * math.pi / 4.0)
    pan_r = math.sin((pan + 1.0) * math.pi / 4.0)
    
    for i in range(start_sample, end_sample):
        t = (i - start_sample) / SAMPLE_RATE
        if t < attack:
            env = t / attack
        elif t > duration - decay:
            env = max(0.0, (duration - t) / decay)
        else:
            env = 1.0
        val = (random.random() * 2.0 - 1.0) * env * volume
        left_channel[i] += val * pan_l
        right_channel[i] += val * pan_r

def add_kick(start_time, volume=0.7):
    start_sample = int(start_time * SAMPLE_RATE)
    duration = 0.25
    num_samples = int(duration * SAMPLE_RATE)
    end_sample = min(TOTAL_SAMPLES, start_sample + num_samples)
    
    phase = 0.0
    for i in range(start_sample, end_sample):
        t = (i - start_sample) / SAMPLE_RATE
        freq = 140.0 * math.exp(-t * 24.0) + 45.0
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        env = math.exp(-t * 14.0)
        val = math.sin(phase) * env * volume
        left_channel[i] += val
        right_channel[i] += val

def add_click(start_time, volume=0.15):
    start_sample = int(start_time * SAMPLE_RATE)
    duration = 0.03
    num_samples = int(duration * SAMPLE_RATE)
    end_sample = min(TOTAL_SAMPLES, start_sample + num_samples)
    for i in range(start_sample, end_sample):
        t = (i - start_sample) / SAMPLE_RATE
        env = math.exp(-t * 150.0)
        val = math.sin(2.0 * math.pi * 3200.0 * t) * env * volume
        left_channel[i] += val * 0.9
        right_channel[i] += val * 1.1

def add_chime(start_time, freqs=[523.25, 659.25, 783.99, 1046.50], volume=0.2):
    for idx, f in enumerate(freqs):
        t_offset = start_time + idx * 0.07
        add_tone(f, t_offset, 1.4, volume * (0.8 ** idx), wave_type='sine', pan=(idx % 2 * 0.4 - 0.2), attack=0.01, decay=0.8)

# --- Music Structure ---
# Key: C Minor (C, D, Eb, F, G, Ab, Bb)
# Chords: Cm (C3, Eb3, G3), Ab (Ab2, C3, Eb3), Fm (F2, Ab2, C3), Bb (Bb2, D3, F3)

# 1. Warm Ambient Pad (0.0 to 20.0s)
chord_progression = [
    (0.0, 3.0, [130.81, 155.56, 196.00]),  # Cm (C3, Eb3, G3)
    (3.0, 7.5, [130.81, 155.56, 196.00, 261.63]),  # Cm add 8
    (7.5, 12.0, [103.83, 130.81, 155.56, 207.65]), # Ab maj7
    (12.0, 16.5, [87.31, 103.83, 130.81, 174.61]),  # Fm7
    (16.5, 20.0, [130.81, 155.56, 196.00, 261.63])  # Final resolving Cm
]

for start, end, chord in chord_progression:
    dur = end - start
    for f in chord:
        add_tone(f, start, dur, 0.09, wave_type='warm_saw', attack=0.4, decay=0.6)
        add_tone(f * 2.0, start, dur, 0.04, wave_type='sine', attack=0.5, decay=0.7)

# 2. Bassline (3.0s to 19.5s)
bass_notes = [
    # Bar 2-4 (3.0 - 7.5s)
    (3.0, 0.4, 65.41), (3.5, 0.4, 65.41), (4.0, 0.4, 77.78), (4.5, 0.4, 65.41),
    (5.0, 0.4, 65.41), (5.5, 0.4, 87.31), (6.0, 0.4, 77.78), (6.5, 0.8, 65.41),
    # Bar 4-6 (7.5 - 12.0s)
    (7.5, 0.4, 51.91), (8.0, 0.4, 51.91), (8.5, 0.4, 65.41), (9.0, 0.4, 51.91),
    (9.5, 0.4, 58.27), (10.0, 0.4, 58.27), (10.5, 0.4, 65.41), (11.0, 0.8, 51.91),
    # Bar 6-8 (12.0 - 16.5s)
    (12.0, 0.4, 43.65), (12.5, 0.4, 43.65), (13.0, 0.4, 51.91), (13.5, 0.4, 58.27),
    (14.0, 0.4, 65.41), (14.5, 0.4, 77.78), (15.0, 0.4, 87.31), (15.5, 0.8, 65.41),
    # Outro hit (16.5s)
    (16.5, 3.0, 65.41)
]

for start, dur, freq in bass_notes:
    add_tone(freq, start, dur, 0.28, wave_type='triangle', attack=0.01, decay=0.08)
    add_tone(freq * 0.5, start, dur, 0.22, wave_type='sine', attack=0.01, decay=0.08)

# 3. Driving Arpeggiator (3.0s to 16.5s)
arp_pitches = [261.63, 311.13, 392.00, 523.25, 466.16, 392.00, 311.13, 261.63]
arp_step = 0.25 # 16th notes at 120bpm
t_arp = 3.0
pitch_idx = 0
while t_arp < 16.5:
    p = arp_pitches[pitch_idx % len(arp_pitches)]
    pan = ((pitch_idx % 4) - 1.5) * 0.3
    add_tone(p, t_arp, 0.20, 0.08, wave_type='sine', pan=pan, attack=0.01, decay=0.1)
    t_arp += arp_step
    pitch_idx += 1

# 4. Beat / Percussion (3.0s to 17.0s)
t_kick = 3.0
while t_kick < 16.5:
    add_kick(t_kick, volume=0.55)
    # Hi-hat / tick on off-beats
    add_click(t_kick + 0.25, volume=0.09)
    t_kick += 0.5

# 5. UI Interaction SFX
# Number rollup clicks
for t_c in [3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8]:
    add_click(t_c, volume=0.08)

# Card swoosh / whoosh
add_noise(2.8, 0.4, volume=0.12, attack=0.2, decay=0.1)
add_noise(7.3, 0.35, volume=0.12, attack=0.15, decay=0.1)
add_noise(11.8, 0.35, volume=0.12, attack=0.15, decay=0.1)
add_noise(16.3, 0.5, volume=0.15, attack=0.2, decay=0.25)

# Reward chime at Scene 4 achievement unlock
add_chime(13.2, freqs=[523.25, 659.25, 783.99, 1046.50, 1318.51], volume=0.22)

# Final Sub Impact at 16.5s
add_kick(16.5, volume=0.75)
add_tone(65.41, 16.5, 3.2, 0.35, wave_type='sine', attack=0.01, decay=1.5)

# --- Normalization & Master Limiting ---
max_val = 0.0
for i in range(TOTAL_SAMPLES):
    max_val = max(max_val, abs(left_channel[i]), abs(right_channel[i]))

gain = 0.90 / max(max_val, 1e-5)

# Fade out last 0.8 seconds
fade_start = int(19.2 * SAMPLE_RATE)
for i in range(fade_start, TOTAL_SAMPLES):
    fade_mult = (TOTAL_SAMPLES - i) / (TOTAL_SAMPLES - fade_start)
    left_channel[i] *= fade_mult
    right_channel[i] *= fade_mult

# Write WAV file
with wave.open('brag-output/work/soundtrack.wav', 'w') as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    
    frames = bytearray()
    for i in range(TOTAL_SAMPLES):
        l = max(-32767, min(32767, int(left_channel[i] * gain * 32767.0)))
        r = max(-32767, min(32767, int(right_channel[i] * gain * 32767.0)))
        frames.extend(struct.pack('<hh', l, r))
    wf.writeframes(frames)

print("Generated brag-output/work/soundtrack.wav successfully!")
