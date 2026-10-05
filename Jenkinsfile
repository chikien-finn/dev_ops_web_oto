pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub-creds'
        DOCKER_USER = 'kienfinn'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                }
            }
        }

        stage('Build & Deploy Local Stack') {
            steps {
                sh '''
                    docker compose -f docker-compose.prod.yml down --remove-orphans || true
                    docker compose -f docker-compose.prod.yml up -d --build
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sleep 5
                sh '''
                    curl -f http://localhost:8081/api/health || exit 1
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
        success {
            echo 'Deployment thành công!'
        }
        failure {
            echo 'Pipeline thất bại, vui lòng kiểm tra console log.'
        }
    }
}
