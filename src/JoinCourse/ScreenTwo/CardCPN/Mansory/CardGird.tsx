import Masonry from "react-masonry-css";
import { useNavigate } from "react-router-dom";
import RowCardOne from "./RowCardOne";

const MediaGrid = () => {
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

  const mediaData = [
    {
      imageUrl:
        "https://i.pinimg.com/736x/63/1c/2d/631c2d5fc2599cff65f5144507dbce4e.jpg",
      videoId: "NET01",
      date: generateRandomDate(),
      imageId: "Networking Essentials and Security",
      isVideo: true,
      courseId: "01", // Explicit course ID mapping
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/c2/31/48/c2314893161f270e6b8dd30f9087bc43.jpg",
      videoId: "DAT02",
      date: generateRandomDate(),
      imageId: "Database Management with SQL & NoSQL",
      isVideo: false,
      courseId: "02",
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/48/ea/05/48ea0549b3a0985c635993ebfc698e7b.jpg",
      videoId: "CUL03",
      date: generateRandomDate(),
      imageId: "Cloud Computing Fundamentals",
      isVideo: true,
      courseId: "03",
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/f0/7e/dd/f07edd3cf298b545f147914272bf20eb.jpg",
      videoId: "IT04",
      date: generateRandomDate(),
      imageId: "Introduction to Cybersecurity",
      isVideo: false,
      courseId: "04",
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/71/d8/1f/71d81fdc8ae26b173cf5635502a4c2f6.jpg",
      videoId: "IT05",
      date: generateRandomDate(),
      imageId: "Foundations of Information Technology",
      isVideo: true,
      courseId: "05",
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/5f/00/1b/5f001b48f1d2fe417a882e851157d939.jpg",
      videoId: "PRO87",
      date: generateRandomDate(),
      imageId: "Programming for IT Professionals (Python & Java)",
      isVideo: false,
      courseId: "06",
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/cb/37/ef/cb37eff129a1b7facf8b2c4db28326bd.jpg",
      videoId: "SYS28",
      date: generateRandomDate(),
      imageId: "IT Systems Administration & Troubleshooting",
      isVideo: true,
      courseId: "07",
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg",
      videoId: "WEB39",
      date: generateRandomDate(),
      imageId: "Web Development & Deployment",
      isVideo: false,
      courseId: "08",
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg",
      videoId: "MAG88",
      date: generateRandomDate(),
      imageId: "IT Project Management with Agile & Scrum",
      isVideo: false,
      courseId: "09",
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg",
      videoId: "JCroup",
      date: generateRandomDate(),
      imageId: "Advanced Topics in IT Infrastructure",
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
                    console.log(`Navigating to: /course/it-${courseId}/access`);
                    navigate(`/course/it-${courseId}/access`);
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

export default MediaGrid;
