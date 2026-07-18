// BE nhận STOMP tại /app/ws/rooms/{roomId}/audio
// Payload: AudioChunkRequest (base64, không phải multipart)
// Kết quả về qua /topic/rooms/{roomId}/transcript

export const STOMP_DESTINATIONS = {
  sendAudio: (roomId) => `/app/ws/rooms/${roomId}/audio`,
  transcript: (roomId) => `/topic/rooms/${roomId}/transcript`,
  chunkAck: (roomId) => `/topic/rooms/${roomId}/chunk-ack`,
  draftTranscript: (roomId) => `/topic/rooms/${roomId}/transcript/draft`,
  mergedTranscript: (roomId) => `/topic/rooms/${roomId}/transcript/merged`,
};

// Khớp với AudioChunkRequest.java
export const buildAudioChunkPayload = ({
  roomId,
  participantId,
  participantName,
  chunkIndex,
  startTimeMs,
  endTimeMs,
  sampleRate = 16000,
  channels = 1,
  audioDataBase64,
  isForceCut = false,
}) => ({
  roomId,
  participantId, // String — dùng userId từ JWT
  participantName, // String — displayName
  chunkIndex,
  startTimeMs,
  endTimeMs,
  sampleRate,
  channels,
  audioDataBase64, // Base64 WAV — BE tự decode
  isForceCut, // Boolean — BE dùng để quyết định force finalize hay không
});

// Dedup overlap — giữ nguyên logic
const OVERLAP_WORD_MATCH = 4;

const tokenize = (text) =>
  text
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

export const deduplicateOverlap = (prevText, newText) => {
  if (!prevText || !newText) return newText || "";
  const prevTokens = tokenize(prevText);
  const newTokens = tokenize(newText);
  if (!prevTokens.length || !newTokens.length) return newText;

  const windowSize = Math.min(
    OVERLAP_WORD_MATCH,
    prevTokens.length,
    newTokens.length,
  );
  for (let overlapLen = windowSize; overlapLen >= 2; overlapLen--) {
    const prevSuffix = prevTokens.slice(-overlapLen).join(" ");
    const newPrefix = newTokens.slice(0, overlapLen).join(" ");
    if (prevSuffix === newPrefix) {
      const remaining = newTokens.slice(overlapLen);
      return remaining.length === 0 ? "" : remaining.join(" ");
    }
  }
  return newText;
};
