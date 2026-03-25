/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext } from "react"

export const StoreContext = createContext({
  kakao: null as any,
  setKakao: (() => {}) as (kakao: any) => void,
  kakaoMaps: null as any,
  setKakaoMaps: (() => {}) as (kakaoMaps: any) => void,
})
