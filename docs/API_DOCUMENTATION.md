POST /api/Adress/AddAdress


İstek Gövdesi (Request Body): application/json 

Örnek Değerler:


"title": "string" 


"name": "string" 


"surname": "string" 


"email": "string@gmail.com" 


"phone": "05510876804" 


"address": "string" 


"city": "string" 


"district": "string" 


"postCode": "string" 

POST /api/Auth/Login


İstek Gövdesi (Request Body): application/json 

Örnek Değerler:


"email": "string" 


"password": "string" 

POST /api/Auth/RefreshTokenLogin


İstek Gövdesi (Request Body): application/json 

Örnek Değerler:


"refreshToken": "string" 

POST /api/Auth/Register


İstek Gövdesi (Request Body): application/json 

Örnek Değerler:


"firstName": "string" 


"lastName": "string" 


"phoneNumber": "string" 


"email": "string" 


"password": "string" 


"dateOfBirth": "2025-08-22" 


"gender": 0 

POST /api/Auth/ForgotPassword


İstek Gövdesi (Request Body): application/json 

Örnek Değerler:


"email": "string" 

POST /api/Auth/ResetPassword


İstek Gövdesi (Request Body): application/json 

Örnek Değerler:


"email": "string" 


"newPassword": "string" 


"token": "string" 

POST /api/Basket/AddItemToBasket


İstek Gövdesi (Request Body): application/json 

Örnek Değerler:


"productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6" 


"quantity": 0 


POST /api/Basket/DeleteBasketItem

İstek Gövdesi (Request Body): application/json

Örnek Değerler: {"basketItemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}

Yanıt (Responses): 200 OK

POST /api/Image/UploadImage

Parametreler: query formatında id (GUID) tipinde ProductId

İstek Gövdesi (Request Body): multipart/form-data

Yanıt (Responses): 200 OK

POST /api/Order/CreateOrder

İstek Gövdesi (Request Body): application/json

Örnek Değerler: {"adressId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}

Yanıt (Responses): 200 OK

GET /api/Order/ListCurrentUserOrders

Parametreler: Parametre yok.

Yanıt (Responses): 200 OK

GET /api/Product/GetProducts

Parametreler: query formatında currentPage (integer), pageSize (integer) ve category (string).

Yanıt (Responses): 200 OK

GET /api/Product/GetProductById

Parametreler: query formatında id (string, UUID).

Yanıt (Responses): 200 OK

GET /api/Product/GetFavoriteProducts

Parametreler: Parametre yok.

Yanıt (Responses): 200 OK

POST /api/Product/AddFavoriteProduct

İstek Gövdesi (Request Body): application/json

Örnek Değerler: {"productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}

Yanıt (Responses): 200 OK

POST /api/Product/AddProduct

İstek Gövdesi (Request Body): application/json

Örnek Değerler: {"name": "string", "description": "string", "price": 0, "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}

Yanıt (Responses): 200 OK

POST /api/Product/DeleteFavoriteProduct

İstek Gövdesi (Request Body): application/json

Örnek Değerler: {"productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}

Yanıt (Responses): 200 OK


POST /api/ProductDetail/AddProductDetail

İstek Gövdesi (Request Body): application/json

Örnek Değerler:

JSON

[
  {
    "productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "color": "string",
    "size": "string",
    "stockQuantity": 0
  }
]
Yanıt (Responses): 200 OK

POST /api/Stock/AddStock

İstek Gövdesi (Request Body): application/json

Örnek Değerler:

JSON

{
  "addStock": [
    {
      "productTypeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "quantity": 0
    }
  ]
}
Yanıt (Responses): 200 OK

POST /api/User/UpdateUser

İstek Gövdesi (Request Body): application/json

Örnek Değerler:

JSON

{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstName": "string",
  "gender": 0,
  "lastName": "string",
  "dateOfBirth": "2025-08-22",
  "email": "string",
  "phoneNumber": "string",
  "password": "string"
}
Yanıt (Responses): 200 OK

GET /api/User/GetUserById

Parametreler: query formatında id (string, UUID)

Yanıt (Responses): 200 OK

POST /api/User/ChangePassword

İstek Gövdesi (Request Body): application/json

Örnek Değerler:

JSON

{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "oldPassword": "string",
  "newPassword": "string"
}
Yanıt (Responses): 200 OK