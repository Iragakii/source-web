
import CvBackG from './CvBackG'
import CustomShinyText from "../components/CustomShinyText"
import HeaderSetup from '../components/CpnHomePage/HeaderSetup'
import ScreentwoAbout from './ScreenTwoAbout/ScreentwoAbout'

const AboutUI = () => {
  return (
    <>
    <div className='bg-black/94'> <div className=''>
     <div className='absolute top-[430px] left-[550px]'>
        <CustomShinyText
          text="Click to Open MyCV"
          disabled={false}
          speed={3}
          className="text-4xl font-semibold"
        />
      </div>
        <div><CvBackG></CvBackG></div>
          <div
          className="fixed absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] z-50"
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="bg-black/30 rounded-2xl border-1 border-gray-900"
            style={{ padding: "5px 16px" }}
          >
            <HeaderSetup />
          </div>
        </div>
     </div>
      <div>
      <ScreentwoAbout></ScreentwoAbout>
      
      </div></div>
    </>
  )
}

export default AboutUI
