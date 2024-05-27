import { IDevice } from './device';
import { IStudent } from './student';

export interface IAssignment{
    id: number,
    studentId: number,
    deviceId: number,
    selecType: number,
    loanDate: string | null | undefined;
    deadline: string | null | undefined;
    device: IDevice | null | undefined;
    student: IStudent | null | undefined;
}