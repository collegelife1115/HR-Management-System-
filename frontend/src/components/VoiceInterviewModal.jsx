import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

// --- Icon Components ---
const IconClose = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconMic = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const IconStop = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="6" y="6" width="12" height="12" />
  </svg>
);
const IconPlay = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconUpload = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const VoiceInterviewModal = ({ isOpen, onClose, jobDescription }) => {
  const [status, setStatus] = useState("idle"); // idle, recording, recorded, loading, success
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setError(null);
    setAnalysis("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setStatus("recorded");
      };

      mediaRecorderRef.current.start();
      setStatus("recording");
    } catch (err) {
      console.error("Microphone access denied:", err);
      setError(
        "Microphone access denied. Please allow microphone permissions in your browser."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) return;

    setStatus("loading");
    setError(null);
    setAnalysis("");

    const formData = new FormData();
    formData.append("audio", audioBlob, "interview_response.webm");
    formData.append("jobDescription", jobDescription); // Add JD for context

    try {
      const response = await axiosInstance.post(
        "/ai/voice-interview",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAnalysis(response.data.analysis || "No analysis returned.");
      setStatus("success");
    } catch (err) {
      console.error("Failed to analyze audio:", err);
      setError(err.response?.data?.message || "Failed to analyze audio.");
      setStatus("recorded"); // Go back to recorded state
    }
  };

  const resetInterview = () => {
    setStatus("idle");
    setAudioBlob(null);
    setAudioUrl(null);
    setAnalysis("");
    setError(null);
  };

  // Clean up URL object
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg h-[80vh] m-4 rounded-lg shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">AI Voice Interview</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <IconClose />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}

          {status === "idle" && (
            <div className="text-center">
              <p className="mb-4">
                Click the button below to start recording your answer.
              </p>
              <button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full flex items-center mx-auto"
              >
                <IconMic className="w-5 h-5 mr-2" /> Start Recording
              </button>
            </div>
          )}

          {status === "recording" && (
            <div className="text-center">
              <p className="mb-4 text-indigo-600 animate-pulse">
                Recording... Click to stop.
              </p>
              <button
                onClick={stopRecording}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-full flex items-center mx-auto"
              >
                <IconStop className="w-5 h-5 mr-2" /> Stop Recording
              </button>
            </div>
          )}

          {status === "recorded" && (
            <div className="space-y-4">
              <p className="font-semibold">
                Recording complete. Review or upload.
              </p>
              <audio src={audioUrl} controls className="w-full" />
              <div className="flex space-x-2">
                <button
                  onClick={resetInterview}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                >
                  Record Again
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center"
                >
                  <IconUpload className="w-5 h-5 mr-2" /> Upload for Analysis
                </button>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="text-center">
              <p>Analyzing audio... This may take a moment.</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <p className="font-semibold text-green-600">Analysis Complete</p>
              <div className="p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {analysis}
                </pre>
              </div>
              <button
                onClick={resetInterview}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              >
                Start New Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInterviewModal;
