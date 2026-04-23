module.exports = {
  apps: [
    {
      name: "testus-prod",       // PM2 리스트에 표시될 앱 이름 (운영)
      script: "dist/index.js",     // Node.js 시작 파일 경로 (빌드된 JS 파일)
      instances: 7,             // CPU 코어 수만큼 인스턴스 실행 (클러스터 모드)
      exec_mode: "cluster",    // 클러스터 모드로 실행하여 부하 분산
      cron_restart: '0 5 * * *',    // cron 재시작 시간    
      autorestart: true,
      watch: false,                 // 파일 변경 감지 비활성화 (운영 환경에서는 비활성화 권장)
      
      // 로그 파일 경로 설정
      log_file: "logs/server/prod-combined.log",
      error_file: "logs/server/prod-error.log",
      out_file: "logs//server/prod-out.log",

      // 환경 변수 설정 (운영 환경)
      env_prod: {
        NODE_ENV: "prod",
        SERVER_PORT: "4025",
      },
    },
    {
      name: "testus-prod-worker",
      script: "dist/workers/index.js", 
      instances: 1, 
      exec_mode: "cluster",
      
      watch: false,
      
      // 로그 파일 경로 설정
      log_file: "logs/workers/prod-wroker-combined.log",
      error_file: "logs/workers/prod-wroker-error.log",
      out_file: "logs/workers/prod-wroker-out.log",

      // 환경 변수 설정 (운영 환경)
      env_prod: {
        NODE_ENV: "prod",
      },
    },
  ],
};