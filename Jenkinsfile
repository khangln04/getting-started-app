pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        // Tránh dùng path cứng C:\etc\
        TODO_DB_PATH = "${WORKSPACE}\\todo-test.db"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checkout source code'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies'
                bat 'npm install'
            }
        }

        stage('Run Tests (SQLite Safe)') {
            steps {
                echo '🧪 Running tests sequentially to avoid SQLite lock'
                bat '''
                set NODE_ENV=test
                npx jest --runInBand
                '''
            }
        }
    }

    post {
        success {
            echo '✅ CI SUCCESS – All tests passed'
        }
        failure {
            echo '❌ CI FAILED – Check SQLite file lock'
        }
        always {
            echo '🧹 Cleanup test database'
            bat 'if exist "%WORKSPACE%\\todo-test.db" del /f "%WORKSPACE%\\todo-test.db"'
        }
    }
}
