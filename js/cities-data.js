// 방문 도시 목록. fetch 없이 항상 로드되도록 js 파일에 직접 내장한다.
// tools/convert-ramen.ps1이 라멘 제보에 새 도시가 있으면 자동으로 추가한다.
const CITIES = [
    {
        "id":  "rome",
        "name":  "로마",
        "country":  "이탈리아"
    },
    {
        "id":  "paris",
        "name":  "파리",
        "country":  "프랑스"
    },
    {
        "id":  "tokyo",
        "name":  "도쿄",
        "country":  "일본"
    },
    {
        "id":  "yokohama",
        "name":  "요코하마",
        "country":  "일본"
    }
];
