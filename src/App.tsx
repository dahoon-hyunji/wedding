import { Cover } from "./component/cover"
import { Location } from "./component/location"
import "./App.scss"
import { BGEffect } from "./component/bgEffect"
import { Invitation } from "./component/invitation"
import { Calendar } from "./component/calendar"
import { Gallery } from "./component/gallery"
import { Information } from "./component/information"
import { LazyDiv } from "./component/lazyDiv"
import { ShareButton } from "./component/shareButton"
import { BGM } from "./component/bgm"

import { useState } from "react"

// 준비 중 페이지 활성화 여부. 작업 완료 후 false로 변경.
const UNDER_CONSTRUCTION = true

function App() {
  const [bypass, setBypass] = useState(false)

  if (UNDER_CONSTRUCTION && !bypass) {
    return (
      <div className="background">
        <BGEffect />
        <div className="under-construction">
          <div className="spinner" />
          <p>열심히 만들고 있어요</p>
          <button className="bypass" onClick={() => setBypass(true)} />
        </div>
      </div>
    )
  }

  return (
    <div className="background">
      <BGEffect />
      <BGM />
      <div className="card-view">
        <LazyDiv className="card-group">
          {/* 표지 */}
          <Cover />

          {/* 모시는 글 */}
          <Invitation />
        </LazyDiv>

        <LazyDiv className="card-group">
          {/* 결혼식 날짜 (달력) */}
          <Calendar />

          {/* 겔러리 */}
          <Gallery />
        </LazyDiv>

        <LazyDiv className="card-group">
          {/* 오시는길 */}
          <Location />
        </LazyDiv>

        <LazyDiv className="card-group">
          {/* 마음 전하기 */}
          <Information />
        </LazyDiv>

        <ShareButton />
      </div>
    </div>
  )
}

export default App
