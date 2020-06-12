export class AccessCode {
    id: string;
    code: string;
    description: string;
    scenarios: string[];
    courses: string[];
  	expiration: Date;
	  virtual_machine_sets: string[];
	  restricted_bind: boolean;
    restricted_bind_value: string;
    max_users: number;
    allowed_domains: string[];
}
