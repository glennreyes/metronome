export const click = (audioContext: AudioContext) => {
  // Create an oscillator
  const oscillator = audioContext.createOscillator();

  oscillator.type = 'sine'; // 'sine' wave for a cleaner sound

  // Set oscillator frequency to a higher value for a sharper click
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // 1000 Hz for a sharper click

  // Create a gain node
  const gainNode = audioContext.createGain();

  // Connect oscillator to gain node and gain node to the destination (speakers)
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start the oscillator
  oscillator.start(audioContext.currentTime);

  // Set initial gain to ensure the click is audible but not too loud
  gainNode.gain.setValueAtTime(1, audioContext.currentTime);

  // Quickly ramp down the gain to create a 'click' sound
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.005,
  ); // faster decay

  // Stop the oscillator after the 'click' has been produced
  oscillator.stop(audioContext.currentTime + 0.01); // shorter duration
};
