export interface globalResponse {
  status: number,
  message: string | object,
  error?: any,
  meta?: meta 
}

export interface meta {
  firstPage : number,
  currentPage : number,
  lastPage : number,
  count : number,
}