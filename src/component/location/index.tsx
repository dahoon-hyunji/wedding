import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"

export const Location = () => {
  return (
    <>
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>
      <LazyDiv className="card location">
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">대중교통</div>
          <div />
          <div className="content">
            * 지하철 이용시
            <br />
            - 경의중앙선,공항철도 <b>공덕역 10번출구</b>
            <br />
            - 5호선,6호선 <b>공덕역 7번출구</b>
            <br />
          </div>
          <div />
          <div className="content">
            * 버스 이용 시
            <br />
            - 간선(파랑): 160, 260, 600
            <br />
            - 지선(초록): 7013A, 7013B, 7611
            <br />
            - 마을버스: 마포01, 마포02, 마포10
            <br />
          </div>
        </div>
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <CarIcon className="transportation-icon" />
          </div>
          <div className="heading">자가용</div>
          <div />
          <div className="content">
            네이버 지도, 카카오 네비, 티맵 등 이용
            <br />
            <b>공덕역 10번 출구</b> 검색
            <br />
            - 주차 요금은 2시간 무료입니다.
            <br />
            (효성해링턴스퀘어 본 건물 주차)
          </div>
          <div />
        </div>
      </LazyDiv>
    </>
  )
}
