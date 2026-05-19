import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  File,
  FileImage,
  FileText,
  Loader2,
  Presentation,
  SkipForward,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { documentApi } from "../../api/documentApi";
import { roomSessionStorage } from "../../services/roomService";

/** Nền sáng + accent sky/blue */
const THEME = {
  pageBg: "#ffffff",
  pageGradient:
    "radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 42%), radial-gradient(circle at top right, rgba(14,165,233,0.06), transparent 38%), #ffffff",
  cardBg: "#ffffff",
  cardBorder: "#e2e8f0",
  innerCardBg: "#f8fafc",
  innerCardBorder: "#e2e8f0",
  rowBg: "#f1f5f9",
  rowBorder: "#e2e8f0",
  muted: "#64748b",
  mutedStrong: "#475569",
  text: "#0f172a",
  accent: "#3b82f6",
  accentBright: "#2563eb",
  accentSoft: "rgba(59,130,246,0.12)",
  accentBorder: "rgba(59,130,246,0.28)",
  accentText: "#1d4ed8",
  success: "#059669",
  danger: "#dc2626",
  aiBg: "rgba(14,165,233,0.08)",
  aiBorder: "rgba(14,165,233,0.28)",
  aiHeading: "#0369a1",
  overlay: "rgba(15,23,42,0.4)",
  footnote: "#94a3b8",
  skipBorder: "#e2e8f0",
  skipText: "#64748b",
  summaryCardBg: "#ffffff",
  summaryCardBorder: "#e2e8f0",
  summaryBody: "#334155",
};

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const EXTENSION_MIME_MAP = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
};

const ALLOWED_EXTENSIONS = Object.keys(EXTENSION_MIME_MAP);

const extractExtension = (fileName = "") =>
  String(fileName).split(".").pop()?.toLowerCase() || "";

const isAcceptedFile = (file) => {
  const ext = extractExtension(file?.name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return false;
  }

  if (!file?.type) {
    return true;
  }

  return file.type === EXTENSION_MIME_MAP[ext];
};

const getFileIcon = (file) => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (["ppt", "pptx"].includes(ext)) return Presentation;
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return FileImage;
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return FileText;
  return File;
};

const getFileColor = (file) => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (["ppt", "pptx"].includes(ext)) return "#38bdf8";
  if (["pdf"].includes(ext)) return "#60a5fa";
  if (["doc", "docx"].includes(ext)) return "#3b82f6";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "#22d3ee";
  return "#94a3b8";
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_FILES = 5;

const buildUploadSnapshot = (items, summaries) =>
  items.map((item) => ({
    id: item.id,
    name: item.file.name,
    size: item.file.size,
    type: item.file.type,
    status: item.status,
    summary: summaries[item.id] || "",
    documentId: item.documentId || null,
    fileUrl: item.fileUrl || "",
    uploadedBy: item.uploadedBy || null,
    description: item.description || "",
  }));

const mapDocumentToItem = (document) => {
  const ext = extractExtension(document?.originalFileName);
  return {
    id: `doc-${document.id}`,
    file: {
      name: document.originalFileName || `document-${document.id}`,
      size: Number(document.fileSize) || 0,
      type: EXTENSION_MIME_MAP[ext] || "application/octet-stream",
    },
    status: "done",
    preview: null,
    documentId: document.id,
    fileUrl: document.fileUrl || "",
    uploadedBy: document.uploadedBy ?? null,
    description: document.description || "",
    createdAt: document.createdAt || "",
    updatedAt: document.updatedAt || "",
  };
};

function FileRow({ item, onDownload, onRemove }) {
  const Icon = getFileIcon(item.file);
  const color = getFileColor(item.file);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 12,
        background: THEME.rowBg,
        border: `1px solid ${THEME.rowBorder}`,
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: THEME.text,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: 0,
          }}
        >
          {item.file.name}
        </p>
        <p
          style={{
            fontSize: 11,
            color: THEME.muted,
            margin: 0,
            marginTop: 2,
          }}
        >
          {formatBytes(item.file.size)}
        </p>
      </div>

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {item.status === "uploading" && (
          <Loader2
            size={16}
            color={THEME.accentBright}
            style={{ animation: "preMeetingSpin 1s linear infinite" }}
          />
        )}
        {item.status === "done" && (
          <CheckCircle2 size={16} color={THEME.success} />
        )}
        {item.status === "error" && (
          <AlertCircle size={16} color={THEME.danger} />
        )}

        {item.status !== "uploading" && (
          <button
            type="button"
            onClick={() => onDownload(item)}
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: "#dbeafe",
              color: "#1d4ed8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            title="Tải tài liệu"
          >
            <Download size={13} />
          </button>
        )}
        {item.status !== "uploading" && (
          <button
            type="button"
            onClick={() => onRemove(item)}
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: "#e2e8f0",
              color: "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            title="Xóa tài liệu"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

function DropZone({ onFiles, isDragging, setIsDragging }) {
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      onFiles(files);
    },
    [onFiles, setIsDragging],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    onFiles(files);
    e.target.value = "";
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragging ? "rgba(37,99,235,0.45)" : "#cbd5e1"
          }`,
        borderRadius: 16,
        padding: "28px 18px",
        textAlign: "center",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
        background: isDragging ? "rgba(59,130,246,0.08)" : "#ffffff",
        userSelect: "none",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: isDragging
            ? "rgba(59,130,246,0.15)"
            : "#f1f5f9",
          border: `1px solid ${isDragging ? "rgba(59,130,246,0.35)" : "#e2e8f0"
            }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
          transition: "all 0.2s",
        }}
      >
        <Upload
          size={22}
          color={isDragging ? THEME.accentBright : "#94a3b8"}
        />
      </div>

      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: isDragging ? THEME.accentText : "#334155",
          margin: "0 0 4px",
        }}
      >
        {isDragging ? "Thả file vào đây" : "Kéo thả hoặc nhấn để chọn file"}
      </p>
      <p
        style={{
          fontSize: 11.5,
          color: "#94a3b8",
          margin: 0,
        }}
      >
        PDF, Word, PowerPoint, TXT — tối đa {MAX_FILES} file, mỗi file ≤ 50 MB
      </p>
    </div>
  );
}

/**
 * @param {object} props
 * @param {(files: File[]) => void} [props.onContinue]
 * @param {() => void} [props.onSkip]
 * @param {string} [props.roomCode]
 * @param {string} [props.roomName]
 * @param {'fullscreen' | 'modal'} [props.variant]
 * @param {string | null} [props.dismissStorageKey] — nếu có, ghi localStorage khi tiếp tục / bỏ qua
 */
export default function PreMeetingUpload({
  onContinue,
  onSkip,
  roomCode,
  roomName,
  variant = "fullscreen",
  dismissStorageKey = null,
}) {
  const [items, setItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState("");
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiSummaries, setAiSummaries] = useState({});
  const [isFetchingDocs, setIsFetchingDocs] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const persistUploadSnapshot = useCallback(
    (nextItems = items, nextSummaries = aiSummaries) => {
      if (!roomCode) return;
      try {
        const currentSession = roomSessionStorage.get(roomCode) || { roomCode };
        roomSessionStorage.set({
          ...currentSession,
          roomCode,
          preMeetingUploads: buildUploadSnapshot(nextItems, nextSummaries),
        });
      } catch {
        /* ignore storage issues */
      }
    },
    [roomCode, items, aiSummaries],
  );

  useEffect(() => {
    persistUploadSnapshot();
  }, [persistUploadSnapshot]);

  const fetchDocuments = useCallback(async () => {
    if (!roomCode) return;
    setIsFetchingDocs(true);
    try {
      const response = await documentApi.getDocuments(roomCode);
      const docs = Array.isArray(response?.data) ? response.data : [];
      setItems(docs.map(mapDocumentToItem));
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách tài liệu.",
      );
    } finally {
      setIsFetchingDocs(false);
    }
  }, [roomCode]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const persistDismissal = useCallback(() => {
    if (!dismissStorageKey || typeof window === "undefined") return;
    try {
      localStorage.setItem(dismissStorageKey, "1");
    } catch {
      /* ignore quota */
    }
  }, [dismissStorageKey]);

  const addFiles = useCallback(
    async (rawFiles) => {
      if (!roomCode) {
        setActionError("Không tìm thấy mã phòng để upload tài liệu.");
        return;
      }

      setActionError("");
      setActionSuccess("");
      const existingCount = items.length;
      const remaining = MAX_FILES - existingCount;

      if (remaining <= 0) {
        setActionError(`Chỉ được upload tối đa ${MAX_FILES} tài liệu.`);
        return;
      }

      const valid = rawFiles
        .filter((f) => {
          if (f.size > MAX_FILE_SIZE) return false;
          if (!isAcceptedFile(f)) return false;
          if (items.some((i) => i.file.name === f.name && i.file.size === f.size))
            return false;
          return true;
        })
        .slice(0, remaining);

      if (!valid.length) {
        setActionError(
          "Không có file hợp lệ. Chỉ hỗ trợ pdf/doc/docx/txt/ppt/pptx và dung lượng phù hợp.",
        );
        return;
      }

      const tempItems = valid.map((file) => ({
        id: `uploading-${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        status: "uploading",
        preview: null,
      }));

      setItems((prev) => [...prev, ...tempItems]);

      try {
        await documentApi.uploadDocuments(roomCode, {
          files: valid,
          description: description.trim() || undefined,
        });
        await fetchDocuments();
        setActionSuccess("Upload tài liệu thành công.");
      } catch (error) {
        setItems((prev) => prev.filter((i) => !tempItems.some((t) => t.id === i.id)));
        setActionError(
          error?.response?.data?.message ||
            error?.message ||
            "Upload tài liệu thất bại.",
        );
      }
    },
    [description, fetchDocuments, items, roomCode],
  );

  const handleDownload = async (item) => {
    if (!roomCode || !item?.documentId) return;
    setActionError("");
    setActionSuccess("");

    try {
      const blob = await documentApi.downloadDocument(roomCode, item.documentId);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = item?.file?.name || "document";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải xuống tài liệu.",
      );
    }
  };

  const removeItem = async (item) => {
    setActionError("");
    setActionSuccess("");

    if (!roomCode || !item?.documentId) {
      setItems((prev) => prev.filter((i) => i.id !== item?.id));
      return;
    }

    try {
      await documentApi.deleteDocument(roomCode, item.documentId);
      await fetchDocuments();
      setActionSuccess("Đã xóa tài liệu.");
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể xóa tài liệu. Bạn có thể không có quyền xóa.",
      );
    }

    setAiSummaries((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
  };

  const handleAiSummarize = async () => {
    const doneItems = items.filter((i) => i.status === "done");
    if (!doneItems.length) return;
    setAiProcessing(true);

    await new Promise((r) => setTimeout(r, 1800));

    const mockSummaries = {
      pdf: "Tài liệu trình bày chiến lược sản phẩm Q2, bao gồm roadmap tính năng và các KPI cần đạt.",
      pptx:
        "Slide deck gồm 14 trang, nêu bật vấn đề thị trường, giải pháp đề xuất và kế hoạch triển khai 6 tháng.",
      docx: "Báo cáo phân tích kỹ thuật với 3 phương án kiến trúc, so sánh ưu nhược điểm và đề xuất lựa chọn tối ưu.",
      default:
        "Nội dung chính đã được trích xuất. Tài liệu sẵn sàng để chia sẻ với người tham dự.",
    };

    const summaries = {};
    doneItems.forEach((item) => {
      const ext = item.file.name.split(".").pop()?.toLowerCase();
      summaries[item.id] = mockSummaries[ext] || mockSummaries.default;
    });

    setAiSummaries(summaries);
    persistUploadSnapshot(items, summaries);
    setAiProcessing(false);
  };

  const allDone = items.length > 0 && items.every((i) => i.status === "done");
  const someUploading =
    isFetchingDocs || items.some((i) => i.status === "uploading");

  const handleContinue = () => {
    persistUploadSnapshot();
    persistDismissal();
    onContinue?.(items.map((i) => i.file));
  };

  const handleSkip = () => {
    persistUploadSnapshot();
    persistDismissal();
    onSkip?.();
  };

  const isModal = variant === "modal";

  const inner = (
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        maxHeight: isModal ? "min(90vh, 720px)" : undefined,
        overflowY: isModal ? "auto" : undefined,
        animation: "preMeetingFadeUp 0.35s ease",
        padding: isModal ? "4px 2px 8px" : undefined,
      }}
    >
      <div style={{ marginBottom: isModal ? 18 : 28, textAlign: "center" }}>
        {/* <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 14px",
            borderRadius: 999,
            background: THEME.accentSoft,
            border: `1px solid ${THEME.accentBorder}`,
            fontSize: 11.5,
            fontWeight: 600,
            color: THEME.accentText,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          <Sparkles size={12} />
          Tùy chọn
        </div> */}

        <h1
          id="pre-meeting-upload-title"
          style={{
            fontSize: isModal ? 22 : 26,
            fontWeight: 700,
            color: THEME.text,
            margin: "0 0 8px",
            lineHeight: 1.25,
          }}
        >
          Upload tài liệu trước cuộc họp
        </h1>

        <p
          style={{
            fontSize: 13.5,
            color: THEME.muted,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Bạn có thể chia sẻ tài liệu và xem tóm tắt gợi ý trước khi bắt đầu.
          {roomName && (
            <span style={{ color: THEME.mutedStrong }}>
              {" "}
              Phòng: <strong style={{ color: THEME.text }}>{roomName}</strong>
            </span>
          )}
          {roomCode && !roomName && (
            <span style={{ color: THEME.mutedStrong }}>
              {" "}
              Mã: <strong style={{ color: THEME.text }}>{roomCode}</strong>
            </span>
          )}
        </p>
      </div>

      <div
        style={{
          background: THEME.innerCardBg,
          border: `1px solid ${THEME.innerCardBorder}`,
          borderRadius: 20,
          padding: isModal ? 16 : 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <DropZone
          onFiles={addFiles}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />

        <div>
          <label
            htmlFor="pre-meeting-doc-description"
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: THEME.mutedStrong,
              marginBottom: 6,
            }}
          >
            Mô tả tài liệu (không bắt buộc)
          </label>
          <textarea
            id="pre-meeting-doc-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ví dụ: Meeting materials for Q2 review"
            rows={2}
            style={{
              width: "100%",
              borderRadius: 12,
              border: `1px solid ${THEME.innerCardBorder}`,
              background: "#ffffff",
              padding: "10px 12px",
              fontSize: 13,
              color: THEME.text,
              resize: "vertical",
              minHeight: 64,
              fontFamily: "inherit",
            }}
          />
        </div>

        {actionError && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(220,38,38,0.25)",
              background: "rgba(254,226,226,0.5)",
              color: "#b91c1c",
              fontSize: 12.5,
            }}
          >
            {actionError}
          </div>
        )}

        {actionSuccess && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(16,185,129,0.25)",
              background: "rgba(209,250,229,0.5)",
              color: "#047857",
              fontSize: 12.5,
            }}
          >
            {actionSuccess}
          </div>
        )}

        {items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 11.5,
                fontWeight: 600,
                color: "#94a3b8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                paddingInline: 2,
              }}
            >
              <span>
                {items.length}/{MAX_FILES} tệp
              </span>
              {someUploading && (
                <span
                  style={{
                    color: THEME.accentBright,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Loader2
                    size={11}
                    style={{ animation: "preMeetingSpin 1s linear infinite" }}
                  />
                  Đang tải lên...
                </span>
              )}
            </div>

            {items.map((item) => (
              <FileRow
                key={item.id}
                item={item}
                onDownload={handleDownload}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}

        {allDone && (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              background: THEME.aiBg,
              border: `1px solid ${THEME.aiBorder}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: THEME.aiHeading,
                    margin: "0 0 2px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Sparkles size={14} />
                  Tóm tắt nội dung (demo)
                </p>
                <p
                  style={{
                    fontSize: 11.5,
                    color: THEME.muted,
                    margin: 0,
                  }}
                >
                  Gợi ý nhanh trước cuộc họp — có thể nối API thật sau
                </p>
              </div>

              {Object.keys(aiSummaries).length === 0 ? (
                <button
                  type="button"
                  onClick={handleAiSummarize}
                  disabled={aiProcessing}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(14,165,233,0.35)",
                    background: "rgba(14,165,233,0.1)",
                    color: THEME.aiHeading,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: aiProcessing ? "not-allowed" : "pointer",
                    flexShrink: 0,
                    opacity: aiProcessing ? 0.7 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  {aiProcessing ? (
                    <>
                      <Loader2
                        size={13}
                        style={{ animation: "preMeetingSpin 1s linear infinite" }}
                      />
                      Đang phân tích...
                    </>
                  ) : (
                    <>
                      <Eye size={13} />
                      Tóm tắt file
                    </>
                  )}
                </button>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    fontWeight: 600,
                    color: THEME.success,
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={14} />
                  Đã tóm tắt
                </span>
              )}
            </div>

            {Object.keys(aiSummaries).length > 0 && (
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {items
                  .filter((item) => aiSummaries[item.id])
                  .map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: THEME.summaryCardBg,
                        border: `1px solid ${THEME.summaryCardBorder}`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: THEME.mutedStrong,
                          margin: "0 0 4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.file.name}
                      </p>
                      <p
                        style={{
                          fontSize: 12.5,
                          color: THEME.summaryBody,
                          margin: 0,
                          lineHeight: 1.55,
                        }}
                      >
                        {aiSummaries[item.id]}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 16,
          flexDirection: "column",
        }}
      >
        <button
          type="button"
          disabled={someUploading}
          onClick={handleContinue}
          style={{
            width: "100%",
            padding: "13px 24px",
            borderRadius: 14,
            border: "none",
            background: someUploading
              ? "rgba(59,130,246,0.45)"
              : "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            cursor: someUploading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "inherit",
            boxShadow: someUploading
              ? "none"
              : "0 4px 20px rgba(37,99,235,0.35)",
            transition: "opacity 0.15s",
          }}
        >
          {someUploading ? (
            <>
              <Loader2
                size={16}
                style={{ animation: "preMeetingSpin 1s linear infinite" }}
              />
              Đang tải lên tài liệu...
            </>
          ) : (
            <>
              Vào phòng họp
              <ChevronRight size={16} />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          style={{
            width: "100%",
            padding: "11px 24px",
            borderRadius: 14,
            border: `1px solid ${THEME.skipBorder}`,
            background: "#ffffff",
            color: THEME.skipText,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontFamily: "inherit",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#334155";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.color = THEME.skipText;
          }}
        >
          <SkipForward size={14} />
          Bỏ qua, vào họp ngay
        </button>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 11.5,
          color: THEME.footnote,
          marginTop: 14,
        }}
      >
        Tài liệu upload được mã hóa và tự động xóa sau khi cuộc họp kết thúc (theo
        chính sách hệ thống).
      </p>
    </div>
  );

  const keyframes = (
    <style>{`
      @keyframes preMeetingSpin { to { transform: rotate(360deg); } }
      @keyframes preMeetingFadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );

  if (isModal) {
    return (
      <>
        {keyframes}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pre-meeting-upload-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 14px",
            background: THEME.overlay,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 580,
              borderRadius: 22,
              padding: "22px 20px 20px",
              background: THEME.cardBg,
              border: `1px solid ${THEME.cardBorder}`,
              boxShadow:
                "0 24px 48px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.04)",
            }}
          >
            {inner}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {keyframes}
      <div
        style={{
          minHeight: "100vh",
          background: THEME.pageGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {inner}
      </div>
    </>
  );
}
