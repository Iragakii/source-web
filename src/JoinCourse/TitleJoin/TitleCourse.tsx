import ShinyText from "../../components/ShinyText";

const TitleCourse = () => {
  return (
    <div className="w-full max-w-4xl mx-auto font-semibold px-4">
      <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
        <span className="bg-gradient-to-r from-[#E8FFD7] to-[#5E936C] bg-clip-text text-transparent text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-5xl leading-tight">
          ITechnology & CyberSecurity
        </span>
      </div>
      <div className="flex items-center justify-center">
        <ShinyText
          text="Symphony"
          disabled={false}
          speed={3}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl leading-tight text-center"
        />
      </div>
    </div>
  );
};

export default TitleCourse;
