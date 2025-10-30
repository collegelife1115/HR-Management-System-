import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axiosInstance";

// --- 1. IMPORT THE NEW MODAL ---
import AddReviewModal from "../components/AddReviewModal.jsx";

// --- Icons ---
const IconPlus = (props) => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
// --- End Icons ---

const PerformancePage = () => {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. ADD STATE TO CONTROL THE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to format date strings
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/performance");
        setReviews(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch performance reviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // --- 3. FUNCTION TO UPDATE LIST AFTER ADDING ---
  const handleReviewAdded = (newReview) => {
    // Add the new review to the top of the list
    setReviews([newReview, ...reviews]);
  };

  // Helper to render star ratings
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

  return (
    <>
      {/* --- 4. RENDER THE MODAL --- */}
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewAdded={handleReviewAdded}
      />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Performance</h1>

          {/* --- 5. CONNECT THE BUTTON --- */}
          {(user.role === "admin" || user.role === "hr") && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              <IconPlus className="w-5 h-5 mr-2" />
              Add Review
            </button>
          )}
        </div>

        {/* --- Dynamic Performance Review Table --- */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading reviews...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No performance reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id}>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {/* Check if employee is populated */}
                      {review.employee ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {review.employee.firstName}{" "}
                            {review.employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.employee.jobTitle}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-red-500">
                          Employee not found
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <StarRating rating={review.rating} />
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700 max-w-sm whitespace-pre-wrap">
                        {review.comments}
                      </p>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(review.reviewDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PerformancePage;
