export interface User {
    user: string;
    rate: null | string;
}
  
export interface Room {
    [detail: string]: User;
}
  
export interface Rooms {
    [detail: string]: Room;
}