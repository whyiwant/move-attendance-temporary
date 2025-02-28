export interface PastoralTeam {
  cg?: string; // cg id
  cluster?: string; // cluster id
  st?: string; // small team id
}

export class AppUser {
  id: string;
  name: string;
  phoneNum: string; // phone number or email
  permission: string; // equivalent to pastoral status
  pastoral_team?: PastoralTeam;
  permissions?: string[];

  constructor(id: string, name: string, phoneNum: string, permission: string) {
    this.id = id;
    this.name = name;
    this.phoneNum = phoneNum;
    this.permission = permission;
  }
}
