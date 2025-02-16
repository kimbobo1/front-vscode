  
운동 일정 관리APi를 제공하는 spring boot백엔드와 React 기반의 프론트엔드로 구성되어 있습니다
사용자가 특정 날짜에 운동일정을 등록하고 세트단위로 관리 진행상황을 체크할수있습니다
필수환경 구성
java 17 이상 mysql maven 
npm install axios framer-motion react-calendar react-dom react-router-dom react-scripts react recharts web-vitals


React-Calendar : 사용자가 특정 날짜를 선택하고, 해당 날짜의 운동 일정을 확인할 수 있도록 구현하기 위해 사용
Axios : 백엔드(Spring Boot) API와 원활하게 연동하여 데이터를 주고받기 위해 사용
React-Router-Dom : 페이지 이동을 원활하게 하기 위해 사용
Recharts : 사용자의 운동 기록을 차트로 시각화하여 제공
실행 방법 메뉴얼
백엔드서버를 켠후 프론트엔드에서 서버를 킨다 회원가입을하고 로그인을한후 운동일지를 추가
