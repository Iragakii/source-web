import HeaderSetup from "../components/CpnHomePage/HeaderSetup"
import BackgroundJoin from "./BackgroundJoin"
import ButtonJoin from "./TitleJoin/ButtonJoin"
import TitleCourse from "./TitleJoin/TitleCourse"


const JoinCourse = () => {
  return (
    <>
       <div  className="min-h-screen">
        <div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] z-50"
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="bg-white/10 rounded-2xl border-1 border-gray-900"
            style={{ padding: "5px 16px" }}
          >
            <HeaderSetup />
          </div>
        </div>
        <section className='className="w-full h-full bg-black relative">'>
            
            <BackgroundJoin></BackgroundJoin>
                <div className="absolute top-1/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-8">
                  <div className="">
                     <TitleCourse />  
                  </div>
                  <div className="flex justify-center">
                    <ButtonJoin />
                  </div>
                </div>
        </section>
       </div>
    </>
  )
}

export default JoinCourse