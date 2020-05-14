import { Scenario } from '../scenario/Scenario';

export class Course {
    id: string;
    name: string;
    description: string;
    weight: number;
    draft: boolean;
    scenarioCount: number;
    scenarios: Scenario[];
}
