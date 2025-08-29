import Masonry from "react-masonry-css";
import { useNavigate } from "react-router-dom";
import RowCardOne from "./RowCardOne";

const MediaGridCyber = () => {
  const navigate = useNavigate();
  // Utility function to generate random dates from current date
  const generateRandomDate = () => {
    const currentDate = new Date();
    const randomDays = Math.floor(Math.random() * 365) + 1; // Random days between 1-365
    const randomDate = new Date(
      currentDate.getTime() + randomDays * 24 * 60 * 60 * 1000
    );

    // Format as MM/DD/YYYY
    const month = String(randomDate.getMonth() + 1).padStart(2, "0");
    const day = String(randomDate.getDate()).padStart(2, "0");
    const year = randomDate.getFullYear();

    return `${month}/${day}/${year}`;
  };

  // Valid cybersecurity-related image URLs from reliable sources
  const mediaData = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      videoId: "CYB01",
      date: generateRandomDate(),
      imageId: "Advanced Cybersecurity Fundamentals",
      isVideo: true,
      courseId: "01",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
      videoId: "CYB02",
      date: generateRandomDate(),
      imageId: "Ethical Hacking & Penetration Testing",
      isVideo: false,
      courseId: "02",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop",
      videoId: "CYB03",
      date: generateRandomDate(),
      imageId: "Digital Forensics & Incident Response",
      isVideo: true,
      courseId: "03",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
      videoId: "CYB04",
      date: generateRandomDate(),
      imageId: "Network Security & Threat Analysis",
      isVideo: false,
      courseId: "04",
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/2e/c2/c7/2ec2c719887c58f8315137ba45ed76b0.jpg",
      videoId: "CYB05",
      date: generateRandomDate(),
      imageId: "Malware Analysis & Reverse Engineering",
      isVideo: true,
      courseId: "05",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
      videoId: "CYB06",
      date: generateRandomDate(),
      imageId: "Security Operations Center (SOC) Management",
      isVideo: false,
      courseId: "06",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
      videoId: "CYB07",
      date: generateRandomDate(),
      imageId: "Cloud Security & DevSecOps",
      isVideo: true,
      courseId: "07",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      videoId: "CYB08",
      date: generateRandomDate(),
      imageId: "Cryptography & Secure Communications",
      isVideo: false,
      courseId: "08",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop",
      videoId: "CYB09",
      date: generateRandomDate(),
      imageId: "Social Engineering & Human Factors",
      isVideo: false,
      courseId: "09",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      videoId: "CYB10",
      date: generateRandomDate(),
      imageId: "Cybersecurity Governance & Compliance",
      isVideo: false,
      courseId: "10",
    },
  ];

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
          {mediaData.map((media, index) => {
            // Create height variation for masonry effect while keeping h-50 base
            const heightClasses = ["h-45", "h-40", "h-56", "h-50", "h-40"];
            const heightClass = heightClasses[index % heightClasses.length];

            // Use explicit courseId from media data for consistent navigation
            const courseId = media.courseId;
            
            return (
              <div key={index}>
                <RowCardOne
                  imageUrl={media.imageUrl}
                  videoId={media.videoId}
                  date={media.date}
                  imageId={media.imageId}
                  isVideo={media.isVideo}
                  heightClass={heightClass}
                  onClick={() => {
                    console.log(`Navigating to: /course-cyber/${courseId}/access`);
                    navigate(`/course-cyber/${courseId}/access`);
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
