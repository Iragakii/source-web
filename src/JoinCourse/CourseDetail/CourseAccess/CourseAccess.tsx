import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Glitch Background Component
const GlitchBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<
    {
      char: string;
      color: string;
      targetColor: string;
      colorProgress: number;
    }[]
  >([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(Date.now());

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;
  const glitchColors = ["#2b4539", "#61dca3", "#61b3dc"];
  const glitchSpeed = 80;

  const lettersAndSymbols = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "!", "@", "#", "$", "&", "*", "(", ")", "-", "_", "+", "=", "/",
    "[", "]", "{", "}", ";", ":", "<", ">", "", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9",
  ];

  const getRandomChar = () => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  };

  const getRandomColor = () => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  };

  const calculateGrid = (width: number, height: number) => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  };

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  };

  const drawLetters = () => {
    if (!context.current || letters.current.length === 0) return;
    const ctx = context.current;
    const { width, height } = canvasRef.current!.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const updateLetters = () => {
    if (!letters.current || letters.current.length === 0) return;

    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.003));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      if (!letters.current[index]) continue;

      letters.current[index].char = getRandomChar();
      letters.current[index].color = getRandomColor();
    }
  };

  const animate = () => {
    const now = Date.now();
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext("2d");
    resizeCanvas();
    animate();

    let resizeTimeout: number;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current as number);
        resizeCanvas();
        animate();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,1)_100%)]"></div>
    </div>
  );
};

interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  isWatched: boolean;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  lessons: VideoLesson[];
}

const CourseAccess: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());

  // Convert YouTube URLs to embeddable format
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('studio.youtube.com/video/')) {
      const videoId = url.split('studio.youtube.com/video/')[1].split('/')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Mock course data with the provided YouTube video URLs
  const getCourseData = (courseNum: string): CourseData | null => {
    // Handle both "01" and "it-01" formats
    const cleanCourseNum = courseNum.replace('it-', '');
    const courses: { [key: string]: CourseData } = {
      "01": {
        id: "course-it-01",
        title: "Networking Essentials and Security",
        description: "Learn the fundamentals of networking and cybersecurity principles.",
        instructor: "Iragaki",
        lessons: [
          {
            id: "lesson-1",
            title: "Introduction to Programming Concepts",
            duration: "15:30",
            videoUrl: getEmbedUrl("https://youtu.be/eJKxXVDH6LI"),
            description: "Learn the fundamental concepts of programming and software development.",
            isWatched: false
          },
          {
            id: "lesson-2",
            title: "Advanced Programming Techniques",
            duration: "22:45",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/oqHMwSsqrKQ/edit"),
            description: "Deep dive into advanced programming methodologies and best practices.",
            isWatched: false
          },
          {
            id: "lesson-3",
            title: "Database Integration & Management",
            duration: "18:20",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/yaFzsQa2pCE/edit"),
            description: "Understanding database integration and management in IT systems.",
            isWatched: false
          },
          {
            id: "lesson-4",
            title: "System Architecture & Design",
            duration: "25:10",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/tiwTvgl8mwU/edit"),
            description: "Learn system architecture principles and design patterns.",
            isWatched: false
          },
          {
            id: "lesson-5",
            title: "Security Implementation",
            duration: "20:15",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/qlJYoTa6LVw/edit"),
            description: "Implementing security measures in IT applications and systems.",
            isWatched: false
          },
          {
            id: "lesson-6",
            title: "Deployment & DevOps Practices",
            duration: "28:30",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/MyFu8qgL6O8/edit"),
            description: "Modern deployment strategies and DevOps implementation.",
            isWatched: false
          }
        ]
      },
      "02": {
        id: "course-it-02",
        title: "Database Management with SQL & NoSQL",
        description: "Master database design, SQL queries, and NoSQL databases.",
        instructor: "Iragaki",
        lessons: [
          {
            id: "lesson-1",
            title: "Database Design Fundamentals",
            duration: "20:30",
            videoUrl: getEmbedUrl("https://youtu.be/eJKxXVDH6LI"),
            description: "Learn the principles of good database design and normalization.",
            isWatched: false
          },
          {
            id: "lesson-2",
            title: "SQL Basics and Queries",
            duration: "25:45",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/oqHMwSsqrKQ/edit"),
            description: "Master basic SQL commands and query writing techniques.",
            isWatched: false
          },
          {
            id: "lesson-3",
            title: "Advanced SQL Operations",
            duration: "28:20",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/yaFzsQa2pCE/edit"),
            description: "Complex joins, subqueries, and advanced SQL operations.",
            isWatched: false
          },
          {
            id: "lesson-4",
            title: "Introduction to NoSQL",
            duration: "22:10",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/tiwTvgl8mwU/edit"),
            description: "Understanding NoSQL databases and when to use them.",
            isWatched: false
          },
          {
            id: "lesson-5",
            title: "Database Performance Optimization",
            duration: "26:15",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/qlJYoTa6LVw/edit"),
            description: "Techniques for optimizing database performance and indexing.",
            isWatched: false
          },
          {
            id: "lesson-6",
            title: "Database Security & Backup",
            duration: "24:40",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/MyFu8qgL6O8/edit"),
            description: "Implementing database security measures and backup strategies.",
            isWatched: false
          }
        ]
      },
      "03": {
        id: "course-it-03",
        title: "Cloud Computing Fundamentals",
        description: "Explore cloud platforms, services, and deployment strategies.",
        instructor: "Iragaki",
        lessons: [
          {
            id: "lesson-1",
            title: "Introduction to Cloud Computing",
            duration: "18:30",
            videoUrl: getEmbedUrl("https://youtu.be/eJKxXVDH6LI"),
            description: "Understanding cloud computing concepts and benefits.",
            isWatched: false
          },
          {
            id: "lesson-2",
            title: "Cloud Service Models",
            duration: "22:45",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/oqHMwSsqrKQ/edit"),
            description: "Learn about IaaS, PaaS, and SaaS service models.",
            isWatched: false
          },
          {
            id: "lesson-3",
            title: "Cloud Deployment Strategies",
            duration: "25:20",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/yaFzsQa2pCE/edit"),
            description: "Public, private, and hybrid cloud deployment models.",
            isWatched: false
          },
          {
            id: "lesson-4",
            title: "Cloud Security Best Practices",
            duration: "28:10",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/tiwTvgl8mwU/edit"),
            description: "Implementing security in cloud environments.",
            isWatched: false
          },
          {
            id: "lesson-5",
            title: "Cloud Migration Strategies",
            duration: "24:15",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/qlJYoTa6LVw/edit"),
            description: "Planning and executing cloud migration projects.",
            isWatched: false
          },
          {
            id: "lesson-6",
            title: "Cloud Cost Optimization",
            duration: "21:30",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/MyFu8qgL6O8/edit"),
            description: "Managing and optimizing cloud infrastructure costs.",
            isWatched: false
          }
        ]
      },
      "04": {
        id: "course-it-04",
        title: "Introduction to Cybersecurity",
        description: "Learn cybersecurity fundamentals and best practices.",
        instructor: "Iragaki",
        lessons: [
          {
            id: "lesson-1",
            title: "Cybersecurity Fundamentals",
            duration: "20:30",
            videoUrl: getEmbedUrl("https://youtu.be/eJKxXVDH6LI"),
            description: "Basic concepts and principles of cybersecurity.",
            isWatched: false
          },
          {
            id: "lesson-2",
            title: "Threat Landscape Analysis",
            duration: "25:45",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/oqHMwSsqrKQ/edit"),
            description: "Understanding current cybersecurity threats and risks.",
            isWatched: false
          },
          {
            id: "lesson-3",
            title: "Network Security Essentials",
            duration: "28:20",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/yaFzsQa2pCE/edit"),
            description: "Securing network infrastructure and communications.",
            isWatched: false
          },
          {
            id: "lesson-4",
            title: "Identity and Access Management",
            duration: "22:10",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/tiwTvgl8mwU/edit"),
            description: "Managing user identities and access controls.",
            isWatched: false
          },
          {
            id: "lesson-5",
            title: "Incident Response Planning",
            duration: "26:15",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/qlJYoTa6LVw/edit"),
            description: "Developing and implementing incident response procedures.",
            isWatched: false
          },
          {
            id: "lesson-6",
            title: "Security Awareness Training",
            duration: "19:40",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/MyFu8qgL6O8/edit"),
            description: "Building security awareness across organizations.",
            isWatched: false
          }
        ]
      },
      "05": {
        id: "course-it-05",
        title: "Foundations of Information Technology",
        description: "Build a solid foundation in IT concepts and practices.",
        instructor: "Iragaki",
        lessons: [
          {
            id: "lesson-1",
            title: "IT Fundamentals Overview",
            duration: "17:30",
            videoUrl: getEmbedUrl("https://youtu.be/eJKxXVDH6LI"),
            description: "Introduction to information technology concepts.",
            isWatched: false
          },
          {
            id: "lesson-2",
            title: "Computer Hardware Essentials",
            duration: "23:45",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/oqHMwSsqrKQ/edit"),
            description: "Understanding computer hardware components and architecture.",
            isWatched: false
          },
          {
            id: "lesson-3",
            title: "Operating Systems Fundamentals",
            duration: "26:20",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/yaFzsQa2pCE/edit"),
            description: "Core concepts of operating systems and their functions.",
            isWatched: false
          },
          {
            id: "lesson-4",
            title: "Networking Basics",
            duration: "24:10",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/tiwTvgl8mwU/edit"),
            description: "Introduction to computer networking and protocols.",
            isWatched: false
          },
          {
            id: "lesson-5",
            title: "Data Management Principles",
            duration: "21:15",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/qlJYoTa6LVw/edit"),
            description: "Understanding data storage, backup, and recovery.",
            isWatched: false
          },
          {
            id: "lesson-6",
            title: "IT Service Management",
            duration: "25:30",
            videoUrl: getEmbedUrl("https://studio.youtube.com/video/MyFu8qgL6O8/edit"),
            description: "ITIL framework and service management best practices.",
            isWatched: false
          }
        ]
      }
    };

    return courses[cleanCourseNum] || courses["01"];
  };

  const courseData = getCourseData(courseId || "01");

  useEffect(() => {
    // Load watched videos from localStorage
    const savedProgress = localStorage.getItem(`course-progress-${courseId}`);
    if (savedProgress) {
      setWatchedVideos(new Set(JSON.parse(savedProgress)));
    }
  }, [courseId]);

  const markVideoAsWatched = (lessonId: string) => {
    const newWatchedVideos = new Set(watchedVideos);
    newWatchedVideos.add(lessonId);
    setWatchedVideos(newWatchedVideos);
    
    // Save to localStorage
    localStorage.setItem(
      `course-progress-${courseId}`,
      JSON.stringify(Array.from(newWatchedVideos))
    );
  };

  const selectVideo = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const getCompletionPercentage = () => {
    if (!courseData) return 0;
    return Math.round((watchedVideos.size / courseData.lessons.length) * 100);
  };

  if (!courseData) {
    return (
      <div className="min-h-screen relative">
        <GlitchBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center bg-black/90 border-2 border-[#61b3dc] rounded-lg p-8 max-w-md mx-4">
            <h1 className="text-2xl font-mono text-[#61b3dc] mb-4">[ COURSE NOT FOUND ]</h1>
            <p className="text-[#61dca3] font-mono mb-6">The course you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/join-course")}
              className="bg-transparent border-2 border-[#61dca3] text-[#61dca3] font-mono py-2 px-6 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              [ ← BACK TO COURSES ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentLesson = courseData.lessons[currentVideoIndex];

  return (
    <div className="h-[110vh] relative">
      <GlitchBackground />
      
      {/* Header */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => navigate("/join-course")}
          className="bg-[#61dca3] border-2 border-[#61dca3] text-black font-mono py-2 px-4 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          [ ← BACK TO COURSES ]
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-black/90 border-2 border-[#61b3dc] rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <span className="text-[#61b3dc] font-mono text-sm">PROGRESS:</span>
            <span className="text-[#61dca3] font-mono font-bold">{getCompletionPercentage()}%</span>
            <div className="w-20 h-2 bg-[#2b4539] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#61dca3] to-[#61b3dc] transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        
        {/* Course Title */}
        <div className="text-center  mb-8">
        
        <div className="flex items-center justify-center">  <p className="text-[#CDFAD5] !mb-3  font-bold bg-[#508D69]/70 w-50 rounded-full flex items-center justify-center">INSTRUCTOR: {courseData.instructor}</p></div>
        </div>

        {/* Video Player - Centered */}
        <div className="w-full max-w-4xl mb-8">
          <div className="relative bg-black/90 border-2 border-[#61b3dc] rounded-lg overflow-hidden shadow-2xl shadow-[#61b3dc]/20">
            <div className="aspect-video">
              <iframe
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => {
                  setTimeout(() => {
                    markVideoAsWatched(currentLesson.id);
                  }, 2000);
                }}
              ></iframe>
            </div>
            
            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[#61dca3] font-mono text-lg font-bold">{currentLesson.title}</h2>
                  <p className="text-[#61b3dc] font-mono text-sm">{currentLesson.duration}</p>
                </div>
                {watchedVideos.has(currentLesson.id) && (
                  <div className="flex items-center text-[#61dca3] font-mono text-sm">
                    <span className="mr-2">✓</span>
                    <span>COMPLETED</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Glowing effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#61b3dc]/20 via-[#61dca3]/20 to-[#61b3dc]/20 rounded-lg blur opacity-30 animate-pulse pointer-events-none -z-10"></div>
          </div>

          {/* Video Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => selectVideo(Math.max(0, currentVideoIndex - 1))}
              disabled={currentVideoIndex === 0}
              className={`bg-[#3E0703] border-2 border-[#3E0703] text-black font-mono py-2 px-4 rounded transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                currentVideoIndex === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-[#61b3dc] hover:text-black'
              }`}
            >
              [ ← PREVIOUS ]
            </button>
            
            <div className="text-[#61dca3] font-mono">
              {String(currentVideoIndex + 1).padStart(2, '0')} / {String(courseData.lessons.length).padStart(2, '0')}
            </div>
            
            <button
              onClick={() => selectVideo(Math.min(courseData.lessons.length - 1, currentVideoIndex + 1))}
              disabled={currentVideoIndex === courseData.lessons.length - 1}
              className={`bg-[#3E0703] border-2 border-[#3E0703] text-black font-mono py-2 px-4 rounded transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                currentVideoIndex === courseData.lessons.length - 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-[#61b3dc] hover:text-black'
              }`}
            >
              [ NEXT → ]
            </button>
          </div>
        </div>

        {/* Course Content - Below Video */}
        <div className="w-full max-w-6xl">
          <div className="bg-black/90 border-2 border-[#61dca3] rounded-lg p-6 shadow-2xl shadow-[#61dca3]/20">
            <h3 className="text-[#61dca3] font-mono text-xl mb-6 text-center">[ COURSE CONTENT ]</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseData.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  onClick={() => selectVideo(index)}
                  className={`p-4 rounded border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    index === currentVideoIndex
                      ? 'border-[#61dca3] bg-[#61dca3]/10'
                      : 'border-[#2b4539] hover:border-[#61b3dc] bg-[#2b4539]/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[#61b3dc] font-mono text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex items-center">
                      {watchedVideos.has(lesson.id) ? (
                        <span className="text-[#61dca3] font-mono text-sm">✓</span>
                      ) : (
                        <span className="text-[#2b4539] font-mono text-sm">○</span>
                      )}
                    </div>
                  </div>
                  
                  <h4 className={`font-mono text-sm mb-2 ${
                    index === currentVideoIndex ? 'text-[#61dca3]' : 'text-[#61b3dc]'
                  }`}>
                    {lesson.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#2b4539] font-mono">{lesson.duration}</span>
                    {index === currentVideoIndex && (
                      <span className="text-[#61dca3] font-mono">▶ PLAYING</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Course Progress Summary */}
            <div className="mt-8 p-4 border-2 border-[#2b4539] rounded bg-[#2b4539]/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#61b3dc] font-mono font-bold">COURSE PROGRESS</span>
                <span className="text-[#61dca3] font-mono font-bold">{watchedVideos.size}/{courseData.lessons.length}</span>
              </div>
              <div className="w-full h-3 bg-[#2b4539] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#61dca3] to-[#61b3dc] transition-all duration-500"
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
              {getCompletionPercentage() === 100 && (
                <div className="mt-3 text-center">
                  <span className="text-[#61dca3] font-mono text-sm font-bold">🎉 COURSE COMPLETED! 🎉</span>
                </div>
              )}
            </div>
            
            {/* Glowing effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#61dca3]/20 via-[#61b3dc]/20 to-[#61dca3]/20 rounded-lg blur opacity-30 animate-pulse pointer-events-none -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAccess;
