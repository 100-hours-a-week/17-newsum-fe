# NewSum Frontend Project (웹툰 서비스 기반)

## 1. 프로젝트 개요

본 프로젝트는 최종적으로 **웹툰 서비스**를 목표로 하는 프론트엔드 애플리케이션입니다.

현재 개발 초기 단계(2025년 4월 15일 기준)로, 기본적인 프로젝트 구조 설정, 핵심 UI 컴포넌트 구현 방식, 상태 관리 및 라우팅 등의 **기술적인 기반을 마련하고 검증**하기 위해 임시로 **뉴스 요약 서비스('NewSum')** 형태로 주요 기능들을 구현했습니다.

따라서 현재 구현된 뉴스 목록, 상세 보기, 댓글 기능 등은 **웹툰 서비스 기능 구현을 위한 적절한 예시이자 견본(Boilerplate)**으로 활용될 수 있습니다. 개발자분들께서는 이 구조와 코드 예시를 바탕으로 실제 웹툰 서비스의 요구사항에 맞게 기능을 확장하고 수정해 나가시면 됩니다.

UI/UX는 **네이버 웹툰 사이트를 주요 벤치마킹 대상**으로 삼고 있으며, 현재 적용된 테마(보라/블랙/화이트)는 초기 시안을 기반으로 합니다.

## 2. 사용된 주요 기술 스택

* **Framework/Library:** React (v18+)
* **Language:** TypeScript
* **Build Tool:** Vite (with SWC for transpilation)
* **UI Library:** Material-UI (MUI) v5+
* **Routing:** React Router DOM v6+
* **HTTP Client:** Axios (설치 완료, API 연동 준비)
* **Linting/Formatting:** ESLint / Prettier (Vite 기본 설정 기반)

## 3. 현재까지 구현된 주요 기능 (예시 기반)

* **기본 프로젝트 설정:** Vite, TypeScript, MUI 테마, React Router 연동 완료.
* **반응형 레이아웃:**
    * Header (상단 앱 바)
    * Footer (하단 푸터)
    * Main Content Area
    * Bottom Navigation (모바일 전용 하단 바) - *신규 추가됨*
* **MUI 테마 커스터마이징:** 지정된 색상(보라/블랙/화이트) 및 폰트('Noto Sans KR') 적용, 일부 컴포넌트 기본 스타일 재정의.
* **뉴스 목록 페이지 (`HomePage`):**
    * 카테고리 탭 네비게이션 (MUI `Tabs`)
    * 뉴스 카드 형태의 그리드 목록 표시 (`ArticleCard` 컴포넌트)
    * 페이지네이션 기능 (MUI `Pagination`)
* **뉴스 상세 페이지 (`ArticlePage`):**
    * 기사 상세 정보 표시 (제목, 본문, 메타 정보 등)
    * **중첩/무한 대댓글 기능 (프론트엔드 상태 기반):**
        * 댓글 목록 재귀적 렌더링 (`RecursiveComment`, `CommentItem`)
        * 댓글 및 답글 입력 폼 (`CommentReplyForm`)
        * 댓글 추가/삭제 (로컬 상태 업데이트)
* **아이콘 활용:** 일부 UI 요소에 `@mui/icons-material` 아이콘 적용.

**※ 중요 참고사항:** 현재 모든 데이터는 `src/services/articleApi.ts` 내의 **목업 데이터**를 사용하며, 댓글 기능 등은 **프론트엔드의 로컬 상태**로만 관리되고 있습니다. **실제 API 연동은 진행되지 않은 상태**입니다.

## 4. 폴더 구조 개요 (`src` 내부)

* `components/`: 재사용 가능한 UI 컴포넌트 (Layout, article, comments 등)
* `pages/`: 라우트와 매핑되는 페이지 단위 컴포넌트
* `routes/`: 애플리케이션 라우팅 설정
* `services/`: API 호출 함수 및 관련 로직 (현재는 목업 데이터 및 함수 포함)
* `theme/`: MUI 커스텀 테마 설정
* `types/`: TypeScript 인터페이스 및 타입 정의
* `hooks/`: (아직 없음) 커스텀 React 훅
* `store/`: (아직 없음) 전역 상태 관리 (Context, Zustand, Redux 등)
* `utils/`: (아직 없음) 유틸리티 함수

## 5. 시작하기 (Getting Started)

1.  **저장소 클론:**
    ```bash
    git clone <repository-url>
    cd <project-folder-name>
    ```
2.  **의존성 설치:**
    ```bash
    npm install
    ```
3.  **환경 변수 설정:**
    * 프로젝트 루트에 `.env` 파일을 생성합니다.
    * 파일 안에 다음과 같이 실제 또는 개발용 API 기본 URL을 입력합니다. (Vite는 `VITE_` 접두사 필수)
        ```dotenv
        VITE_API_BASE_URL=http://localhost:8080/api
        ```
4.  **개발 서버 실행:**
    ```bash
    npm run dev
    ```
    * 브라우저에서 `http://localhost:5173` (또는 다른 포트)으로 접속합니다.

## 6. 향후 개발 방향 및 가이드라인

* **웹툰 서비스 기능 구현:** 현재 구현된 뉴스 관련 컴포넌트와 로직(`HomePage`, `ArticlePage`, `ArticleCard`, `articleApi` 등)은 **실제 웹툰 서비스의 요구사항(웹툰 목록, 상세 정보, 회차 목록, 뷰어, 별점/댓글 등)에 맞게 수정, 확장 또는 대체**되어야 합니다. 현재 코드는 그 구조와 MUI 활용법을 이해하는 데 중점을 두시기 바랍니다.
* **MUI 활용:** UI 개발 시 **MUI 공식 문서([https://mui.com/](https://mui.com/))** 를 적극적으로 참고하여 제공되는 다양한 컴포넌트와 커스터마이징 기능을 활용해 주세요. 현재 설정된 커스텀 테마를 기반으로 일관된 디자인을 유지합니다.
* **API 연동:** 다음 주요 개발 단계는 **실제 백엔드 API 연동**입니다. `src/services/` 폴더 내의 API 호출 함수들을 실제 API 명세에 맞게 수정하고, `axios` 또는 `Workspace`를 사용하여 데이터를 요청/응답 처리해야 합니다. 컴포넌트 레벨에서의 로딩 상태 처리 및 네트워크 에러 처리 구현이 필요합니다.
* **상태 관리:** 전역적으로 관리해야 할 상태 (예: 사용자 인증 정보)가 복잡해지면 Context API, Zustand, Redux Toolkit 등의 상태 관리 라이브러리 도입을 고려할 수 있습니다.
* **코드 품질:** 설정된 ESLint, Prettier 규칙을 준수하고, 재사용 가능한 컴포넌트 설계 및 TypeScript 타입 활용을 통해 유지보수하기 좋은 코드를 작성하는 것을 지향합니다.

---

본 README 파일이 프로젝트를 이해하고 다음 개발 단계를 진행하는 데 도움이 되기를 바랍니다. 궁금한 점이 있다면 언제든지 문의해 주세요. (by william)


---


## 라이브러리 가이드

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
