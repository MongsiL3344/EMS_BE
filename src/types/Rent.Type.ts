import type {RowDataPacket} from "mysql2/promise";
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
 * 물품 테이블값을 사용할 떄 쓰는 타입
 */
export interface ItemInfo {
  itemId: number;
  itemName: string;
  itemCategory: string;
  totalQuantity: number;
  rentedQuantity: number;
  currentQuantity: number;
  isRentable: boolean;
  maxQuantityPerRent: number;
  createdAt : Date;
  updatedAt : Date;
}

/**
 * 물품 테이블의 DTO
 */
export type ItemRow = RowDataPacket & {
  id: number;
  name: string;
  category: string;
  total_quantity: number;
  rented_quantity: number;
  is_rentable: 0 | 1;
  max_quantity_per_rent: number;
  created_at: Date;
  updated_at: Date;
};


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
