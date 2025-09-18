// Single country object
export interface Country {
  id: number;
  name: string;
  code: string;
  phoneCode: string;
  active: boolean;
}




// Pagination meta-data
export interface PageData<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}



// Full API response
export interface ApiResponse<T> {
  traceId: string;
  statusCode: number;
  status: string;
  timestamp: string;
  message: string;
  data: PageData<T>;
}


// ApiResponse now has data as T[] not PageData<T>
export interface OtherApiResponse<T> {
  traceId: string;
  statusCode: number;
  status: string;
  timestamp: string;
  message: string;
  data: T; // 👈 array directly
}


