// Matches this VPS's existing Jenkins convention (see streamerdle/ercu-bot):
// the Jenkins job builds/validates in its own ephemeral workspace, then the
// Deploy stage operates on a separate, persistent clone at
// /home/furkan/nerdeydim (git pull + docker compose up -d --build), since
// that's the directory the Jenkins container has bind-mounted from the host
// (along with the Docker socket) — see /home/furkan on the VPS.
//
// One-time setup on the VPS:
//   git clone <repo-url> /home/furkan/nerdeydim
//   cd /home/furkan/nerdeydim
//   cp .env.production.example .env   # fill in real POSTGRES_PASSWORD / AUTH_SECRET / NEXTAUTH_URL
// Then add an Nginx site (see nginx/nerdeydim.conf.example) proxying to
// 127.0.0.1:$APP_PORT (default 3002 — 3000/3001 are already taken on this box).

pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        DEPLOY_DIR = '/home/furkan/nerdeydim'
        // Only used to satisfy prisma.config.ts / the `postinstall` (prisma
        // generate) hook during CI steps below — never connects to a database.
        DATABASE_URL = 'postgresql://user:password@localhost:5432/db'
    }

    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint & typecheck') {
            steps {
                sh 'npm run lint'
                sh 'npx tsc --noEmit'
            }
        }

        stage('Docker build') {
            steps {
                sh 'docker build -t nerdeydim:${BUILD_NUMBER} .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    if [ ! -f "$DEPLOY_DIR/.env" ]; then
                        echo "Missing $DEPLOY_DIR/.env — copy .env.production.example there and fill it in first."
                        exit 1
                    fi
                    git config --global --add safe.directory "$DEPLOY_DIR"
                    cd "$DEPLOY_DIR"
                    git pull
                    docker compose -f docker-compose.prod.yml up -d --build
                '''
            }
        }

        stage('Health check') {
            steps {
                sh '''
                    cd "$DEPLOY_DIR"
                    PORT=$(grep -E '^APP_PORT=' .env | cut -d= -f2)
                    PORT=${PORT:-3002}
                    for i in $(seq 1 15); do
                        if curl -sf "http://127.0.0.1:${PORT}/login" > /dev/null; then
                            echo "App is up."
                            exit 0
                        fi
                        sleep 2
                    done
                    echo "App did not become healthy in time."
                    docker compose -f docker-compose.prod.yml logs --tail=100 app
                    exit 1
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            echo 'Deploy failed — check the stage logs above and `docker compose -f docker-compose.prod.yml logs app` in /home/furkan/nerdeydim on the VPS.'
        }
    }
}
