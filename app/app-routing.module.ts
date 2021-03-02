import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { ResultComponent } from './result/result.component';
import { CmsComponent } from './cms/cms.component';
import { QuestionsComponent } from './questions/questions.component';
import { RulesComponent } from './rules/rules.component';
import { StartQuestionComponent } from './start-question/start-question.component';
import { EndQuestionComponent } from './end-question/end-question.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'challenge',
    component: ChallengeComponent,
  },
  {
    path: 'result',
    component: ResultComponent,
  },
  {
    path: 'cms',
    component: CmsComponent,
  },
  {
    path: 'questions/:id',
    component: QuestionsComponent,
  },
  {
    path: 'questions',
    component: QuestionsComponent,
  },
  {
    path: 'rules',
    component: RulesComponent,
  },
  {
    path: 'start',
    component: StartQuestionComponent,
  },
  {
    path: 'end',
    component: EndQuestionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
