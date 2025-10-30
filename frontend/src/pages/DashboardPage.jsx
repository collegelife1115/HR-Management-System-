import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useUser } from "../context/UserContext";

// --- All Dashboard Imports ---
import DoughnutChart from "../components/DoughnutChart.jsx";
import ChatbotModal from "../components/ChatbotModal.jsx";
import TemplateModal from "../components/TemplateModal.jsx";
import VoiceInterviewModal from "../components/VoiceInterviewModal.jsx";
import { IconResume } from "../components/icons/IconResume.jsx";
import { IconSentiment } from "../components/icons/IconSentiment.jsx";
import { IconInsights } from "../components/icons/IconInsights.jsx";
import { IconChatbot } from "../components/icons/IconChatbot.jsx";
import { IconVoice } from "../components/icons/IconVoice.jsx";
import { IconTemplate } from "../components/icons/IconTemplate.jsx";
import { IconUsers } from "../components/icons/IconUsers.jsx"; // Assuming this exists for Admin
import { IconCurrency } from "../components/icons/IconCurrency.jsx"; // Assuming this exists
import { IconCheckSquare } from "../components/icons/IconCheckSquare.jsx";
import { IconUserCheck } from "../components/icons/IconUserCheck.jsx"; // Assuming this exists
import { IconBriefcase } from "../components/icons/IconBriefcase.jsx"; // Assuming this exists

// --- 1. ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPayroll: 0,
    presentToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [empRes, payrollRes, attendanceRes] = await Promise.all([
          axiosInstance.get("/employees"),
          axiosInstance.get("/payroll"),
          axiosInstance.get("/attendance"),
        ]);
        const totalPayroll = payrollRes.data.reduce(
          (acc, record) => acc + record.netSalary,
          0
        );
        const todayStr = new Date().toISOString().split("T")[0];
        const presentToday = attendanceRes.data.filter((record) => {
          const recordDate = new Date(record.date).toISOString().split("T")[0];
          return recordDate === todayStr && record.status === "Present";
        }).length;
        setStats({
          totalEmployees: empRes.data.length,
          totalPayroll: totalPayroll,
          presentToday: presentToday,
        });
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return <div className="p-6">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <IconUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Employees
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalEmployees}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <IconCheckSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Present Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.presentToday}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
              <IconCurrency className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Payroll (All Time)
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(stats.totalPayroll)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Admin Tools
        </h2>
        <p className="text-gray-600">
          User management, system settings, and other admin-specific components
          will go here.
        </p>
      </div>
    </div>
  );
};

// --- 2. HR DASHBOARD CONTENT (RESTORED) ---
const HRDashboardContent = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isScreenerLoading, setIsScreenerLoading] = useState(false);
  const [screenerError, setScreenerError] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [isSentimentLoading, setIsSentimentLoading] = useState(true);
  const [insightsData, setInsightsData] = useState([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateContent, setTemplateContent] = useState("");
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        setIsSentimentLoading(true);
        const response = await axiosInstance.get("/ai/sentiment");
        setSentimentData(response.data);
      } catch (err) {
        console.error("Failed to fetch sentiment:", err);
        setSentimentData({ positive: 0, neutral: 100, negative: 0 });
      } finally {
        setIsSentimentLoading(false);
      }
    };
    fetchSentiment();
  }, []);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsInsightsLoading(true);
        const response = await axiosInstance.get("/ai/dashboard-insights");
        setInsightsData(response.data.insights || []);
      } catch (err) {
        console.error("Failed to fetch insights:", err);
        setInsightsData(["Error loading insights."]);
      } finally {
        setIsInsightsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const handleFileChange = (e) => setResumeFile(e.target.files[0]);

  const handleRankCandidates = async () => {
    if (!resumeFile || !jobDescription) {
      setScreenerError("Please upload a resume and provide a job description.");
      return;
    }
    setScreenerError(null);
    setIsScreenerLoading(true);
    setAnalysisResult(null);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    try {
      const response = await axiosInstance.post("/ai/screen-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysisResult(response.data.analysis || "No analysis data received.");
    } catch (err) {
      console.error("Resume screening failed:", err);
      setScreenerError(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsScreenerLoading(false);
    }
  };

  const getInsightIcon = (index) => ["🚀", "⚠️", "📈", "💡"][index] || "•";

  const handleGenerateTemplate = async (prompt) => {
    try {
      setIsTemplateModalOpen(true);
      setIsTemplateLoading(true);
      setTemplateContent("");
      const response = await axiosInstance.post("/ai/generate-template", {
        prompt,
      });
      setTemplateContent(response.data.template || "No template generated.");
    } catch (err) {
      console.error("Failed to generate template:", err);
      setTemplateContent("Error: Could not generate the template.");
    } finally {
      setIsTemplateLoading(false);
    }
  };

  return (
    <>
      <ChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        content={templateContent}
        isLoading={isTemplateLoading}
      />
      <VoiceInterviewModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        jobDescription={jobDescription || "a general software developer role"}
      />

      {/* --- ALL HR WIDGET JSX IS NOW RESTORED --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Resume Screener (full-width) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <IconResume className="text-indigo-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">
              AI Resume Screener
            </h3>
          </div>
          <div className="mb-4">
            <label
              htmlFor="jobDesc"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Description
            </label>
            <textarea
              id="jobDesc"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <label
            htmlFor="resumeUpload"
            className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-indigo-400 block"
          >
            {resumeFile ? (
              <p className="text-green-600 font-medium">{resumeFile.name}</p>
            ) : (
              <>
                <p className="text-gray-500">Drag & Drop resume (PDF) here</p>
                <p className="text-sm text-gray-400 my-2">or</p>
                <span className="text-sm bg-gray-100 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 font-medium">
                  Browse File
                </span>
              </>
            )}
          </label>
          <input
            id="resumeUpload"
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="w-full mt-4 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              handleRankCandidates();
            }}
            disabled={isScreenerLoading}
          >
            {isScreenerLoading ? "Analyzing..." : "Rank Candidates"}
          </button>
          {screenerError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {screenerError}
            </div>
          )}
          {analysisResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto">
              <h4 className="text-md font-semibold text-gray-900 mb-2">
                Analysis Result:
              </h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {analysisResult}
              </pre>
            </div>
          )}
        </div>

        {/* Employee Sentiment */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <IconSentiment className="text-green-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">
              Employee Sentiment
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center min-h-[150px]">
            {isSentimentLoading ? (
              <p>Analyzing sentiment...</p>
            ) : (
              <DoughnutChart
                positive={sentimentData.positive}
                neutral={sentimentData.neutral}
                negative={sentimentData.negative}
              />
            )}
          </div>
        </div>

        {/* AI-Powered Insights */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <IconInsights className="text-blue-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">
              AI-Powered Insights
            </h3>
          </div>
          <div className="min-h-[150px]">
            {isInsightsLoading ? (
              <p>Generating insights...</p>
            ) : (
              <ul className="space-y-3 text-gray-700 text-sm">
                {insightsData.map((insight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-lg pt-0.5">
                      {getInsightIcon(index)}
                    </span>
                    <p>{insight}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* AI Candidate Chatbot */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <IconChatbot className="text-cyan-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">
              AI Candidate Chatbot
            </h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Engage candidates 24/7 with our AI pre-screening assistant.
          </p>
          <button
            className="w-full bg-cyan-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
            onClick={() => setIsChatbotOpen(true)}
          >
            Launch Chatbot
          </button>
        </div>

        {/* AI Voice Interviews */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <IconVoice className="text-purple-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">
              AI Voice Interviews
            </h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Conduct automated voice screens and get sentiment analysis.
          </p>
          <button
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            onClick={() => setIsVoiceModalOpen(true)}
          >
            Start Voice Screen
          </button>
        </div>

        {/* AI Template Generator */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <IconTemplate className="text-emerald-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">
              AI Template Generator
            </h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Save time by generating common HR documents instantly.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              className="flex-1 bg-emerald-50 text-emerald-700 py-2 px-3 rounded-lg font-medium hover:bg-emerald-100 transition-colors text-sm"
              onClick={() =>
                handleGenerateTemplate(
                  "Generate a professional job offer letter for a Software Engineer I."
                )
              }
            >
              Generate Offer Letter
            </button>
            <button
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
              onClick={() =>
                handleGenerateTemplate(
                  "Generate a polite rejection email for a job applicant."
                )
              }
            >
              Generate Rejection Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- 3. MANAGER DASHBOARD (Placeholder) ---
const ManagerDashboard = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold">Manager Dashboard</h2>
    <p>
      Manager-specific widgets for team performance and approvals will go here.
    </p>
  </div>
);

// --- 4. EMPLOYEE DASHBOARD COMPONENT ---
const EmployeeDashboard = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [latestPayslip, setLatestPayslip] = useState(null);
  const [latestReview, setLatestReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const [profileRes, payslipRes, reviewRes] = await Promise.all([
          axiosInstance.get("/employees/my-profile"),
          axiosInstance.get("/payroll/my-payslips"),
          axiosInstance.get("/performance/my-reviews"),
        ]);
        setProfile(profileRes.data);
        if (payslipRes.data.length > 0) {
          setLatestPayslip(payslipRes.data[payslipRes.data.length - 1]);
        }
        if (reviewRes.data.length > 0) {
          setLatestReview(reviewRes.data[reviewRes.data.length - 1]);
        }
      } catch (err) {
        console.error("Failed to fetch employee data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployeeData();
  }, []);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.09l6.572-.955L10 0l2.939 6.135 6.572.955-4.756 4.455 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading Your Dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome, {profile ? profile.firstName : user.name}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <IconUserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.fullName}
              </p>
              <p className="text-sm text-gray-500">{profile?.jobTitle}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <strong className="text-gray-600">Employee ID:</strong>{" "}
              {profile?.employeeId}
            </p>
            <p>
              <strong className="text-gray-600">Department:</strong>{" "}
              {profile?.department}
            </p>
            <p>
              <strong className="text-gray-600">Email:</strong> {profile?.email}
            </p>
          </div>
        </div>
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            My Latest Payslip
          </h3>
          {latestPayslip ? (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Pay Period</p>
                <p className="font-medium text-gray-800">
                  {formatDate(latestPayslip.periodStartDate)} -{" "}
                  {formatDate(latestPayslip.periodEndDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    latestPayslip.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {latestPayslip.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Net Salary</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(latestPayslip.netSalary)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No payroll records found.</p>
          )}
        </div>
        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            My Latest Performance Review
          </h3>
          {latestReview ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <StarRating rating={latestReview.rating} />
                <p className="text-sm text-gray-500">
                  {formatDate(latestReview.reviewDate)}
                </p>
              </div>
              <p className="text-gray-700 italic">"{latestReview.comments}"</p>
            </div>
          ) : (
            <p className="text-gray-500">No performance reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 5. MAIN DASHBOARDPAGE (The Switch) ---
const DashboardPage = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  // This switch now correctly routes to all 4 roles
  switch (user.role) {
    case "hr":
      return <HRDashboardContent />;
    case "admin":
      return <AdminDashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "employee":
      return <EmployeeDashboard />;
    default:
      return (
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Invalid User Role.
          </h2>
        </div>
      );
  }
};

export default DashboardPage;
