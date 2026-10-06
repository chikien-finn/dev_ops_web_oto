pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub-creds'
        DOCKERHUB_USER = 'kienfinn'
        DB_PASSWORD = credentials('db-password')
        IMAGE_TAG = "${BUILD_NUMBER}"
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

        stage('Build Images') {
            steps {
                sh '''
                    docker build -t ${DOCKERHUB_USER}/oto-api:${IMAGE_TAG} -t ${DOCKERHUB_USER}/oto-api:latest ./server
                    docker build -t ${DOCKERHUB_USER}/oto-web:${IMAGE_TAG} -t ${DOCKERHUB_USER}/oto-web:latest .
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh '''
                    docker push ${DOCKERHUB_USER}/oto-api:${IMAGE_TAG}
                    docker push ${DOCKERHUB_USER}/oto-api:latest
                    docker push ${DOCKERHUB_USER}/oto-web:${IMAGE_TAG}
                    docker push ${DOCKERHUB_USER}/oto-web:latest
                '''
            }
        }

        stage('Deploy Local Stack') {
            steps {
                sh '''
                    docker compose -p dev_ops_web_oto -f docker-compose.prod.yml down --remove-orphans || true
                    docker compose -p dev_ops_web_oto -f docker-compose.prod.yml up -d
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sleep 10
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
