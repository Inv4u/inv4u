import fs from 'fs';
import path from 'path';

// Public path of the Hebrew AI-call demo recording.
// Drop the file at /public/audio/ai-demo.mp3 to activate the player on the homepage.
export const AI_DEMO_AUDIO_SRC = '/audio/ai-demo.mp3';

/**
 * Server-only. Returns true once the AI demo recording has been added to
 * /public/audio. Used to decide whether the audio player renders at all —
 * no file, no broken player.
 */
export function aiDemoAudioExists(): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', 'audio', 'ai-demo.mp3'));
  } catch {
    return false;
  }
}
