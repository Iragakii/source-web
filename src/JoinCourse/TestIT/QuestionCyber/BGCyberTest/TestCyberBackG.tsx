import Squares from "../../Squares"
import CyberTest from "../CyberTest"




const TestCyberBackG = () => {
  return (
    <div className="relative h-100">
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
      <div className="absolute z-10 top-1/4 left-1/8">
        <CyberTest />
      </div>
    </div>
  )
}

export default TestCyberBackG
