@Library('boxboat-dockhand@master')
import com.boxboat.jenkins.pipeline.promote.*

def promotions = [
  "",
  "prod",
]

properties([
  parameters([
    choice(name: 'promotionKey', choices: promotions, description: 'Promotion'),
    string(name: 'overrideEvent', description: 'Override promote from event, typically commit/<branch>, tag/<tag>, or imageTag/build-0123456789ab', defaultValue: ''),
    booleanParam(name: 'trigger', description: 'Skip Prompt', defaultValue: false),
    string(name: 'overrideBranch', description: 'Override branch', defaultValue: ''),
    string(name: 'overrideCommit', description: 'Override commit, commit must exist in branch', defaultValue: ''),
  ]),
  buildDiscarder(logRotator(numToKeepStr: '100')),
])

def promote = new BoxPromote()

node() {

  promote.wrap {
    stage('Promote'){
      promote.promote()
    }
  }

}
