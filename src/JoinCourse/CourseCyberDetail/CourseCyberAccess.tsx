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

const CourseCyberAccess: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());

  // Convert YouTube URLs to embeddable format
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('studio.youtube.com/video/')) {
      const videoId = url.split('studio.youtube.com/video/')[1].split('/')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Cybersecurity course data with the provided YouTube video URLs
  const getCyberCourseData = (courseNum: string): CourseData | null => {
    // Handle both "01" and "cyber-01" formats
    const cleanCourseNum = courseNum.replace('cyber-', '');
    const courses: { [key: string]: CourseData } = {
      "01": {
        id: "course-cyber-01",
        title: "Advanced Cybersecurity Fundamentals",
        description: "Master advanced cybersecurity concepts and practical defense strategies.",
        instructor: "Dr. Sarah Mitchell",
        lessons: [
          {
            id: "cyber-lesson-1",
            title: "Network Security Architecture",
            duration: "28:45",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=ooJSgsB5fIE&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=3"),
            description: "Deep dive into network security architecture and defense mechanisms.",
            isWatched: false
          },
          {
            id: "cyber-lesson-2",
            title: "Threat Intelligence & Analysis",
            duration: "32:20",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=eO8l70pdVhY&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=4"),
            description: "Understanding threat intelligence gathering and analysis techniques.",
            isWatched: false
          },
          {
            id: "cyber-lesson-3",
            title: "Penetration Testing Methodologies",
            duration: "35:15",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=uk8-jJgu8-I&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=5"),
            description: "Comprehensive guide to penetration testing methodologies and tools.",
            isWatched: false
          },
          {
            id: "cyber-lesson-4",
            title: "Incident Response & Forensics",
            duration: "29:30",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=KgtevibJlTE&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index="),
            description: "Learn incident response procedures and digital forensics techniques.",
            isWatched: false
          },
          {
            id: "cyber-lesson-5",
            title: "Advanced Malware Analysis",
            duration: "41:10",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=Sj4TD0LSC_k&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=9"),
            description: "Advanced techniques for malware analysis and reverse engineering.",
            isWatched: false
          },
          {
            id: "cyber-lesson-6",
            title: "Security Operations Center (SOC)",
            duration: "38:25",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=Dk-ZqQ-bfy4&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=10"),
            description: "Building and managing effective Security Operations Centers.",
            isWatched: false
          }
        ]
      },
      "02": {
        id: "course-cyber-02",
        title: "Ethical Hacking & Penetration Testing",
        description: "Learn ethical hacking techniques and penetration testing methodologies.",
        instructor: "Alex Rodriguez",
        lessons: [
          {
            id: "cyber-lesson-1",
            title: "Reconnaissance & Information Gathering",
            duration: "25:30",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=ooJSgsB5fIE&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=3"),
            description: "Master reconnaissance techniques for ethical hacking.",
            isWatched: false
          },
          {
            id: "cyber-lesson-2",
            title: "Vulnerability Assessment",
            duration: "30:15",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=eO8l70pdVhY&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=4"),
            description: "Comprehensive vulnerability assessment methodologies.",
            isWatched: false
          },
          {
            id: "cyber-lesson-3",
            title: "Web Application Security Testing",
            duration: "33:45",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=uk8-jJgu8-I&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=5"),
            description: "Advanced web application security testing techniques.",
            isWatched: false
          },
          {
            id: "cyber-lesson-4",
            title: "Network Penetration Testing",
            duration: "27:20",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=KgtevibJlTE&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index="),
            description: "Network penetration testing strategies and tools.",
            isWatched: false
          },
          {
            id: "cyber-lesson-5",
            title: "Social Engineering Techniques",
            duration: "24:50",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=Sj4TD0LSC_k&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=9"),
            description: "Understanding and defending against social engineering attacks.",
            isWatched: false
          },
          {
            id: "cyber-lesson-6",
            title: "Report Writing & Documentation",
            duration: "22:35",
            videoUrl: getEmbedUrl("https://www.youtube.com/watch?v=Dk-ZqQ-bfy4&list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_&index=10"),
            description: "Professional penetration testing report writing and documentation.",
            isWatched: false
          }
        ]
      }
    };

    return courses[cleanCourseNum] || courses["01"];
  };

  const courseData = getCyberCourseData(courseId || "01");

  useEffect(() => {
    // Load watched videos from localStorage
    const savedProgress = localStorage.getItem(`cyber-course-progress-${courseId}`);
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
      `cyber-course-progress-${courseId}`,
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
      <div className="!h-full relative">
        <GlitchBackground />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center bg-black/90 border-2 border-[#61b3dc] rounded-lg p-8 max-w-md mx-4">
            <h1 className="text-2xl font-mono text-[#61b3dc] mb-4">[ CYBER COURSE NOT FOUND ]</h1>
            <p className="text-[#61dca3] font-mono mb-6">The cybersecurity course you're looking for doesn't exist.</p>
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
        {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        
        {/* Course Title */}
        <div className="text-center  mb-8">
        
        <div className="flex items-center justify-center text-nowrap">  <p className="text-[#CDFAD5] !mb-3  font-bold bg-[#508D69]/70 w-80 rounded-full flex items-center justify-center">INSTRUCTOR: {courseData.instructor}</p></div>
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
            <h3 className="text-[#61dca3] font-mono text-xl mb-6 text-center">[ CYBERSECURITY COURSE CONTENT ]</h3>
            
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
                <span className="text-[#61b3dc] font-mono font-bold">CYBER COURSE PROGRESS</span>
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
                  <span className="text-[#61dca3] font-mono text-sm font-bold">🎉 CYBERSECURITY COURSE COMPLETED! 🎉</span>
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

export default CourseCyberAccess;
