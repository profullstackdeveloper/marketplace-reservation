import { User } from "@src/domain/models/User.entity";

export interface TrackerDTO {
    referrer?: User;
    referrees?: User[]
}