import { AssignmentComponent } from './pages/assignments/assignment.component';
import { AssignmentListComponent } from './pages/assignment-list/assignment-list.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'',component:AssignmentListComponent},
    {path:'assignmentList',component:AssignmentListComponent},
    {path:'assignment/:id',component:AssignmentComponent}
];
