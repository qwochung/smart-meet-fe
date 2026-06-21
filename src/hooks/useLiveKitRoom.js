import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { playNotificationBeep } from '../utils/notificationSound';

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

  const screenSharePublication = publications.find(
    (p) =>
      p?.track?.kind === 'video'
      && String(p?.source || '').toLowerCase().includes('screen')
  );
  const cameraPublication = publications.find((p) => p.track?.kind === 'video');
  const videoTrack = screenSharePublication?.track || cameraPublication?.track;
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
    isScreenSharing: Boolean(
      participant?.isScreenShareEnabled
      || screenSharePublication?.isSubscribed
      || screenSharePublication?.track
    ),
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
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [raisedHands, setRaisedHands] = useState(new Set());
  const raisedHandsRef = useRef(new Set());
  const [roomAsrActive, setRoomAsrActive] = useState(false);
  const roomAsrActiveRef = useRef(false);
  const [chatMessages, setChatMessages] = useState([]);

  const syncParticipants = useCallback((activeRoom) => {
    if (!activeRoom) {
      setParticipants([]);
      setIsScreenSharing(false);
      return;
    }

    const snapshot = [
      buildParticipantSnapshot(activeRoom.localParticipant, true),
      ...Array.from(activeRoom.remoteParticipants.values()).map((participant) =>
        buildParticipantSnapshot(participant, false)
      ),
    ];

    setParticipants(snapshot);
    setIsScreenSharing(Boolean(activeRoom.localParticipant?.isScreenShareEnabled));
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

    activeRoom.on(RoomEvent.ParticipantConnected, (participant) => {
      syncParticipants(activeRoom);
      const myId = activeRoom.localParticipant.identity || activeRoom.localParticipant.sid;
      if (raisedHandsRef.current.has(myId) && participant.identity) {
        const payload = new TextEncoder().encode(JSON.stringify({ type: 'HAND_TOGGLE', state: true }));
        activeRoom.localParticipant.publishData(payload, { 
          reliable: true, 
          destinationIdentities: [participant.identity] 
        }).catch(() => {});
      }
      if (roomAsrActiveRef.current && participant.identity) {
        const payload = new TextEncoder().encode(JSON.stringify({ type: 'ASR_TOGGLE', state: true }));
        activeRoom.localParticipant.publishData(payload, {
          reliable: true,
          destinationIdentities: [participant.identity],
        }).catch(() => {});
      }
    });
    activeRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
      syncParticipants(activeRoom);
      const id = participant?.identity || participant?.sid;
      setRaisedHands((prev) => {
        const next = new Set(prev);
        next.delete(id);
        raisedHandsRef.current = next;
        return next;
      });
    });
    activeRoom.on(RoomEvent.TrackSubscribed, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.TrackUnsubscribed, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.TrackMuted, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.TrackUnmuted, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.LocalTrackPublished, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.LocalTrackUnpublished, () => syncParticipants(activeRoom));
    activeRoom.on(RoomEvent.Disconnected, () => {
      setConnectionState('disconnected');
      syncParticipants(null);
      setRaisedHands(new Set());
      raisedHandsRef.current = new Set();
      setRoomAsrActive(false);
      roomAsrActiveRef.current = false;
      setChatMessages([]);
    });

    activeRoom.on(RoomEvent.DataReceived, (payload, participant) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        if (data.type === 'HAND_TOGGLE') {
          const id = participant?.identity || participant?.sid;
          if (!id) return;
          
          if (data.state && !raisedHandsRef.current.has(id)) {
            playNotificationBeep("raise-hand");
          }

          setRaisedHands((prev) => {
            const next = new Set(prev);
            if (data.state) {
              next.add(id);
            } else {
              next.delete(id);
            }
            raisedHandsRef.current = next;
            return next;
          });
        }
        if (data.type === 'ASR_TOGGLE') {
          const nextActive = Boolean(data.state);
          roomAsrActiveRef.current = nextActive;
          setRoomAsrActive(nextActive);
        }
        if (data.type === 'CHAT_MESSAGE') {
          const { senderId, senderName, content, sentAt } = data;
          if (!content || sentAt == null) return;

          setChatMessages((prev) => {
            if (prev.some((m) => m.senderId === senderId && m.sentAt === sentAt)) {
              return prev;
            }
            return [...prev, { senderId, senderName, content, sentAt }];
          });
        }
      } catch (err) {
        // ignore
      }
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
    setRaisedHands(new Set());
    raisedHandsRef.current = new Set();
    setRoomAsrActive(false);
    roomAsrActiveRef.current = false;
    setChatMessages([]);
  }, []);

  const sendChatMessage = useCallback(async ({ senderId, senderName, content }) => {
    const activeRoom = roomRef.current;
    if (!activeRoom || !String(content || '').trim()) return null;

    const trimmed = String(content).trim();
    const sentAt = Date.now();
    const message = { senderId, senderName, content: trimmed, sentAt };

    setChatMessages((prev) => {
      if (prev.some((m) => m.senderId === senderId && m.sentAt === sentAt)) {
        return prev;
      }
      return [...prev, message];
    });

    try {
      const payload = new TextEncoder().encode(JSON.stringify({
        type: 'CHAT_MESSAGE',
        senderId,
        senderName,
        content: trimmed,
        sentAt,
      }));
      await activeRoom.localParticipant.publishData(payload, { reliable: true });
    } catch (err) {
      console.error('Failed to publish chat message', err);
    }

    return message;
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

  const toggleScreenShare = useCallback(async () => {
    const activeRoom = roomRef.current;

    if (!activeRoom) {
      return false;
    }

    const nextEnabled = !activeRoom.localParticipant.isScreenShareEnabled;
    await activeRoom.localParticipant.setScreenShareEnabled(nextEnabled);
    syncParticipants(activeRoom);
    return nextEnabled;
  }, [syncParticipants]);

  const broadcastAsrToggle = useCallback(async (state) => {
    const activeRoom = roomRef.current;
    if (!activeRoom) return false;

    const nextActive = Boolean(state);
    roomAsrActiveRef.current = nextActive;
    setRoomAsrActive(nextActive);

    try {
      const payload = new TextEncoder().encode(JSON.stringify({ type: 'ASR_TOGGLE', state: nextActive }));
      await activeRoom.localParticipant.publishData(payload, { reliable: true });
    } catch (err) {
      console.error('Failed to publish ASR toggle data', err);
    }

    return nextActive;
  }, []);

  const toggleRaiseHand = useCallback(async () => {
    const activeRoom = roomRef.current;
    if (!activeRoom) return false;

    const myId = activeRoom.localParticipant.identity || activeRoom.localParticipant.sid;
    const isRaised = !raisedHandsRef.current.has(myId);

    setRaisedHands((prev) => {
      const next = new Set(prev);
      if (isRaised) next.add(myId); else next.delete(myId);
      raisedHandsRef.current = next;
      return next;
    });

    try {
      const payload = new TextEncoder().encode(JSON.stringify({ type: 'HAND_TOGGLE', state: isRaised }));
      await activeRoom.localParticipant.publishData(payload, { reliable: true });
    } catch (err) {
      console.error('Failed to publish hand toggle data', err);
    }
    
    return isRaised;
  }, []);

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
      toggleScreenShare,
      isScreenSharing,
      raisedHands,
      toggleRaiseHand,
      roomAsrActive,
      broadcastAsrToggle,
      chatMessages,
      sendChatMessage,
      isConnected: connectionState === 'connected',
    }),
    [room, participants, connectionState, error, connect, disconnect, toggleMicrophone, toggleCamera, toggleScreenShare, isScreenSharing, raisedHands, toggleRaiseHand, roomAsrActive, broadcastAsrToggle, chatMessages, sendChatMessage]
  );
};