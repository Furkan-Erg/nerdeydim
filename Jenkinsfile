// Jenkins pipeline: builds the Docker image and (re)deploys it with docker-compose
// on the same machine the Jenkins job runs on (expected to be the VPS itself, or a
// machine with access to its Docker daemon).
//
// One-time setup on the VPS, in the Jenkins job's workspace directory:
//   cp .env.production.example .env
//   (fill in real POSTGRES_PASSWORD / AUTH_SECRET / NEXTAUTH_URL / APP_PORT)
// This .env file is gitignored and is NOT touched by checkouts/pulls, so it
// survives every deploy. Point your existing Nginx reverse proxy at APP_PORT.

pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        COMPOSE_FILE = 'docker-compose.prod.yml'
        APP_PORT = "${env.APP_PORT ?: '3000'}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify env file') {
            steps {
                sh '''
                    if [ ! -f .env ]; then
                        echo "Missing .env in the deploy workspace."
                        echo "Copy .env.production.example to .env and fill in real values first."
                        exit 1
                    fi
                '''
            }
        }

        stage('Build image') {
            steps {
                sh 'docker compose -f $COMPOSE_FILE build app'
            }
        }

        stage('Deploy') {
            steps {
                // Migrations + reference-data seeding run automatically inside the
                // app container's entrypoint (docker-entrypoint.sh) before it starts.
                sh 'docker compose -f $COMPOSE_FILE up -d'
            }
        }

        stage('Health check') {
            steps {
                sh '''
                    PORT=$(grep -E '^APP_PORT=' .env | cut -d= -f2)
                    PORT=${PORT:-3000}
                    for i in $(seq 1 15); do
                        if curl -sf "http://localhost:${PORT}/login" > /dev/null; then
                            echo "App is up."
                            exit 0
                        fi
                        sleep 2
                    done
                    echo "App did not become healthy in time."
                    docker compose -f $COMPOSE_FILE logs --tail=100 app
                    exit 1
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {
        failure {
            echo 'Deploy failed — check the stage logs above and `docker compose -f docker-compose.prod.yml logs app` on the VPS.'
        }
    }
}
