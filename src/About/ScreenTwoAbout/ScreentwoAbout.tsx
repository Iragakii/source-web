import smoke from "./smoke.gif";
import "./About.css";

const ScreentwoAbout = () => {
  return (
    <>
     <div className="smoke-container ">
       
        <div className="group flex !space-x-40">
          <img src={smoke} alt="smoke" className="smoke" />
         <div className="relative top-[280px]"> <div className="ty ">
            <div className="jc flex items-center justify-center bg-gradient-to-r from-[#CFFFE2] to-[#1C352D] bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl leading-tight">JC GROUP</div>
            <hr className="cigarette" />
          </div>
          <div className="intro">
            <span>
              {" "}
              • Tập đoàn JC Group , thành lập năm 2017 tại Hà Nội. <br></br>Đầu
              những năm 2017 tập trung đầu tư vào lĩnh vực IT và bán lẻ , BĐS{" "}
              <br></br>
              ITechnology , thú cưng với bốn thương hiệu chiến lược ban đầu là{" "}
              <br></br>DreamyLand , Ashura Cattery và JC SourceW , JC Group .{" "}
            </span>
            <h3 className="h3-1">
              • DreamyLand <br></br>
              Hoạt động với vai trò cung cấp cho thị trường ngành bán lẻ những
              sản phẩm Herb <br></br>tiêu chuẩn quốc tế . Doanh thu cuối những
              năm 2018 là 1 tỷ 8 trăm triệu đồng .
            </h3>
            <h3 className="h3-2">
              • Ashura Cattery <br></br>
              Ashura Cattery là một công ty chuyên về thú cưng . Với tiêu chuẩn
              quốc tế WCF <br></br> Sphynx là dòng mèo chủ lực của công ty .
              Doanh thu vào năm 2022 là 400 triệu .
            </h3>
            <h3 className="h3-3">
              • JC SourceW <br></br>
              JC SourceW cung cấp dịch source web cho doanh nghiệp , cá nhân & Đào
              tạo và giảng dạy <br></br> các khóa học về an ninh mạng cho sinh
              viên với các chứng chỉ như
              <br></br> CompTIA Security+ , CompTIA A+ , CEH , OSCP . Doanh thu
              2022 là 3 tỷ 200 triệu .
            </h3>
            <h3 className="h3-4">
              {" "}
              • Với mong muốn đem đến cho thị trường những sản phẩm - dịch vụ
              theo tiêu chuẩn quốc tế .
            </h3>
            <h3 className="h3-5">
              {" "}
              • Người thành lập tập đoàn JC Group iragaki , Co-Founder Sơn Hoàng
              .
            </h3>
          </div></div>
        </div>
      </div>
    </>
  )
}

export default ScreentwoAbout