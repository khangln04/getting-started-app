pipeline {
    agent any

    tools {
        nodejs 'node18'
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

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests'
                bat 'npm test'
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ Building application'
                bat 'npm run build'
            }
        }
    }

    post {
        success {
            echo '✅ CI Pipeline SUCCESS'
        }
        failure {
            echo '❌ CI Pipeline FAILED'
        }
    }
}
