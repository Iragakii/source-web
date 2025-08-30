import Masonry from "react-masonry-css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RowCardOne from "./RowCardOne";
import { courseService, type Course } from "../../../../services/courseService";

const MediaGridCyber = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utility function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses();
        
        if (response.success && response.data) {
          // Filter for CyberSecurity courses only (category: "Cyber")
          const cyberCourses = response.data.filter(course => 
            course.category === "Cyber" && course.isActive
          );
          setCourses(cyberCourses);
        } else {
          setError(response.message || "Failed to fetch courses");
        }
      } catch (err) {
        setError("Network error occurred while fetching courses");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full !px-10 flex justify-center items-center h-64">
        <div className="text-[#61dca3] font-mono text-lg">Loading courses...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full !px-10 flex justify-center items-center h-64">
        <div className="text-red-500 font-mono text-lg">Error: {error}</div>
      </div>
    );
  }

  // Show empty state
  if (courses.length === 0) {
    return (
      <div className="w-full !px-10 flex justify-center items-center h-64">
        <div className="text-[#61dca3] font-mono text-lg">No CyberSecurity courses available</div>
      </div>
    );
  }

  // Masonry breakpoints with 5 columns as default
  const breakpointColumnsObj = {
    default: 5,
    1600: 5,
    1400: 5,
    1200: 5,
    1000: 3,
    800: 3,
    600: 2,
    400: 1,
  };

  return (
    <div className="w-full !px-10">
      <div className="pb-5">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {courses.map((course, index) => {
            // Create height variation for masonry effect while keeping h-50 base
            const heightClasses = ["h-45", "h-40", "h-56", "h-50", "h-40"];
            const heightClass = heightClasses[index % heightClasses.length];

            // Extract course number from courseId (e.g., "course-cyber-01" -> "01")
            const courseNumber = course.courseId.replace('course-cyber-', '');
            
            return (
              <div key={course.id}>
                <RowCardOne
                  imageUrl={course.imageUrl}
                  videoId={course.videoId}
                  date={formatDate(course.createdAt)}
                  imageId={course.title}
                  isVideo={course.isVideo}
                  heightClass={heightClass}
                  onClick={() => {
                    console.log(`Navigating to: /course-cyber/${courseNumber}/access`);
                    navigate(`/course-cyber/${courseNumber}/access`);
                  }}
                />
              </div>
            );
          })}
        </Masonry>
      </div>
    </div>
  );
};

export default MediaGridCyber;
