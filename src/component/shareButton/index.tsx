import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  KMAP_PLACE_ID,
  LOCATION,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import ktalkIcon from "../../icons/ktalk-icon.png"
import { LazyDiv } from "../lazyDiv"
import { useKakao } from "../store"

const baseUrl = import.meta.env.BASE_URL

export const ShareButton = () => {
  const kakao = useKakao()
  return (
    <LazyDiv className="footer share-button">
      <button
        className="ktalk-share"
        onClick={() => {
          if (!kakao) {
            return
          }

          const siteUrl =
            window.location.protocol +
            "//" +
            window.location.host +
            baseUrl

          kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: `${GROOM_FULLNAME} ❤️ ${BRIDE_FULLNAME}의 결혼식에 초대합니다.`,
              description:
                WEDDING_DATE.format(WEDDING_DATE_FORMAT) + "\n" + LOCATION,
              imageUrl: siteUrl + "/preview_image.jpg",
              link: {
                mobileWebUrl: siteUrl,
                webUrl: siteUrl,
              },
            },
            buttons: [
              {
                title: "초대장 보기",
                link: {
                  mobileWebUrl: siteUrl,
                  webUrl: siteUrl,
                },
              },
              {
                title: "위치 보기",
                link: {
                  mobileWebUrl: `https://place.map.kakao.com/${KMAP_PLACE_ID}`,
                  webUrl: `https://place.map.kakao.com/${KMAP_PLACE_ID}`,
                },
              },
            ],
          })
        }}
      >
        <img src={ktalkIcon} alt="ktalk-icon" /> 카카오톡으로 공유하기
      </button>
    </LazyDiv>
  )
}
