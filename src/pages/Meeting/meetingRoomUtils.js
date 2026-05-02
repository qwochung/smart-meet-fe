export const createInitialMessages = (isHost = false) => [
  {
    id: 1,
    sender: "Hệ thống",
    time: new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    content: isHost
      ? "Bạn đã vào phòng với vai trò chủ phòng. Chờ người tham gia tiếp theo."
      : "Bạn đã vào phòng với vai trò người tham gia. Đang kết nối với chủ phòng và các thành viên khác.",
    isSelf: false,
  },
];

export const getRoomData = (response) => response?.data || response || {};

const getParticipantKey = (participant, fallbackKey) =>
  participant?.id || participant?.userId || participant?.email || fallbackKey;

const getRoomHostKey = (roomData = {}) =>
  getParticipantKey(
    roomData?.hostUser || roomData?.host || roomData?.owner,
    roomData?.hostUser || roomData?.host || roomData?.owner,
  );

export const normalizeRoomParticipants = (roomData = {}, selfId = "") => {
  const hostKey = getRoomHostKey(roomData);
  const source = [
    roomData?.hostUser,
    roomData?.host,
    roomData?.owner,
    ...(roomData?.participants || roomData?.members || roomData?.attendees || roomData?.users || []),
  ].filter(Boolean);

  if (!Array.isArray(source)) return [];

  return source
    .map((participant, index) => {
      const id = getParticipantKey(participant, `participant-${index}`);

      return {
        id,
        email: participant?.email,
        name: participant?.name,
        avatar: participant?.avatar,
        hasVideo: Boolean(participant?.hasVideo),
        isMuted: Boolean(participant?.isMuted),
        isHost: String(id) === String(hostKey),
        order: index,
      };
    })
    .filter((participant, index, participants) => {
      const sameAsSelf = String(participant.id) === String(selfId);
      if (sameAsSelf) {
        return false;
      }

      return participants.findIndex((item) => String(item.id) === String(participant.id)) === index;
    })
    .sort((a, b) => {
      if (a.isHost !== b.isHost) {
        return a.isHost ? -1 : 1;
      }

      return a.order - b.order;
    })
    .map(({ order, ...participant }) => participant);
};

export const formatElapsedTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
};

export const getParticipantGridStyle = (participantCount) => {
  if (participantCount <= 1) {
    return {
      display: "grid",
      gridTemplateColumns: "minmax(420px, 960px)",
      gridTemplateRows: "minmax(320px, 1fr)",
      justifyContent: "center",
      alignContent: "center",
      gap: 10,
      width: "100%",
      height: "100%",
    };
  }

  if (participantCount === 2) {
    return {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gridAutoRows: "minmax(0, 1fr)",
      gap: 10,
      width: "100%",
      height: "100%",
    };
  }

  if (participantCount <= 4) {
    return {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gridAutoRows: "minmax(0, 1fr)",
      gap: 10,
      width: "100%",
      height: "100%",
    };
  }

  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gridAutoRows: "minmax(0, 1fr)",
    gap: 10,
    width: "100%",
    height: "100%",
  };
};
