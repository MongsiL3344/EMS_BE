/**
 * 유저가 대여 요청을 보낼때 받아야되는 요청객체타입
 */
export interface RentRequest {
  userId: number;
  itemId: number;
  quantity: number;
}

/**
 * 유저의 요청에서 확장한 대여처리의 응답타입
 */
export interface RentResponse extends RentRequest{
  itemId: number;
  rentDate: Date;
  dueDate: Date;
}

/**
 * 물품 테이블의 DTO
 */
export interface ItemInfo {
  itemId: number;
  itemName: string;
  itemCategory: string;
  totalQuantity: number;
  rentedQuantity: number;
  isRentable: number;
  maxQuantityPerRent: number;
  createdAt : Date;
  updatedAt : Date;
}

/**
 * 대여 트랜잭션 테이블의 DTO
 */
export interface RentTransaction {
  id : number;
  userId : number;
  itemId : number;
  quantity : number;
  rentedAt : Date;
  dueAt : Date;
  returnedAt : Date | null;
}
