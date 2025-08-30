import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetailCyber: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  // courseId from URL will be like "01", "02", etc.
  const fullCourseId = `course-cyber-${courseId}`;

  // Mock cybersecurity course data
  const getCourseData = (id: string) => {
    const courses = {
      "course-cyber-01": {
        title: "Ethical Hacking Fundamentals",
        description: "Learn the principles of ethical hacking, penetration testing, and security assessment techniques.",
        duration: "12 weeks",
        level: "Intermediate",
        instructor: "Alex Morgan",
        imageUrl: "https://i.pinimg.com/736x/8b/5a/3c/8b5a3c9e4f2d1a8b7c6e9f0a1b2c3d4e.jpg"
      },
      "course-cyber-02": {
        title: "Network Security & Defense",
        description: "Master network security protocols, firewall configuration, and intrusion detection systems.",
        duration: "10 weeks",
        level: "Intermediate",
        instructor: "Sarah Chen",
        imageUrl: "https://i.pinimg.com/736x/9b/2c/7d/9b2c7d4c4b4e4e4e4e4e4e4e4e4e4e4e.jpg"
      },
      "course-cyber-03": {
        title: "Digital Forensics & Incident Response",
        description: "Learn digital evidence collection, forensic analysis, and incident response procedures.",
        duration: "14 weeks",
        level: "Advanced",
        instructor: "Mike Rodriguez",
        imageUrl: "https://i.pinimg.com/736x/7c/3a/8d/7c3a8d4c4b4e4e4e4e4e4e4e4e4e4e4e.jpg"
      },
      "course-cyber-04": {
        title: "Cryptography & Secure Communications",
        description: "Explore encryption algorithms, cryptographic protocols, and secure communication methods.",
        duration: "8 weeks",
        level: "Advanced",
        instructor: "Dr. Emily Watson",
        imageUrl: "https://i.pinimg.com/736x/6d/4a/9b/6d4a9b4c4b4e4e4e4e4e4e4e4e4e4e4e.jpg"
      },
      "course-cyber-05": {
        title: "Cloud Security & Architecture",
        description: "Secure cloud environments, implement security controls, and design resilient cloud architectures.",
        duration: "10 weeks",
        level: "Intermediate",
        instructor: "David Kim",
        imageUrl: "https://i.pinimg.com/736x/5e/8b/9c/5e8b9c4c4b4e4e4e4e4e4e4e4e4e4e4e.jpg"
      },
      "course-cyber-06": {
        title: "Web Application Security",
        description: "Identify and mitigate web application vulnerabilities, OWASP top 10, and secure coding practices.",
        duration: "8 weeks",
        level: "Intermediate",
        instructor: "Lisa Thompson",
        imageUrl: "https://i.pinimg.com/736x/4f/9c/2a/4f9c2a4c4b4e4e4e4e4e4e4e4e4e4e4e.jpg"
      },
      "course-cyber-07": {
        title: "Malware Analysis & Reverse Engineering",
        description: "Analyze malicious software, understand malware behavior, and develop countermeasures.",
        duration: "16 weeks",
        level: "Advanced",
        instructor: "Robert Johnson",
        imageUrl: "https://i.pinimg.com/736x/3a/7d/4e/3a7d4e4c4b4e4e4e4e4e4e4e4e4e4e4e.jpg"
      },
      "course-cyber-08": {
        title: "Security Operations Center (SOC) Fundamentals",
        description: "Learn SOC operations, threat monitoring, and security incident management.",
        duration: "6 weeks",
        level: "Beginner",
        instructor: "Jessica Lee",
        imageUrl: "https://i.pinimg.com/736x/2b/8c/9d/2b8c9d4c4b4e4e4e4e4e4e4e4e4e4e4e.jpg"
      },
      "course-cyber-09": {
        title: "IoT & Embedded Systems Security",
        description: "Secure Internet of Things devices, embedded systems, and industrial control systems.",
        duration: "12 weeks",
        level: "Advanced",
        instructor: "Mark Wilson",
        imageUrl: "https://i.pinimg.com/736x/1c/9a/4b/1c9a4b4c4b4e4e4e4e4e4e4e4e4e4e4e.jpg"
      },
      "course-cyber-10": {
        title: "Cybersecurity Leadership & Risk Management",
        description: "Develop cybersecurity strategies, manage risks, and lead security teams effectively.",
        duration: "8 weeks",
        level: "Advanced",
        instructor: "Amanda Davis",
        imageUrl: "https://i.pinimg.com/736x/0d/7a/8c/0d7a8c4c4b4e4e4e4e4e4e4e4e4e4e4e.jpg"
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
          <p className="text-gray-400 mb-8">The cybersecurity course you're looking for doesn't exist.</p>
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
                onClick={() => navigate(`/course-cyber/${courseId}/access`)}
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
                  <i className="ri-shield-check-line text-[#93DA97] mr-3"></i>
                  <span className="text-white">Security Fundamentals</span>
                </div>
                <span className="text-gray-400 text-sm">20 min</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-bug-line text-[#93DA97] mr-3"></i>
                  <span className="text-white">Vulnerability Assessment</span>
                </div>
                <span className="text-gray-400 text-sm">1 hour</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-terminal-line text-[#93DA97] mr-3"></i>
                  <span className="text-white">Practical Labs</span>
                </div>
                <span className="text-gray-400 text-sm">3 hours</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-alert-line text-[#93DA97] mr-3"></i>
                  <span className="text-white">Threat Analysis</span>
                </div>
                <span className="text-gray-400 text-sm">45 min</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-file-warning-line text-[#93DA97] mr-3"></i>
                  <span className="text-white">Incident Response</span>
                </div>
                <span className="text-gray-400 text-sm">1.5 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailCyber;
