/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext, useEffect } from "react"
import { StoreContext } from "./context"
import { KAKAO_SDK_JS_KEY } from "../../env"

const baseUrl = import.meta.env.BASE_URL

const KAKAO_SDK_URL = `${baseUrl}/kakao_js_sdk/2.7.1/kakao.min.js`
const KAKAO_MAPS_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_SDK_JS_KEY}&autoload=false`

export const useKakao = () => {
  const { kakao, setKakao } = useContext(StoreContext)
  useEffect(() => {
    if (!KAKAO_SDK_JS_KEY) {
      return
    }

    if (!document.querySelector(`script[src="${KAKAO_SDK_URL}"]`)) {
      const script = document.createElement("script")
      script.addEventListener("load", () => {
        if (!(window as any).Kakao.isInitialized()) {
          ;(window as any).Kakao.init(KAKAO_SDK_JS_KEY)
        }
        setKakao((window as any).Kakao)
      })
      script.src = KAKAO_SDK_URL
      document.head.appendChild(script)
    }
  }, [setKakao])

  return kakao
}

export const useKakaoMaps = () => {
  const { kakaoMaps, setKakaoMaps } = useContext(StoreContext)
  useEffect(() => {
    if (!KAKAO_SDK_JS_KEY) {
      return
    }

    if (!document.querySelector(`script[src="${KAKAO_MAPS_URL}"]`)) {
      const script = document.createElement("script")
      script.addEventListener("load", () => {
        ;(window as any).kakao.maps.load(() => {
          setKakaoMaps((window as any).kakao.maps)
        })
      })
      script.src = KAKAO_MAPS_URL
      document.head.appendChild(script)
    }
  }, [setKakaoMaps])

  return kakaoMaps
}
