pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        NODE_ENV = 'production'
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

        stage('Build / Validate App') {
            steps {
                echo '🏗️ Validate application start'
                bat '''
                echo Checking Node version
                node -v

                echo Checking NPM version
                npm -v
                '''
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD SUCCESS'
        }
        failure {
            echo '❌ CI/CD FAILED'
        }
    }
}
