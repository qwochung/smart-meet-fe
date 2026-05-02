import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';

const buildParticipantStream = (participant) => {
  const stream = new MediaStream();
  const publications = Array.from(participant?.trackPublications?.values?.() || participant?.tracks?.values?.() || []);

  publications.forEach((publication) => {
    const track = publication?.track;

    if (!track || track.kind !== 'video' || !track.mediaStreamTrack) {
      return;
    }

    const alreadyAdded = stream.getVideoTracks().some((currentTrack) => currentTrack.id === track.mediaStreamTrack.id);

    if (!alreadyAdded) {
      stream.addTrack(track.mediaStreamTrack);
    }
  });

  return stream;
};

const buildParticipantSnapshot = (participant, isLocal = false) => {
  const stream = buildParticipantStream(participant);
  const publications = Array.from(participant?.trackPublications?.values?.() || participant?.tracks?.values?.() || []);
  
  const videoTrack = publications.find(p => p.track?.kind === 'video')?.track;
  const audioTrack = publications.find(p => p.track?.kind === 'audio')?.track;

  const fallbackId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id: participant?.identity || participant?.sid || participant?.name || fallbackId,
    name: participant?.name || participant?.identity || 'Participant',
    identity: participant?.identity || participant?.name || 'participant',
    isMuted: Boolean(participant?.isMicrophoneEnabled === false || participant?.isMuted || (audioTrack && audioTrack.isMuted)),
    hasVideo: Boolean(videoTrack && !videoTrack.isMuted) || stream.getVideoTracks().length > 0,
    active: Boolean(participant?.isSpeaking),
    self: isLocal,
    avatar: participant?.metadata || '',
    stream,
    videoTrack,
    audioTrack,
  };
};

export const useLiveKitRoom = () => {
  const roomRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [connectionState, setConnectionState] = useState('idle');
  const [error, setError] = useState(null);

  const syncParticipants = useCallback((activeRoom) => {
    if (!activeRoom) {
      setParticipants([]);
      return;
    }

    const snapshot = [
      buildParticipantSnapshot(activeRoom.localParticipant, true),
      ...Array.from(activeRoom.remoteParticipants.values()).map((participant) =>
        buildParticipantSnapshot(participant, false)
      ),
    ];

    setParticipants(snapshot);
  }, []);

  const connect = useCallback(async ({ url, token, autoAudio = true, autoVideo = true }) => {
    if (!url || !token) {
      throw new Error('LiveKit URL and token are required');
    }

    const activeRoom = roomRef.current || new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    roomRef.current = activeRoom;
    setRoom(activeRoom);
    setConnectionState('connecting');
    setError(null);

    activeRoom.on(RoomEvent.ParticipantConnected, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.ParticipantDisconnected, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.TrackSubscribed, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.TrackUnsubscribed, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.TrackMuted, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.TrackUnmuted, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.LocalTrackPublished, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.LocalTrackUnpublished, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.Disconnected, () => {
      setConnectionState('disconnected');
      syncParticipants(null);
    });

    try {
      await activeRoom.connect(url, token);

      if (autoAudio) {
        await activeRoom.localParticipant.setMicrophoneEnabled(true);
      }

      if (autoVideo) {
        await activeRoom.localParticipant.setCameraEnabled(true);
      }

      syncParticipants(activeRoom);
      setConnectionState('connected');
      return activeRoom;
    } catch (connectError) {
      setError(connectError);
      setConnectionState('error');
      throw connectError;
    }
  }, [syncParticipants]);

  const disconnect = useCallback(async () => {
    const activeRoom = roomRef.current;

    if (!activeRoom) {
      return;
    }

    await activeRoom.disconnect();
    roomRef.current = null;
    setRoom(null);
    setParticipants([]);
    setConnectionState('idle');
  }, []);

  const toggleMicrophone = useCallback(async () => {
    const activeRoom = roomRef.current;

    if (!activeRoom) {
      return false;
    }

    const nextEnabled = !activeRoom.localParticipant.isMicrophoneEnabled;
    await activeRoom.localParticipant.setMicrophoneEnabled(nextEnabled);
    syncParticipants(activeRoom);
    return nextEnabled;
  }, [syncParticipants]);

  const toggleCamera = useCallback(async () => {
    const activeRoom = roomRef.current;

    if (!activeRoom) {
      return false;
    }

    const nextEnabled = !activeRoom.localParticipant.isCameraEnabled;
    await activeRoom.localParticipant.setCameraEnabled(nextEnabled);
    syncParticipants(activeRoom);
    return nextEnabled;
  }, [syncParticipants]);

  useEffect(() => {
    return () => {
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
  }, []);

  return useMemo(
    () => ({
      room,
      participants,
      connectionState,
      error,
      connect,
      disconnect,
      toggleMicrophone,
      toggleCamera,
      isConnected: connectionState === 'connected',
    }),
    [room, participants, connectionState, error, connect, disconnect, toggleMicrophone, toggleCamera]
  );
};