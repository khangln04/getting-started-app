pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        NODE_ENV = 'test'
        SQLITE_DB = 'C:\\etc\\todos\\todo.db'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checkout source code'
                checkout scm
            }
        }

        stage('Prepare Environment (IMPORTANT)') {
            steps {
                echo '🧹 Cleaning up old Node processes & SQLite DB'
                bat '''
                echo Kill all running node processes
                taskkill /F /IM node.exe >nul 2>&1 || echo No node process running

                echo Remove old SQLite database if exists
                if exist "%SQLITE_DB%" (
                    del /F "%SQLITE_DB%"
                )
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies'
                bat 'npm install'
            }
        }

        stage('Run Tests (CI Safe)') {
            steps {
                echo '🧪 Running Jest safely on Windows'
                bat '''
                npx jest --runInBand --detectOpenHandles --forceExit
                '''
            }
        }
    }

    post {
        always {
            echo '🧹 Final cleanup'
            bat '''
            taskkill /F /IM node.exe >nul 2>&1 || echo No node process running
            if exist "%SQLITE_DB%" (
                del /F "%SQLITE_DB%"
            )
            '''
        }
        success {
            echo '✅ CI SUCCESS – Tests passed safely'
        }
        failure {
            echo '❌ CI FAILED – SQLite file lock detected'
        }
    }
}
