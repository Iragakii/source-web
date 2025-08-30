import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  // courseId from URL will be like "01", "02", etc.
  const fullCourseId = `course-it-${courseId}`;

  // Mock course data - in a real app, this would come from an API
  const getCourseData = (id: string) => {
    const courses = {
      "course-it-01": {
        title: "Networking Essentials and Security",
        description: "Learn the fundamentals of networking and cybersecurity principles.",
        duration: "8 weeks",
        level: "Beginner",
        instructor: "John Smith",
        imageUrl: "https://i.pinimg.com/736x/63/1c/2d/631c2d5fc2599cff65f5144507dbce4e.jpg"
      },
      "course-it-02": {
        title: "Database Management with SQL & NoSQL",
        description: "Master database design, SQL queries, and NoSQL databases.",
        duration: "10 weeks",
        level: "Intermediate",
        instructor: "Sarah Johnson",
        imageUrl: "https://i.pinimg.com/1200x/c2/31/48/c2314893161f270e6b8dd30f9087bc43.jpg"
      },
      "course-it-03": {
        title: "Cloud Computing Fundamentals",
        description: "Explore cloud platforms, services, and deployment strategies.",
        duration: "6 weeks",
        level: "Beginner",
        instructor: "Mike Davis",
        imageUrl: "https://i.pinimg.com/736x/48/ea/05/48ea0549b3a0985c635993ebfc698e7b.jpg"
      },
      "course-it-04": {
        title: "Introduction to Cybersecurity",
        description: "Learn cybersecurity fundamentals and best practices.",
        duration: "12 weeks",
        level: "Beginner",
        instructor: "Emily Chen",
        imageUrl: "https://i.pinimg.com/1200x/f0/7e/dd/f07edd3cf298b545f147914272bf20eb.jpg"
      },
      "course-it-05": {
        title: "Foundations of Information Technology",
        description: "Build a solid foundation in IT concepts and practices.",
        duration: "8 weeks",
        level: "Beginner",
        instructor: "Robert Wilson",
        imageUrl: "https://i.pinimg.com/1200x/71/d8/1f/71d81fdc8ae26b173cf5635502a4c2f6.jpg"
      },
      "course-it-06": {
        title: "Programming for IT Professionals (Python & Java)",
        description: "Learn programming languages essential for IT professionals.",
        duration: "14 weeks",
        level: "Intermediate",
        instructor: "Lisa Anderson",
        imageUrl: "https://i.pinimg.com/736x/5f/00/1b/5f001b48f1d2fe417a882e851157d939.jpg"
      },
      "course-it-07": {
        title: "IT Systems Administration & Troubleshooting",
        description: "Master system administration and troubleshooting techniques.",
        duration: "10 weeks",
        level: "Advanced",
        instructor: "David Brown",
        imageUrl: "https://i.pinimg.com/736x/cb/37/ef/cb37eff129a1b7facf8b2c4db28326bd.jpg"
      },
      "course-it-08": {
        title: "Web Development & Deployment",
        description: "Learn modern web development and deployment strategies.",
        duration: "12 weeks",
        level: "Intermediate",
        instructor: "Jessica Taylor",
        imageUrl: "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg"
      },
      "course-it-09": {
        title: "IT Project Management with Agile & Scrum",
        description: "Master project management methodologies for IT projects.",
        duration: "8 weeks",
        level: "Intermediate",
        instructor: "Mark Thompson",
        imageUrl: "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg"
      },
      "course-it-10": {
        title: "Advanced Topics in IT Infrastructure",
        description: "Explore advanced concepts in IT infrastructure and architecture.",
        duration: "16 weeks",
        level: "Advanced",
        instructor: "Amanda White",
        imageUrl: "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg"
      }
    };

    return courses[id as keyof typeof courses];
  };

  const course = getCourseData(fullCourseId || "");

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
          <p className="text-gray-400 mb-8">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/join-course")}
            className="bg-[#93DA97] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#7BC47F] transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/join-course")}
          className="mb-6 flex items-center text-[#93DA97] hover:text-[#7BC47F] transition-colors"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Course Image */}
          <div className="relative">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-96 object-cover rounded-xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
          </div>

          {/* Course Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <i className="ri-time-line text-[#93DA97] mr-2"></i>
                  <span className="text-gray-400 text-sm">Duration</span>
                </div>
                <p className="text-white font-semibold">{course.duration}</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <i className="ri-bar-chart-line text-[#93DA97] mr-2"></i>
                  <span className="text-gray-400 text-sm">Level</span>
                </div>
                <p className="text-white font-semibold">{course.level}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <i className="ri-user-line text-[#93DA97] mr-2"></i>
                <span className="text-gray-400 text-sm">Instructor</span>
              </div>
              <p className="text-white font-semibold">{course.instructor}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate(`/course-it-${courseId}/access`)}
                className="bg-[#93DA97] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#7BC47F] transition-colors flex-1 flex items-center justify-center"
              >
                <i className="ri-play-circle-line mr-2"></i>
                Start Learning
              </button>
              <button className="border border-[#93DA97] text-[#93DA97] px-8 py-3 rounded-lg font-semibold hover:bg-[#93DA97] hover:text-black transition-colors flex-1">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Course Content Preview */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
          <div className="bg-gray-800/30 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-play-circle-line text-[#93DA97] mr-3"></i>
                  <span className="text-white">Introduction and Overview</span>
                </div>
                <span className="text-gray-400 text-sm">15 min</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-file-text-line text-[#93DA97] mr-3"></i>
                  <span className="text-white">Core Concepts</span>
                </div>
                <span className="text-gray-400 text-sm">45 min</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-code-line text-[#93DA97] mr-3"></i>
                  <span className="text-white">Practical Exercises</span>
                </div>
                <span className="text-gray-400 text-sm">2 hours</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-trophy-line text-[#93DA97] mr-3"></i>
                  <span className="text-white">Final Assessment</span>
                </div>
                <span className="text-gray-400 text-sm">30 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
