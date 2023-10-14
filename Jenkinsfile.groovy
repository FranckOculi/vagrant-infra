node{
    try{
        stage('Première étape'){
            sh "echo 'Hello World!!!'"
        }
        stage('Première étape'){
            sh "echo '2ème étape !'"
        }
    } finally{
        cleanWs()
    }
}