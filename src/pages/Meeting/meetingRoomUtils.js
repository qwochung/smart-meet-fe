export const initialMessages = [
  {
    id: 1,
    sender: "Hệ thống",
    time: new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    content:
      "Bạn đã vào phòng với vai trò chủ phòng. Chờ người tham gia tiếp theo.",
    isSelf: false,
  },
];

export const getRoomData = (response) => response?.data || response || {};

export const normalizeRoomParticipants = (roomData = {}, selfId = "") => {
  const source =
    roomData?.participants ||
    roomData?.members ||
    roomData?.attendees ||
    roomData?.users ||
    [];

  if (!Array.isArray(source)) return [];

  return source
    .map((participant, index) => {
      const id =
        participant?.id ||
        participant?.userId ||
        participant?.email ||
        `participant-${index}`;

      return {
        id,
        name: participant?.name,
        avatar: participant?.avatar,
        hasVideo: Boolean(participant?.hasVideo),
        isMuted: Boolean(participant?.isMuted),
      };
    })
    .filter((participant) => String(participant.id) !== String(selfId));
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
      gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
      gridAutoRows: "minmax(260px, 1fr)",
      gap: 10,
      width: "100%",
      height: "100%",
    };
  }

  if (participantCount <= 4) {
    return {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
      gridAutoRows: "minmax(220px, 1fr)",
      gap: 10,
      width: "100%",
      height: "100%",
    };
  }

  return {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
    gridAutoRows: "minmax(180px, 1fr)",
    gap: 10,
    width: "100%",
    height: "100%",
  };
};
