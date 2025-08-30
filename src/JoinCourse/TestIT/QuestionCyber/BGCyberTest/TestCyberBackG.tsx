import Squares from "../../Squares"
import CyberTest from "../CyberTest"




const TestCyberBackG = () => {
  return (
    <div className="relative h-full">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal' // up, down, left, right, diagonal
          borderColor='#1A1A1A'
          hoverFillColor='#1A1A1A'
        />
      </div>
      
      {/* Content Layer */}
      <div className="flex items-center justify-center">
        <CyberTest />
      </div>
    </div>
  )
}

export default TestCyberBackG
