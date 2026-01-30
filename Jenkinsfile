pipeline {
    agent any

    // Định nghĩa công cụ Node.js đã cấu hình trong Global Tool Configuration
    tools {
        nodejs 'node18'
    }

    // Thiết lập biến môi trường
    environment {
        NODE_ENV = 'test'
        SQLITE_DB = 'C:\\etc\\todos\\todo.db'
    }

    stages {
        stage('Step 1: Checkout Source Code') {
            steps {
                echo '📥 Đang lấy mã nguồn từ Repository...'
                checkout scm
            }
        }

        stage('Step 2: Prepare Environment') {
            steps {
                echo '🧹 Đang dọn dẹp các tiến trình Node cũ và file DB bị khóa...'
                bat """
                @echo off
                echo Đang tắt các tiến trình node.exe để giải phóng file...
                taskkill /F /IM node.exe /T >nul 2>&1 || echo Không có tiến trình Node nào đang chạy.

                echo Đang xóa file cơ sở dữ liệu cũ tại: %SQLITE_DB%
                if exist "%SQLITE_DB%" (
                    del /F /Q "%SQLITE_DB%"
                ) else (
                    echo File DB không tồn tại, bỏ qua bước xóa.
                )
                """
            }
        }

        stage('Step 3: Install Dependencies') {
            steps {
                echo '📦 Đang cài đặt các thư viện (node_modules)...'
                bat "npm install"
            }
        }

        stage('Step 4: Run Automation Tests') {
            steps {
                echo '🧪 Đang chạy kiểm thử với Jest...'
                // Giải thích tham số:
                // --runInBand: Chạy tuần tự các file test (tránh tranh chấp file DB)
                // --detectOpenHandles: Phát hiện các kết nối chưa đóng
                // --forceExit: Thoát ngay sau khi xong
                // --no-cache: Tránh việc Jest sử dụng dữ liệu cũ gây lỗi
                bat "npx jest --runInBand --detectOpenHandles --forceExit --no-cache"
            }
        }
    }

    // Các hành động chạy sau khi các Stage hoàn tất
    post {
        always {
            echo '🧹 Dọn dẹp cuối cùng: Đóng mọi tiến trình còn sót lại...'
            bat """
            @echo off
            taskkill /F /IM node.exe /T >nul 2>&1 || echo Dọn dẹp hoàn tất.
            """
        }
        success {
            echo '✅ Chúc mừng! Pipeline đã chạy thành công.'
        }
        failure {
            echo '❌ Pipeline thất bại. Vui lòng kiểm tra log để biết chi tiết.'
        }
    }
}