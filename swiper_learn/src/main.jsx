import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Slider from './Slider.jsx'
import UploadPost from './UploadPost.jsx'
import SwiperCards from './SwiperCards.jsx'
import FullWidthSlider from './FullWidthSider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FullWidthSlider/>
    {/* <Slider /> */}
    <UploadPost/>
    <SwiperCards/>
  </StrictMode>,
)
