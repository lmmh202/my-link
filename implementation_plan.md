# Implementation Plan: Linktree Clone Project (Version 2)

## 프로젝트 개요

사용자가 자신만의 프로필 페이지를 생성하고, 여러 링크를 한 곳에 모아 공유할 수 있는 Linktree 형태의 웹 서비스 구축 계획입니다.

## 기술 스택

- 프론트엔드: Next.js, React
- 스타일링: Tailwind CSS (반응형 디자인 적용)
- UI 컴포넌트: shadcn/ui
- 데이터베이스 및 인증: Firebase (Firestore, Firebase Auth)
- 배포 환경: Vercel

## 데이터베이스 스키마 설계 (Firestore)

모든 데이터 모델의 변수명은 lowerCamelCase를 준수합니다.

### users 컬렉션

- userId (문자열): 고유 식별자
- displayName (문자열): 사용자 이름
- bioText (문자열): 짧은 소개글
- profileImageUrl (문자열): 프로필 이미지 주소

### links 컬렉션

- linkId (문자열): 링크 고유 식별자
- userId (문자열): 소유자 식별자
- linkTitle (문자열): 링크 제목
- targetUrl (문자열): 이동할 URL
- clickCount (숫자): 클릭 통계 횟수
- createdAt (타임스탬프): 생성일

---

## 단계별 구현 계획 및 PR(Pull Request) 전략

각 단계는 독립적인 PR로 생성하여 리뷰와 테스트가 용이하도록 구성합니다. 작업을 시작할 때는 브랜치를 생성하고 전환하는 명령어를 사용합니다.

- 명령어: git switch -c [브랜치명]
  - git: Global Information Tracker (분산 버전 관리 시스템)
  - switch: 브랜치를 변경하는 명령어
  - -c: create (새로운 브랜치를 생성하고 전환하라는 옵션)

### Phase 1: 프로젝트 초기 세팅

프로젝트의 뼈대를 잡고 필요한 라이브러리를 설치하는 단계입니다.

- 브랜치명: feature/init-project
- 커밋 메세지 가이드 (영문):
  - chore: set up Next.js and Tailwind CSS environment
    - 명령어: npx create-next-app
      - npx: Node Package eXecute (패키지를 설치하지 않고 실행하는 도구)
  - chore: initialize shadcn/ui and install base components
    - 명령어: npx shadcn-ui@latest init
  - chore: configure Firebase project SDK connection
    - SDK: Software Development Kit (소프트웨어 개발 도구 모음)

### Phase 2: 사용자 인증 (구글 소셜 로그인)

Firebase Auth를 활용하여 구글 계정으로 로그인할 수 있는 기능을 구현합니다.

- 브랜치명: feature/auth-google
- 커밋 메세지 가이드 (영문):
  - feat: integrate Firebase Google Auth provider
  - feat: implement AuthContext and useAuth hook for global state
  - feat: design login page responsive UI with shadcn/ui

### Phase 3: 관리자 대시보드 - 프로필 관리

로그인한 사용자가 자신의 이름, 소개글, 이미지를 설정할 수 있는 페이지입니다.

- 브랜치명: feature/admin-profile
- 커밋 메세지 가이드 (영문):
  - feat: implement profile fetching and updating with Firestore
  - feat: build profile form UI for name, bio, and image upload
  - feat: integrate Firebase Storage for profile image uploads

### Phase 4: 관리자 대시보드 - 링크 CRUD

사용자가 공유할 링크들을 추가하고 수정, 삭제할 수 있는 핵심 기능입니다.

- 브랜치명: feature/admin-links
- 커밋 메세지 가이드 (영문):
  - feat: implement create link functionality
  - feat: implement fetch links with real-time update
  - feat: implement update and delete link functionalities
  - feat: design responsive link list UI for admin dashboard

### Phase 5: 퍼블릭 프로필 페이지 및 조회수 통계

외부 사용자들에게 공유되는 실제 프로필 화면과 클릭 통계 기능을 구현합니다.

- 브랜치명: feature/public-page-and-stats
- 커밋 메세지 가이드 (영문):
  - feat: create dynamic route page for public profiles
  - feat: design responsive layout for public linktree view
  - feat: implement click count increment logic on link click
  - feat: add link click statistics dashboard for admin view

### Phase 6: SEO 설정 및 서비스 배포

카카오톡 등에서 링크 공유 시 예쁘게 보이도록 OG 태그를 설정하고 Vercel에 배포합니다.

- 브랜치명: feature/seo-and-deploy
- 커밋 메세지 가이드 (영문):
  - feat: add dynamic Open Graph tags for KakaoTalk preview
  - chore: configure environment variables and connect Vercel pipeline
    - 명령어: git push -u origin feature/seo-and-deploy
      - push: 로컬 저장소의 변경 사항을 원격 저장소로 업로드하는 명령어
      - -u: upstream (로컬 브랜치와 원격 브랜치를 동기화 및 연결하는 옵션)
